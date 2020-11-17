import React, {useState, useEffect, Fragment} from 'react';
import './row-item.style.scss';
import FormCheckbox from '../../../form-checkbox/form-checkbox.component';
import FormSelect from '../../../form-select/form-select.component';
import { MDBRow, MDBCol, MDBIcon } from 'mdbreact';
import { useAlert } from 'react-alert';
import { connect } from 'react-redux';
import { updateCategory, getCurrentCategories } from '../../../../redux/category/category.action';
import { loadPage } from '../../../../redux/user/user.action';

const CategoryTableRow = ({id, name, prodType, addToDelList, removeFromDelList, isAllChecked, updateCategory, getCurrentCategories, loadPage}) => {

    const alert = useAlert();

    const [isChecked, setIsChecked] = useState(false);
    const [isEditClicked, setIsEditClicked] = useState(false);
    const [editValue, setEditValue] = useState(name);
    const [isEmptyName, setIsEmptyName] = useState(false);

    // for select box of prod types
    const selectOptions = ["Both", "Physical", "Webinar"];
    const [optionShow, setOptionShow] = useState(false);
    const [placeholder, setPlaceholder] = useState(prodType);

    useEffect(() => {
        setIsChecked(isAllChecked);
    }, [isAllChecked]);

    useEffect(() => {
        if (isChecked)
            addToDelList(id);
        else
            removeFromDelList(id);
    }, [isChecked]);

    const updateFunction = async () => {
        setIsEmptyName(false);
        if((editValue === '') || (editValue.trim() === "")){
            setIsEmptyName(true);
            alert.error("Empty category name");
            return;
        }

        loadPage(true);
        const result = await updateCategory(id,editValue, placeholder);
        if (result) {            
            await getCurrentCategories();
            alert.success("Edit successfully");
        }            
        else
            alert.error("Existing name");
        loadPage(false);
        setIsEditClicked(false);
    }
    
    return (
        <MDBRow className="table-row">
            <MDBCol size="2" sm="2" md="1">
                <FormCheckbox Notif={ isChecked } handleChange = { 
                    () => setIsChecked(!isChecked) 
                } />
            </MDBCol>
            <MDBCol size="4" sm="4" md="6">
                {
                    isEditClicked ? <input className={`${isEmptyName ? 'empty' : ''} edit`} value={editValue} onChange={(e)=>setEditValue(e.target.value)} autoFocus={isEmptyName} />
                    :
                    <span>{name}</span>
                }
            </MDBCol>
            <MDBCol size="3" sm="3" md="3" className="text-center">
                {
                    isEditClicked ? <FormSelect options={selectOptions} showSelectBox={()=>setOptionShow(!optionShow)} selectOption={(event)=>{
                        setOptionShow(false);
                        setPlaceholder(event.target.id);
                    }} optionShow={optionShow} placeholder={placeholder}/>
                    :
                    <span>{prodType}</span>
                }
            </MDBCol>
            <MDBCol size="3" sm="3" md="2" className="text-center">
                {
                    isEditClicked ? <Fragment>
                        <MDBIcon far className="editIcon" icon="check-circle" onClick={()=>updateFunction()}/>
                        <MDBIcon far className="editIcon" icon="times-circle" onClick={()=>setIsEditClicked(false)}/>
                    </Fragment>
                    :
                    <i class="fas fa-pencil-alt" onClick={()=> { 
                        setIsEditClicked(true);
                        setEditValue(name);
                        setPlaceholder(prodType);
                    }}></i>
                }               
            </MDBCol>
        </MDBRow>
    )
}

const MapDispatchToProps = dispatch => ({
    updateCategory: updateCategory(dispatch),
    getCurrentCategories: getCurrentCategories(dispatch),
    loadPage: flag => dispatch(loadPage(flag))
})

export default connect(null, MapDispatchToProps)(CategoryTableRow);