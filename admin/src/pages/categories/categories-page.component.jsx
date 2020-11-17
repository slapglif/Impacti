import React, { useState, useEffect, Fragment } from 'react';
import './categories-page.style.scss';
import FormButton from '../../components/form-button/form-button.component';
import FormCheckbox from '../../components/form-checkbox/form-checkbox.component';
import { MDBRow, MDBCol } from 'mdbreact';
import CategoryTableRow from '../../components/table/category-table/row-item/row-item.component';
import FormInput from '../../components/form-input/form-input.component';
import FormSelect from '../../components/form-select/form-select.component';
import { connect } from 'react-redux';
import { getCurrentCategories, addCategory, deleteCategory } from '../../redux/category/category.action';
import { loadPage } from '../../redux/user/user.action';
import { useAlert } from 'react-alert';

const CategoriesPage = ({currentCategories, getCurrentCategories, addCategory, deleteCategory, loadPage}) => {

    const alert = useAlert();

    const [isAllChecked, setIsAllChecked] = useState(false);
    const [isAddNewClicked, setIsAddNewClicked] = useState(false);
    const [newName, setNewName] = useState('');
    const [isLoadingBtn, setIsLoadingBtn] = useState(false);
    const [isEmptyName, setIsEmptyName] = useState(false);
    const [deleteList, setDeleteList] = useState([]);

    // for select box of prod types
    const selectOptions = ["Both", "Physical", "Webinar"];
    const [optionShow, setOptionShow] = useState(false);
    const [placeholder, setPlaceholder] = useState("Both");

    useEffect(() => {
        async function loadCateogries () {
            loadPage(true);
            await getCurrentCategories();
            loadPage(false);    
        }
        loadCateogries();
    }, []);

    const addFunction = async () => {
        if (isLoadingBtn)
            return
            
        setIsEmptyName(false);
        if((newName === '') || (newName.trim() === "")){
            setIsEmptyName(true);
            alert.error("Empty category name");
            return;
        }
        setIsLoadingBtn(true);
        const result = await addCategory(newName, placeholder);
        if (result){            
            await getCurrentCategories();
            alert.success("Add new category successfully");
        }            
        else
            alert.error("Existing category name");
        setIsLoadingBtn(false);
        setNewName('');
        setIsAddNewClicked(false);
    }

    const deletCategoriesFunc = async () => {
        if (deleteList.length !== 0) {
            loadPage(true);
            const result = await deleteCategory(deleteList);
            if (result === "success") {                
                await getCurrentCategories();
                alert.success("Delete successfully");
            }
            else
                alert.error("Deleting failed");
            loadPage(false);
        }
    }

    const addToDelList = (id) => {
        let delList = deleteList;
        delList.push(id);
        setDeleteList([...delList]);
    }

    const removeFromDelList = (id) => {
        let delList = deleteList;
        let index = delList.indexOf(id);
        if (index > -1){
            delList.splice(index,1);
            setDeleteList([...delList]);
        }
    }

    return (
        <div className="categories-page">
            {
                isAddNewClicked ? <div className="add-new">
                    <h2 className="text-white text-center font-weight-bold mb-4">Add New Category</h2>
                    <div className="add-section">
                        <FormInput type="text" label = 'Category Name' value = {newName} handleChange = {(event) => setNewName(event.target.value)} changeEmail={isEmptyName} required/>
                        <FormSelect options={selectOptions} label="Product type" showSelectBox={()=>setOptionShow(!optionShow)} selectOption={(event)=>{
                            setOptionShow(false);
                            setPlaceholder(event.target.id);
                        }} optionShow={optionShow} placeholder={placeholder}/>
                        <FormButton onClickFunc={ () => addFunction() } isLoading = {isLoadingBtn}>SAVE NOW</FormButton>
                    </div>
                </div>
                :
                <Fragment>
                    <div className="title">
                        <h2 className="text-white font-weight-bold">Categories</h2>
                        <FormButton onClickFunc={ () => setIsAddNewClicked(true)}>ADD NEW</FormButton>
                    </div>
                    <div className="mt-3 section">
                        <p>Action: <i class="fas fa-trash-alt" onClick={()=>deletCategoriesFunc()}></i></p>
                        <MDBRow className="table-header">
                            <MDBCol size="2" sm="2" md="1">
                                <FormCheckbox Notif={isAllChecked} handleChange = { () => setIsAllChecked(!isAllChecked) } />
                            </MDBCol>
                            <MDBCol size="4" sm="4" md="6" className="text-white">
                                Category Name
                            </MDBCol>
                            <MDBCol size="3" sm="3" md="3" className="text-white text-center">
                                Product Type
                            </MDBCol>
                            <MDBCol size="3" sm="3" md="2" className="text-white text-center">
                                Action
                            </MDBCol>
                        </MDBRow>
                        {
                            currentCategories && currentCategories.map( category => <CategoryTableRow
                                key={category.id}
                                id = {category.id}
                                name={category.category_name} 
                                prodType={category.product_type}
                                addToDelList = {(id)=>addToDelList(id)}
                                removeFromDelList = {(id)=>removeFromDelList(id)}
                                isAllChecked = {isAllChecked}/>  )
                        }
                    </div>
                </Fragment>
            }            
        </div>
    )
}

const MapStateToProps = ({category: {currentCategories}}) => ({
    currentCategories
});

const MapDispatchToProps = dispatch => ({
    getCurrentCategories: getCurrentCategories(dispatch),
    addCategory: addCategory(dispatch),
    deleteCategory: deleteCategory(dispatch),
    loadPage: flag => dispatch(loadPage(flag))
})

export default connect(MapStateToProps, MapDispatchToProps)(CategoriesPage);