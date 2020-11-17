import React, {useState, useEffect, Fragment} from 'react';
import './product-list-row.style.scss';
import FormCheckbox from '../../form-checkbox/form-checkbox.component';
import { MDBRow, MDBCol, MDBIcon } from 'mdbreact';
import DatePicker from "react-datepicker"; 
import { useHistory } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { connect } from 'react-redux';
import { loadPage } from '../../../redux/user/user.action';
import { updateProduct, getProductItems } from '../../../redux/product-list/product-list.action';
import { useAlert } from 'react-alert';
import { Storage } from 'aws-amplify';


const ProductListeRow = ({ addToDelList, removeFromDelList, isAllChecked, loadPage, updateProduct, getProductItems, ...otherProperties}) => {
    
    const alert = useAlert();
    const historyUrl = useHistory();
    // const [isChecked, setIsChecked] = useState(false);
    const [startDate, setStartDate] = useState( otherProperties.date? new Date(otherProperties.date.toString()): new Date());

    const datePickerLink = React.createRef();

    // useEffect(() => {
    //     setIsChecked(isAllChecked);
    // }, [isAllChecked]);

    // useEffect(() => {
    //     if (isChecked)
    //         addToDelList(otherProperties.id);
    //     else
    //         removeFromDelList(otherProperties.id);
    // }, [isChecked]);
    const [imageUrl, setImageUrl] = useState(null);
    useEffect(() => {
        async function load() {
            otherProperties.img && setImageUrl(await Storage.get("thumbnail-"+otherProperties.img.image_url))
        }
        load();        
    }, [otherProperties.img]);

    const activeProductFunc = async () => {
        loadPage(true);
        if (otherProperties.status === "active") {
            const obj = {
                product_id: otherProperties.id,
                product_type: otherProperties.prodType.toLowerCase(),
                product_status: "inactive"
            }
            const result = await updateProduct(obj);
            if (result === "success"){
                alert.success("Updated successfully");
                await getProductItems("", "inactive", "both", 10, 0);
            }
               
            else
                alert.error("Updating failed");
        }
        else {
            const obj = {
                product_id: otherProperties.id,
                product_type: otherProperties.prodType.toLowerCase(),
                product_status: "active",
                publish_method: "instant"
            }
            const result = await updateProduct(obj);
            if (result === "success") {
                alert.success("Updated successfully");
                await getProductItems(
                    "", 
                    otherProperties.statusFilter.toLowerCase(), 
                    otherProperties.typeFilter === "All" ? "both" : otherProperties.typeFilter.toLowerCase(), 
                    10, 
                    0);
            }               
            else
                alert.error("Updating failed");
        }
        loadPage(false);
    }

    const updateSchedulTime = async () => {
        loadPage(true);
        const obj = {
            product_id: otherProperties.id,
            product_type: otherProperties.prodType.toLowerCase(),
            scheduled_time: startDate.toISOString()
        }
        const result = await updateProduct(obj);
        if (result === "success") {
            alert.success("Updated successfully");
            await getProductItems(
                "", 
                otherProperties.statusFilter.toLowerCase(), 
                otherProperties.typeFilter === "All" ? "both" : otherProperties.typeFilter.toLowerCase(), 
                10, 
                0);
        }               
        else
            alert.error("Updating failed");
        
        loadPage(false);
    }

    return (
        <MDBRow className="table-row">
            {/* <MDBCol size="1">
                <FormCheckbox Notif={isChecked} handleChange = { () => setIsChecked(!isChecked) } />
            </MDBCol> */}
            <MDBCol size="1" className="text-center thumb">
                {
                    imageUrl ? <img src={imageUrl} alt={otherProperties.name}/>
                    :
                    <div className="non-img">
                        <MDBIcon far icon="file-image" />
                    </div>
                }
            </MDBCol>
            <MDBCol size="2" className="text-center">
                {otherProperties.name && otherProperties.name.length > 20 ? otherProperties.name.slice(0,20) + "..." : otherProperties.name}
            </MDBCol>
            <MDBCol size="2" className="text-center">
                {otherProperties.description && otherProperties.description.length > 30 ? otherProperties.description.slice(0,30) + "..." : otherProperties.description}
            </MDBCol>
            <MDBCol size="1" className="text-center">
                {otherProperties.prodType && otherProperties.prodType}
            </MDBCol>
            <MDBCol size="1" className="text-center">
                {otherProperties.price && otherProperties.price}
            </MDBCol>
            <MDBCol size="1" className="text-center">
                {otherProperties.amount && otherProperties.amount}
            </MDBCol>
            <MDBCol size="2" className="text-center dateWrapper">
                {
                    otherProperties.date ? 
                    <Fragment>
                        <DatePicker
                            ref={datePickerLink} 
                            minDate={new Date()} 
                            selected={startDate} 
                            onChange={date => setStartDate(date)}
                            onCalendarClose={updateSchedulTime}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={1}
                            timeCaption="time"
                            dateFormat="MM/dd/yyyy h:mm"
                        />
                        <MDBIcon icon="calendar-alt" className="calIcon" onClick={()=>datePickerLink.current.setOpen(true)}/>
                    </Fragment>
                    :
                    null 
                }           
                                              
            </MDBCol>
            <MDBCol size="1" className="text-center" onClick={()=>historyUrl.push('/product/product/edit', {prodType: otherProperties.prodType.toLowerCase(), id: otherProperties.id})}>
                <i class="fas fa-pencil-alt"></i>
            </MDBCol>
            <MDBCol size="1" className="text-center">
                <button className="activeBtn" onClick={()=>activeProductFunc()}>{`${otherProperties.status === "active" ? "Inactive" : "Active"}`}</button>
            </MDBCol>
        </MDBRow>
    )
}

const MapDispatchToProps = dispatch => ({
    loadPage: flag => dispatch(loadPage(flag)),
    updateProduct: updateProduct(dispatch),
    getProductItems: getProductItems(dispatch)
})

export default connect(null,MapDispatchToProps)(ProductListeRow);