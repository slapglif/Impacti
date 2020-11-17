import React from 'react';
import './product-edit.style.scss';
import { MDBRow, MDBCol, MDBIcon } from 'mdbreact';
import FormButton from '../../../components/form-button/form-button.component';
import Switch from 'react-switch';
import { getCurrentCategories } from '../../../redux/category/category.action';
import { useState, useEffect, useRef } from 'react';
import FormSelect from '../../../components/form-select/form-select.component';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getCurrentProductItem, addGalleryImages, removeGalleryImage, updateProduct } from '../../../redux/product-list/product-list.action';
import { loadPage } from '../../../redux/user/user.action';
import { Storage } from 'aws-amplify';
import { useDropzone } from 'react-dropzone';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router-dom';

const ProductEditPage = withRouter(({
    location, 
    getCurrentCategories, 
    getCurrentProductItem, 
    addGalleryImages, 
    removeGalleryImage, 
    updateProduct,
    loadPage}) => {

    const urlHistory = useHistory();  

    const alert = useAlert();

    const [isStatusActive, setIsStatusActive] = useState(false);
    const [updateInfo, setUpdateInfo] = useState({
        title: "",
        desciption: "",
        price: 0,
        seatNum: 0,
        id: "",
        prodType: ""
    })
    
    // for select box of category
    const categoryList = useRef(null);
    const [categorySelect, setCategorySelect] = useState([]);
    const [categorySelectShow, setCategorySelectShow] = useState(false);
    const [currentCategorySelect, setCurrentCategorySelect] = useState("");

    // for gun photo
    const imageList = useRef(null);
    const [mainImageUrl, setMainImageUrl] = useState({id: null, url: null});
    const [galleryUrls, setGalleryUrls] = useState([]);   

    useEffect(() => {
        async function loadCategories() {
            loadPage(true);
            const categories = await getCurrentCategories(true);
            if (categories) {
                categoryList.current = categories;
                const webinarCategories = [];
                categories.map(category=>{
                    if ((category.product_type === "Webinar") || (category.product_type === "Both"))
                    webinarCategories.push(category.category_name);
                })
                setCategorySelect([...webinarCategories]);
            } 
            if (location && location.state && location.state.prodType && location.state.id) {
                const result = await getCurrentProductItem(location.state.id, location.state.prodType);
                console.log(result);
                if (result) {
                    if (result.product_type === "webinar") {
                        setUpdateInfo({
                            title: result.name,
                            desciption: result.shortDescription,
                            price: result.price_per_seats,
                            seatNum: result.seats,
                            id: result.id,
                            prodType: result.product_type
                        });
                    }
                    else {
                        setUpdateInfo({
                            title: result.productName,
                            desciption: result.shortDescription,
                            price: result.pricePerItem,
                            seatNum: result.amount,
                            id: result.id,
                            prodType: result.product_type
                        });
                    }
                    if (result.product_status === "active")
                        setIsStatusActive(true);
                    else
                        setIsStatusActive(false);

                    const currentCat = categoryList.current.filter(category => category.id === result.category_id);
                    setCurrentCategorySelect(currentCat[0].category_name);

                    result.main_image ? setMainImageUrl({
                                            id: result.main_image.id,
                                            url: await Storage.get(result.main_image.image_url)
                                        })
                                    :
                                    setMainImageUrl(null)

                    if ( result.pictures.length > 0) {
                        imageList.current = result.pictures;
                        const galleryImgs = [];
                        for (let i=0; i<result.pictures.length; i++) {
                            galleryImgs.push({
                                id: result.pictures[i].id,
                                url: await Storage.get(result.pictures[i].image_url)
                            });
                        }
                        setGalleryUrls([...galleryImgs]);
                    }                   
                }                    
            }
            loadPage(false);                 
        }
        
        loadCategories();
        
    }, []);

    const [addingImageUrls, setAddingImageUrls] = useState([]);
    
    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            if ((acceptedFiles.length + galleryUrls.length) > 10){
                alert.error("Count of images should be less than 10");
                return;
            }
            else
                setAddingImageUrls(acceptedFiles.map(file => Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })));
        }
    });

    const imagesUpload = async (files) => {
        const imagesList = [];
        for(let i=0; i < files.length; i++) { 
            const stored = await Storage.put("products-"+Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)+"-"+files[i].name, files[i], {
                contentType: files[i].type,
                cacheControl: 'max-age=31536000'
            });
    
            imagesList.push(stored.key);            
        }
        return imagesList;        
    }

    useEffect(() => {
        async function add() {
            loadPage(true);
            const addImageList = await imagesUpload(addingImageUrls);
            const result = await addGalleryImages({
                imageLists: addImageList,
                product_type: updateInfo.prodType,
                product_id: updateInfo.id
            });

            if ( result.length > 0) {
                alert.success("Image uploaded successfully");
                imageList.current = result;
                const galleryImgs = [];
                for (let i=0; i<result.length; i++) {
                    galleryImgs.push({
                        id: result[i].id,
                        url: await Storage.get(result[i].image_url)
                    });
                }
                setGalleryUrls([...galleryImgs]);
            }
            else
                alert.error("Image uploading failed");
            loadPage(false);
        }
        addingImageUrls.length > 0 && add();
    }, [addingImageUrls]);

    const removeImage = async (imageID) => {
        const obj = {
            imageListIds: [imageID],
            product_type: updateInfo.prodType,
            product_id: updateInfo.id
        }
        loadPage(true);
        const result = await removeGalleryImage(obj);
        if ( result === "success") {
            alert.success("Removed successfully");
            setGalleryUrls(galleryUrls.filter(image => image.id !== imageID));
            mainImageUrl.id === imageID && setMainImageUrl(null);

        }
        else
            alert.error("Removing failed");
        loadPage(false);
    }

    const setMainImageFunc = async (image) => {
        const obj = {
            product_id: updateInfo.id,
            product_type: updateInfo.prodType.toLowerCase(),
            primary_image_id: image.id
        }
        loadPage(true);
        const result = await updateProduct(obj);
        loadPage(false);
        if (result === "success"){
            alert.success("Changed main image successfully");
            setMainImageUrl({
                id: image.id,
                url: image.url
            });
        }
           
        else
            alert.error("Changing failed");
        

    }

    const getCurrentCategoryId = () => {       
        const result = categoryList.current.filter(category => category.category_name === currentCategorySelect);
        return result[0].id;
    }

    const updateFunc = async () => {
        const obj = {
            product_id: updateInfo.id,
            product_type: updateInfo.prodType.toLowerCase()
        }
        if ( updateInfo.prodType.toLocaleLowerCase() === "webinar") {
            obj.name = updateInfo.title;
            obj.shortDescription = updateInfo.desciption;
            obj.price_per_seats = updateInfo.price;
            obj.seats = updateInfo.seatNum;
        }
        else {
            obj.productName = updateInfo.title;
            obj.shortDescription = updateInfo.desciption;
            obj.pricePerItem = updateInfo.price;
            obj.amount = updateInfo.seatNum;
        }

        obj.product_status = isStatusActive ? "active" : "inactive";
        obj.category_id = getCurrentCategoryId();
        
        loadPage(true);
        const result = await updateProduct(obj);
        loadPage(false);
        if (result === "success"){
            alert.success("Updated successfully");
            urlHistory.push("/product/product/listing");
        }           
        else
            alert.error("Updating failed");
    }

    return (
        <div className="product-edit">
           <MDBRow className="headerRow">
                <MDBCol size="12" sm="12" md="9" lg="10">
                    <h2 className="text-white font-weight-bold">Edit Product</h2>
                </MDBCol>
                <MDBCol size="6" sm="6" md="3" lg="2">
                    <FormButton onClickFunc={()=>updateFunc()}>UPDATE</FormButton>
                </MDBCol>
            </MDBRow>
            <MDBRow>
                <MDBCol size="12" sm="12" md="12" lg="8" className="section">
                    <div className="status-div mb-4">
                        <div>
                            <h4 className="text-white">Status</h4>
                            <p className="pr-4">Lorem ipsum dolor sit amet, consectetur adipisicing edit, sed do eiusmed tempor incididunt ut labore et dolore.</p>
                        </div>
                        <Switch height={34} width={110} checkedIcon={"Active"} uncheckedIcon={"Inactive"} onColor="#57bd7a" onChange={()=>setIsStatusActive(!isStatusActive)} checked={isStatusActive} />
                    </div>
                    <hr className="mb-4"/>

                    <h4 className="text-white mb-4">Product Details</h4>
                    <p className="label-p">Product Title</p>
                    <input className="custom-input mb-4" type="text" value={updateInfo.title} onChange={(event) => setUpdateInfo({...updateInfo, title: event.target.value})}/>

                    <p className="label-p">Product Category</p>
                    <FormSelect 
                        options={categorySelect} 
                        showSelectBox={() => setCategorySelectShow(!categorySelectShow)} 
                        selectOption = {(event) => {
                                setCategorySelectShow(false);
                                setCurrentCategorySelect(event.target.id);
                                }} 
                        optionShow={categorySelectShow} 
                        placeholder={currentCategorySelect}/>

                    <p className="label-p mt-4">Product Description</p>
                    <textarea className="mb-4" rows="7" value={updateInfo.desciption} onChange={(event)=>setUpdateInfo({...updateInfo, desciption: event.target.value})}></textarea>

                    <MDBRow className="mb-4">
                        <MDBCol size="12" sm="12" md="6" lg="6" className="pl-0">
                            <p className="label-p">Price</p>
                            <input className="custom-input" type="text" value={updateInfo.price} onChange={event=>setUpdateInfo({...updateInfo, price: event.target.value})}/>
                        </MDBCol>
                        <MDBCol size="12" sm="12" md="6" lg="6" className="pr-0">
                            <p className="label-p">{`${updateInfo.prodType === "webinar" ? 'No. of Seat':'Inventory'}`}</p>
                            <input className="custom-input" type="text" value={updateInfo.seatNum} onChange={event => setUpdateInfo({...updateInfo, seatNum: event.target.value})}/>
                        </MDBCol>
                    </MDBRow>


                </MDBCol>
                <MDBCol size="12" sm="10" md="6" lg="4" className="pr-0">
                    <div className="photo-div">
                        <p className="label-p text-white">Product Image</p>
                        {
                            mainImageUrl ? <img src={mainImageUrl.url} className="active-img" alt={updateInfo.title}/> 
                            :
                            <div className="non-image">
                                No Image Set
                            </div>
                        }                       
                                          
                    </div>
                    <div className="photo-div">
                        <p className="label-p text-white">Product Gallery</p>
                        <MDBRow>
                            {
                                galleryUrls && galleryUrls.length > 0 ? galleryUrls.map(
                                    (image,i) => <MDBCol key={i} size="4" className="gallery-item">
                                                <img src={image.url} alt="active image"/>
                                                <MDBIcon far icon="check-circle" className="checkIcon" onClick={()=>setMainImageFunc(image)}/>
                                                <MDBIcon far icon="times-circle" className="removeIcon" onClick={()=>removeImage(image.id)}/>
                                            </MDBCol>
                                )
                                :
                                <div className="non-image gallery">
                                    No Gallery
                                </div>                                
                            }
                        </MDBRow>
                        <div {...getRootProps({className: 'dropzone'})}>
                            <input {...getInputProps()} className="addImageInput"/>
                            <label className="add-gallery">Add Product Gallery Images</label>
                        </div>
                    </div>
                </MDBCol>
            </MDBRow>
        </div>
    )
});

const MapDispatchToProps = dispatch => ({
    getCurrentCategories: getCurrentCategories(dispatch),
    getCurrentProductItem: getCurrentProductItem(dispatch),
    addGalleryImages: addGalleryImages(dispatch),
    removeGalleryImage: removeGalleryImage(dispatch),
    updateProduct: updateProduct(dispatch),
    loadPage: flag => dispatch(loadPage(flag))
})

export default connect(null, MapDispatchToProps)(ProductEditPage);