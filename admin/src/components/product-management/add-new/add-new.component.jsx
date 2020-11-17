import React, {useState, useEffect} from 'react';
import './add-new.style.scss';
import { MDBRow, MDBCol, MDBIcon } from 'mdbreact';
import { connect } from 'react-redux';
import { getCurrentCategories } from '../../../redux/category/category.action';
import AddNewProductTypeButton from './add-type-button/add-type-btn.component';
import FormInput from '../../form-input/form-input.component';
import FormSelect from '../../form-select/form-select.component';
import { useDropzone } from 'react-dropzone';
import FormButton from '../../form-button/form-button.component';
import { useAlert } from 'react-alert';
import { Storage } from 'aws-amplify';
import { setAddNewClicked, addNewWebinar } from '../../../redux/product-list/product-list.action';
import { loadPage } from '../../../redux/user/user.action';
import { useRef } from 'react';

const thumbsContainer = {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  };
  
  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  };
  
  const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
  };

const AddNewProductForm = ({
    getCurrentCategories,
    setAddNewClicked,
    addNewWebinar,
    loadPage
    }) => {
    
    const alert = useAlert();

    // for add new clicked
    
    const [isWebinarTypeBtn, setIsWebinarTypeBtn] = useState(true);
    const [newWebinarInfo, setNewWebinarInfo] = useState({
        name: '',
        seatNumber: '',
        seatPrice: '',
        boughtPrice: '',
        description: '',
        scheduleTime: ''
    });

    const [invalidInput, setInvalidInput] = useState({
        name: false,
        seatNumber: false,
        seatPrice: false,
        boughtPrice: false,
        description: false,
        category: false
    });

    const numberFormat = (e, kind) => {        
        const re = /^[0-9\b]+$/;
        // if value is not blank, then test the regex

        if (e.target.value === '' || re.test(e.target.value)) {
            switch (kind) {
                case "seatNumber":
                    setNewWebinarInfo({ ...newWebinarInfo, seatNumber: e.target.value});
                    break;
                case "seatPrice":
                    setNewWebinarInfo({ ...newWebinarInfo, seatPrice: e.target.value});
                    break;
                case "boughtPrice":
                    setNewWebinarInfo({ ...newWebinarInfo, boughtPrice: e.target.value});
                    break;
            
                default:
                    break;
            }            
        }
    }

    // for select box of category
    const categoryList = useRef(null);
    const [categorySelect, setCategorySelect] = useState([]);
    const [categorySelectShow, setCategorySelectShow] = useState(false);
    const [currentCategorySelect, setCurrentCategorySelect] = useState("");

    useEffect(() => {
        async function loadCategories() {
            const categories = await getCurrentCategories(true);
            categoryList.current = categories;
     
            if (categories) {
                const webinarCategories = [];
                categories.map(category=>{
                    if ((category.product_type === "Webinar") || (category.product_type === "Both"))
                    webinarCategories.push(category.category_name);
                })
                setCategorySelect([...webinarCategories]);
            }   
        }
        loadCategories();
    }, []);

    // for image pick with drag and drop file

    const [files, setFiles] = useState([]);
    const [activeImage, setActiveImage] = useState(null);

    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            setFiles((acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }))).slice(0,10));
            if ((acceptedFiles.length) < 11)
                setActiveImage(Object.assign(acceptedFiles[0], {
                    preview: URL.createObjectURL(acceptedFiles[0])
                }))
        }
    });
    
    const thumbs = files.map(file => (
        <div className="thumbImg" key={file.name} onClick={()=> {
                console.log(activeImage);
                console.log(file);
                setActiveImage(file);
                }
            }>
            <div style={thumbInner} >
                <img
                src={file.preview}
                style={img}
                />
            </div>
            <MDBIcon className="checkIcon" far icon="check-circle" />
        </div>
    ));

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    // for list status
    const [listStatus, setListStatus] = useState("later");

    const imagesUpload = async (files) => {
        const imagesList = [];
        files.splice(files.indexOf(activeImage),1);
        for(let i=0; i < files.length; i++) { 
            const stored = await Storage.put("products-"+Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)+"-"+files[i].name, files[i], {
                contentType: files[i].type,
                cacheControl: 'max-age=31536000'
            });
    
            imagesList.push(stored.key);            
        }
        return imagesList;        
    }

    const activeImageUpload = async file => {
        const stored = await Storage.put("products-"+Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)+"-"+file.name, file, {
            contentType: file.type,
            cacheControl: 'max-age=31536000'
        });
        return stored.key;
    }

    const getCurrentCategoryId = () => {       
        const result = categoryList.current.filter(category => category.category_name === currentCategorySelect);
        return result[0].id;
    }

    const addProductFunction = async (method) => {

        const mainImage = await activeImageUpload(activeImage);
        const imageLists = await imagesUpload(files);
        imageLists.push(mainImage);

        const categoryID = getCurrentCategoryId();

        let obj = {};

        if (isWebinarTypeBtn) {
            obj = {
                name: newWebinarInfo.name,
                price_per_seats: newWebinarInfo.seatPrice,
                publish_method: method === "now" ? "instant" : method === "queue" ? "queued" : "scheduled",
                mainImage: mainImage,
                imageLists: imageLists,
                seats: newWebinarInfo.seatNumber,
                shortDescription: newWebinarInfo.description,
                category_id: categoryID,
                webinar_type: "webinar",
                bought_for: newWebinarInfo.boughtPrice
            }

            if ( method === "later" ) {
                const date = new Date(currentDate.year, currentDate.month-1, currentDate.day, currentDate.hour, currentDate.minute);
                obj.scheduled_time = date.toISOString();
            }
            const result = await addNewWebinar("webinar",obj);
            if (result === "success")
                alert.success("Added successfully");
            
        }
        else {
            obj = {
                productName: newWebinarInfo.name,
                pricePerItem: newWebinarInfo.seatPrice,
                publish_method: method === "now" ? "instant" : "scheduled",
                mainImage: mainImage,
                imageLists: imageLists,
                amount: newWebinarInfo.seatNumber,
                shortDescription: newWebinarInfo.description,
                category_id: categoryID,
                bought_for: newWebinarInfo.boughtPrice
            }

            if ( method === "later" ) {
                const date = new Date(currentDate.year, currentDate.month-1, currentDate.day, currentDate.hour, currentDate.minute);
                obj.scheduled_time = date.toISOString();
            }

            const result = await addNewWebinar("physical",obj);
            if (result === "success")
                alert.success("Added successfully");
        }
        
    }

    const goToListFunc = async listType => {

        setListStatus(listType);

        if ( currentCategorySelect === "") {
            setInvalidInput({
                name: false,
                category: true,
                seatNumber: false,
                seatPrice: false,
                boughtPrice: false,
                description: false
            });
            return;
        }
        if (newWebinarInfo.name.trim() === "" ) {
            setInvalidInput({
                name: true,
                category: false,
                seatNumber: false,
                seatPrice: false,
                boughtPrice: false,
                description: false
            });
            return;
        }
        if (newWebinarInfo.seatNumber.trim() === "" ) {
            setInvalidInput({
                name: false,
                category: false,
                seatNumber: true,
                seatPrice: false,
                boughtPrice: false,
                description: false
            });
            return;
        }
        if (newWebinarInfo.seatPrice.trim() === "" ) {
            setInvalidInput({
                name: false,
                category: false,
                seatNumber: false,
                seatPrice: true,
                boughtPrice: false,
                description: false
            });
            return;
        }
        if (newWebinarInfo.boughtPrice.trim() === "" ) {
            setInvalidInput({
                name: false,
                category: false,
                seatNumber: false,
                seatPrice: false,
                boughtPrice: true,
                description: false
            });
            return;
        }
        if (newWebinarInfo.description.trim() === "" ) {
            setInvalidInput({
                name: false,
                category: false,
                seatNumber: false,
                seatPrice: false,
                boughtPrice: false,
                description: true
            });
            return;
        }

        if (files.length < 1) {
            alert.error("Please select the product photos");
            return;
        }

        loadPage(true);
        await addProductFunction(listType);
        loadPage(false);
        setAddNewClicked(false);
        
    }

    // for custom date picker
    const today = new Date();
    Date.shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    Date.shortWeeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const [currentDate, setCurrentDate] = useState({
        year: today.getFullYear(),
        month: today.getMonth()+1,
        shortWeek: Date.shortWeeks[today.getDay()-1],
        day: today.getDate(),
        hour: today.getHours(),
        minute: today.getMinutes()
    });

    const plusDateFunc = (type) => {
        switch (type) {
            case "day":
                if (currentDate.day === 31)
                    setCurrentDate({...currentDate, day: 1});
                else
                    setCurrentDate({...currentDate, day: currentDate.day+1});
                break;

            case "month":
                if (currentDate.month === 12)
                    setCurrentDate({...currentDate, month: 1});
                else
                    setCurrentDate({...currentDate, month: currentDate.month+1});
                break;

            case "year":
                setCurrentDate({...currentDate, year: currentDate.year+1});
                break;

            case "hour":
                if (currentDate.hour === 23)
                    setCurrentDate({...currentDate, hour: 0});
                else
                    setCurrentDate({...currentDate, hour: currentDate.hour+1});
                break;

            case "minute":
                if (currentDate.minute === 59)
                    setCurrentDate({...currentDate, minute: 0});
                else
                    setCurrentDate({...currentDate, minute: currentDate.minute+1});
                break;

            default:
                break;
        }
    }

    const minusDateFunc = (type) => {
        switch (type) {
            case "day":              
                if (currentDate.day === 1)
                    setCurrentDate({...currentDate, day: 31});
                else
                    setCurrentDate({...currentDate, day: currentDate.day-1});
                break;

            case "month":
                if (currentDate.month === 1)
                    setCurrentDate({...currentDate, month: 12});
                else
                    setCurrentDate({...currentDate, month: currentDate.month-1});
                break;
            
            case "year":
                if (currentDate.year === today.getFullYear())
                    return;
                else
                    setCurrentDate({...currentDate, year: currentDate.year-1});
                break;

            case "hour":
                if (currentDate.hour === 0)
                    setCurrentDate({...currentDate, hour: 23});
                else
                    setCurrentDate({...currentDate, hour: currentDate.hour-1});
                break;

            case "minute":
                if (currentDate.minute === 0)
                    setCurrentDate({...currentDate, minute: 59});
                else
                    setCurrentDate({...currentDate, minute: currentDate.minute-1});
                break;

            default:
                break;
        }
    }

    const saveBtnClicked = () => {
         
        const today = new Date();
        const laterDate = new Date();
        laterDate.setFullYear(currentDate.year);
        laterDate.setMonth(currentDate.month-1);
        laterDate.setDate(currentDate.day);
        laterDate.setHours(currentDate.hour);
        laterDate.setMinutes(currentDate.minute);
        
        if (laterDate.getTime() < today.getTime()) {           
            alert.error("You selected past date");
            return;
        }
        else{
            if ( currentDate.day > new Date(currentDate.year, currentDate.month, 0).getDate()) {
                alert.error("Invalid date");
                return;
            }
            else {            
                goToListFunc("later");
            }                    
        }        
    }

    const clearBtnClicked = () => {
        setCurrentDate({
            year: today.getFullYear(),
            month: today.getMonth()+1,
            shortWeek: Date.shortWeeks[today.getDay()-1],
            day: today.getDate(),
            hour: today.getHours(),
            minute: today.getMinutes()
        })
    }

    
    return (
        <div className="addNewProduct">
            <h3 className="text-center text-white font-weight-bold mb-4">Add New Product</h3>
            <MDBRow center className="mb-4">
                <MDBCol size="12" sm="12" md="6" lg="5">
                    <AddNewProductTypeButton prodType="webinar" active={isWebinarTypeBtn} onClickFunc={()=>{
                        setIsWebinarTypeBtn(true);
                    }}/>  
                </MDBCol>
                <MDBCol size="12" sm="12" md="6" lg="5">
                    <AddNewProductTypeButton prodType="product" active={!isWebinarTypeBtn} onClickFunc={()=>{
                        setIsWebinarTypeBtn(false);
                    }}/>  
                </MDBCol>
            </MDBRow>
            <MDBRow>
                <MDBCol className="formCol" size="12" sm="12" md="6" lg="6">
                    <FormInput changeEmail = {invalidInput.name} type="text" change label = {`${isWebinarTypeBtn ?'Webinar Name*':'Product Name*'}`} value = {newWebinarInfo.name} handleChange = {(event) => setNewWebinarInfo({...newWebinarInfo, name: event.target.value})} required/>
                </MDBCol>
                <MDBCol className="formCol" size="12" sm="12" md="6" lg="6">
                    <FormSelect isInvalid={invalidInput.category} options={categorySelect} label="Category*" showSelectBox={()=>setCategorySelectShow(!categorySelectShow)} 
                        selectOption = {(event)=>{
                            setCategorySelectShow(false);
                            setCurrentCategorySelect(event.target.id);
                        }} optionShow={categorySelectShow} placeholder={currentCategorySelect}/>
                </MDBCol>
            </MDBRow>
            <MDBRow>
                <MDBCol className="formCol" size="12" sm="12" md="4" lg="4">
                    <FormInput changeEmail={invalidInput.seatNumber} type="text" label = {`${isWebinarTypeBtn ?'Number of Seats*':'Inventory*'}`} value = {newWebinarInfo.seatNumber} handleChange = {(event) => numberFormat(event, "seatNumber")} required/>
                </MDBCol>
                <MDBCol className="formCol" size="12" sm="12" md="4" lg="4">
                    <FormInput changeEmail={invalidInput.seatPrice} type="text" label = {`${isWebinarTypeBtn ?'Price per Seat*':'Price per Unit*'}`} value = {newWebinarInfo.seatPrice} handleChange = {(event) => numberFormat(event, "seatPrice")} required/>
                </MDBCol>
                <MDBCol className="formCol" size="12" sm="12" md="4" lg="4">
                    <FormInput changeEmail={invalidInput.boughtPrice} type="text" label = 'Bought for*' value = {newWebinarInfo.boughtPrice} handleChange = {(event) => numberFormat(event, "boughtPrice")} required/>
                </MDBCol>
            </MDBRow>
            <MDBRow>
                <MDBCol className="formCol">
                    <textarea rows="5" className={`${invalidInput.description&&'invalid'}`} value={newWebinarInfo.description} onChange={(event)=>setNewWebinarInfo({...newWebinarInfo, description: event.target.value})} placeholder="Description"></textarea>
                </MDBCol>
            </MDBRow>
            
            <div {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()}/>
                <div className="dragBorder">
                    <div className="dragWrapper text-center">
                        <p>DROP PRODUCT PICUTRE HERE </p>
                        <p>OR <span className="text-white">CHOOSE PICTURE</span></p>
                    </div>
                    {
                        activeImage && <div className="activeImg">
                                <img
                                    src={activeImage.preview}                                    
                                />
                                <label>Active</label>
                            </div>
                    }
                </div>
            </div>
            <aside style={thumbsContainer}>
                {thumbs}
            </aside>

            <MDBRow center>
                <MDBCol size="10" sm="5" md="5" lg="3">
                    <FormButton greyCol={listStatus !== "now" && true} onClickFunc={()=>goToListFunc("now")}>LIST NOW</FormButton>
                </MDBCol>
                <MDBCol size="10" sm="5" md="5" lg="3">
                    <FormButton greyCol={listStatus !== "later" && true} onClickFunc={()=>setListStatus("later")}>LIST LATER</FormButton>
                </MDBCol>
                {
                    isWebinarTypeBtn && <MDBCol size="10" sm="5" md="5" lg="3">
                        <FormButton greyCol={listStatus !== "queue" && true} onClickFunc={()=>goToListFunc("queue")}>ADD TO QUEUE</FormButton>
                    </MDBCol>
                }
            </MDBRow>
            {
                listStatus === "later" && <MDBRow center>
                    <MDBCol size="12" sm="12" md="10" lg="8">
                        <div className="custom-datepicker mt-3">
                            <div className="datepicker-header">
                                <label className="text-white">{`${currentDate.day<10?"0":""}${currentDate.day}`}-{`${currentDate.month<10?"0":""}${currentDate.month}`}-{currentDate.year}</label>
                                <label className="text-white">{`${currentDate.hour<10?"0":""}${currentDate.hour}`}:{`${currentDate.minute<10?"0":""}${currentDate.minute}`}</label>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-white mb-1">State Date &amp; Time</p>
                                <p>{currentDate.shortWeek}, {Date.shortMonths[currentDate.month-1]} {`${currentDate.day<10?"0":""}${currentDate.day}`}, {currentDate.year} <span>{`${currentDate.hour<10?"0":""}${currentDate.hour}`}:{`${currentDate.minute<10?"0":""}${currentDate.minute}`}</span></p>
                            </div>
                            <div className="date-select mt-4 mb-4">
                                <div className="text-center">
                                    <p className="pointer" onClick={()=>plusDateFunc("day")}>+</p>
                                    <p>{`${currentDate.day<10?"0":""}${currentDate.day}`}</p>
                                    <p className="pointer" onClick={()=>minusDateFunc("day")}>-</p>                    
                                </div>
                                <div className="text-center">
                                    <p className="pointer" onClick={()=>plusDateFunc("month")}>+</p>
                                    <p>{Date.shortMonths[currentDate.month-1]}</p>
                                    <p className="pointer" onClick={()=>minusDateFunc("month")}>-</p>                    
                                </div>
                                <div className="text-center">
                                    <p className="pointer" onClick={()=>plusDateFunc("year")}>+</p>
                                    <p>{currentDate.year}</p>
                                    <p className="pointer" onClick={()=>minusDateFunc("year")}>-</p>                    
                                </div>
                                <div className="text-center">
                                    <p className="pointer" onClick={()=>plusDateFunc("hour")}>+</p>
                                    <p>{`${currentDate.hour<10?"0":""}${currentDate.hour}`}</p>
                                    <p className="pointer" onClick={()=>minusDateFunc("hour")}>-</p>                    
                                </div>
                                <div className="text-center">
                                    <p className="pointer" onClick={()=>plusDateFunc("minute")}>+</p>
                                    <p>{`${currentDate.minute<10?"0":""}${currentDate.minute}`}</p>
                                    <p className="pointer" onClick={()=>minusDateFunc("minute")}>-</p>                    
                                </div>
                            </div>
                            <MDBRow center>
                                <MDBCol size="5">
                                    <FormButton onClickFunc={()=>saveBtnClicked()}>SAVE</FormButton>
                                </MDBCol>
                                <MDBCol size="5">
                                    <FormButton onClickFunc={()=>clearBtnClicked()}>CLEAR</FormButton>
                                </MDBCol>
                            </MDBRow>            
                        </div>
                    </MDBCol>
                </MDBRow>
            }       
        </div>
    )
}

const MapDispatchToProps = dispatch => ({
    getCurrentCategories: getCurrentCategories(dispatch),
    addNewWebinar: addNewWebinar(dispatch),
    setAddNewClicked: flag => dispatch(setAddNewClicked(flag)),
    loadPage: flag => dispatch(loadPage(flag))
})

export default connect(null, MapDispatchToProps)(AddNewProductForm);