import React, {useState, useEffect, Fragment} from 'react';
import { MDBRow, MDBCol, MDBIcon } from 'mdbreact';
import { Storage } from 'aws-amplify';
import { updateProduct, getProductItems } from '../../../redux/webinar-queue-list/webinar-queue-list.action';
import { loadPage } from '../../../redux/user/user.action';
import { connect } from 'react-redux';
import { useAlert } from 'react-alert';
import FormButton from '../../form-button/form-button.component';
import './webinar-queue-row.style.scss';

const WebinarQueueListeRow = ({ item, updateProduct, getProductItems, loadPage, ...otherprops }) => {

    const alert = useAlert();

    const [isRemoveDialog, setIsRemoveDialog] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    useEffect(() => {
        async function load() {
            item.main_image && setImageUrl(await Storage.get("thumbnail-"+item.main_image.image_url))
        }
        load();        
    }, [item.main_image]);

    // for remove status
    const [removeStatus, setRemoveStatus] = useState("now");

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
                alert.success("Success");
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

    const addToQueueFunc = async () => {
        const obj = {
            product_type: "webinar",
            product_id : item.id,
            publish_method: "queued"           
        }
        loadPage(true);
        const result = await updateProduct(obj);
        if (result === "success") {
            alert.success("Added to queue successfully");
            await getProductItems(
                otherprops.filterStr,   
                otherprops.type,
                otherprops.pageLimit, 
                otherprops.offset
                );
        }
        else
            alert.error("Adding failed");
        loadPage(false);

    }

    return (
        <Fragment>
        {
            isRemoveDialog ?
            <div className="removeDialogWrapper">
                <div className="removeDialog">
                    <MDBIcon className="float-right text-white closeIcon" icon="times" onClick={()=>setIsRemoveDialog(false)}/>
                    <br/>
                    <h2 className="text-white text-center font-weight-bold mb-4">Remove from Queue</h2>
                    <MDBRow center className="mb-4">
                        <MDBCol size="5">
                            <FormButton greyCol={removeStatus !== "now" && true} onClickFunc={()=>setRemoveStatus("now")}>ACTIVE NOW</FormButton>
                        </MDBCol>
                        <MDBCol size="5">
                            <FormButton greyCol={removeStatus !== "later" && true} onClickFunc={()=>setRemoveStatus("later")}>SCHEDULE LATER</FormButton>
                        </MDBCol>
                    </MDBRow>

                    {
                        removeStatus === "later" && <MDBRow center>
                            <MDBCol size="10">
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
            </div>
            :
            item.publish_method === "queued" ?
            <MDBRow className="table-row">
                <MDBCol size="1">
                    {
                        imageUrl ? <img src={imageUrl} alt={item.name}/>
                        :
                        <div className="non-img">
                            <MDBIcon far icon="file-image" />
                        </div>
                    }
                </MDBCol>
                <MDBCol size="2" className="text-center">
                    {item.name && item.name.length > 20 ? item.name.slice(0,20) + "..." : item.name}
                </MDBCol>
                <MDBCol size="3" className="text-center">
                    {item.shortDescription && item.shortDescription.length > 30 ? item.shortDescription.slice(0,30) + "..." : item.shortDescription}
                </MDBCol>
                <MDBCol size="2" className="text-center">
                    {item.price_per_seats && item.price_per_seats}
                </MDBCol>
                <MDBCol size="2" className="text-center">
                    {item.seats && item.seats}
                </MDBCol>
                <MDBCol size="2" className="text-center">
                    <button onClick ={()=>setIsRemoveDialog(true)}>Remove</button>
                </MDBCol>
            </MDBRow>
            :
            <MDBRow className="table-row">
                <MDBCol size="1">
                    {
                        imageUrl ? <img src={imageUrl} alt={item.name}/>
                        :
                        <div className="non-img">
                            <MDBIcon far icon="file-image" />
                        </div>
                    }
                </MDBCol>
                <MDBCol size="2" className="text-center">
                    {item.name && item.name.length > 20 ? item.name.slice(0,20) + "..." : item.name}
                </MDBCol>
                <MDBCol size="2" className="text-center">
                    {item.shortDescription && item.shortDescription.length > 30 ? item.shortDescription.slice(0,30) + "..." : item.shortDescription}
                </MDBCol>
                <MDBCol size="2" className="text-center">
                    {item.price_per_seats && item.price_per_seats}
                </MDBCol>
                <MDBCol size="2" className="text-center">
                    {item.price_per_seats && item.price_per_seats}
                </MDBCol>
                <MDBCol size="1" className="text-center">
                    {item.price_per_seats && item.price_per_seats}
                </MDBCol>
                <MDBCol size="1" className="text-center">
                    {item.seats && item.seats}
                </MDBCol>
                <MDBCol size="1" className="text-center">
                    <button onClick={()=>addToQueueFunc()}>Add</button>
                </MDBCol>
            </MDBRow>
        }
        </Fragment>        
    )
}

const MapDispatchToProps = dispatch => ({
    updateProduct: updateProduct(dispatch),
    getProductItems: getProductItems(dispatch),
    loadPage: flag => dispatch(loadPage(flag))
})

export default connect(null, MapDispatchToProps)(WebinarQueueListeRow);