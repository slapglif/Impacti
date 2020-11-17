import React, {Fragment} from 'react';
import './purchase_seats.style.scss';
import { connect } from 'react-redux';

import FormButton from '../../components/form-button/form-button.component';
import { useState, useEffect } from 'react';
import CheckOutForm from '../../components/payment-form/check-out-form/check-out-form.component';
import { getReservedStatus, 
        getPurchaseSeatsArray, 
        setSeatsReserved, 
        cancelReservation } from '../../redux/purchase-seats/purchase-seats.action';

// for waiting load
import { setLoadAlerts } from '../../redux/alerts/alerts.action';
import { withRouter } from 'react-router';
import { useAlert } from 'react-alert';

const PurchaseSeatsPage = withRouter(({
    match, 
    seatsArray, 
    getReservedStatus,
    getPurchaseSeatsArray,
    setSeatsReserved,
    cancelReservation,
    setLoadAlerts,
    currentFontColors
    }) => {

    const alert = useAlert();
    const webinarID = match.params.id;
    const userData = JSON.parse(localStorage.getItem("userData"));
  

    const [selectedIndex, setSelectedIndex] = useState([]);
    const [seatSelected, setSeatSelected] = useState(false);

    const [loadButton, setLoadButton] = useState(false);

    const [fontColors, setFontColors] = useState({header1: "white", header2: "white"});
    useEffect(() => {
        if (currentFontColors){
            const h1Color = JSON.parse(currentFontColors.header1_color);
            const h2Color = JSON.parse(currentFontColors.header2_color);

            setFontColors({
                header1: `rgba(${h1Color.r }, ${h1Color.g }, ${h1Color.b }, ${h1Color.a })`,
                header2: `rgba(${h2Color.r }, ${h2Color.g }, ${h2Color.b }, ${h2Color.a })`
            })
        }
    }, [currentFontColors]);
    
    useEffect(() => {
        async function load() {
            setLoadAlerts(true);
            const reservedSataus = await getReservedStatus(userData.id, webinarID);
            if (reservedSataus.is_reserved){
                
                setSeatSelected(true);
                setLoadAlerts(false);
                
                //calculate waiting time from difference between reserved time and current time
                const waitingTime = (new Date(new Date(reservedSataus.reserved_date).toString()).getTime() - new Date().getTime()) + 303000;    // + 5 min 2 sec
            
                setTimeout(async () => {
                    alert.error("Your reserved seats are expired.");
            
                    await cancelReservation(userData.id, webinarID);                                  
                    setSeatSelected(false);
                    await getPurchaseSeatsArray(webinarID);                  
                    
                }, waitingTime)

            }                
            else{
                await getPurchaseSeatsArray(webinarID);
                setLoadAlerts(false);
            }
        }
        if (userData)
            load();
    }, [seatSelected]);

    const manageSelectedIndex = (i) => {
        
        if (selectedIndex.includes(i)) {
            let array = selectedIndex; // make a separate copy of the array
            const index = array.indexOf(i);
            array.splice(index, 1);
            setSelectedIndex([...array]);
        }
        else
            setSelectedIndex([...selectedIndex, i]);
    }

    const goToCheckOut = async () => {

        if (loadButton)
            return;
        
        setLoadButton(true);
        if(selectedIndex.length > 0) {
            const result = await setSeatsReserved(userData.id, webinarID, selectedIndex);
            if(result.status === "success")
                setSeatSelected(true);
            else{
                alert.error("You selected some reserved seats.");
                const reservedArray = result.data.reserved_seats;
                const currentSelectedArray = selectedIndex;
                const newArray = currentSelectedArray.filter(val => !reservedArray.includes(val));
                await getPurchaseSeatsArray(webinarID);
                setSelectedIndex([...newArray]);                
            }
            setLoadButton(false);   
        }
        else{
            alert.info("Please select the seat.");
            setLoadButton(false);
        }
            
    }
    const renderSeats = () => (
        <div className="purchase-seats-page">
            <h2 className="text-center" style={{color: fontColors.header1}}>Purchase Seats</h2>
            <div className="seats-container">
                {
                    seatsArray && seatsArray.length > 0 && seatsArray.map(
                        (seat, i) => <div key={i} className={`each-seat ${seat} ${ selectedIndex.includes(i) ? 'selected' : ''}`} onClick={()=> seat === "available" && manageSelectedIndex(i)}>{i+1}</div>
                    )
                }
            </div>
            <div className="content-center">
                <img className="stadium-img" src={`${process.env.PUBLIC_URL}/purchase_stadium.png`} alt="stadium"/>
            </div>
            <div className="content-center wth-400">
                <p style={{color: fontColors.header2}}><img src={`${process.env.PUBLIC_URL}/purchase_available.png`} alt="stadium"/>Available</p>
                <p style={{color: fontColors.header2}}><img src={`${process.env.PUBLIC_URL}/purchase_reserved.png`} alt="stadium"/>Reserved</p>
                <p style={{color: fontColors.header2}}><img src={`${process.env.PUBLIC_URL}/purchase_taken.png`} alt="stadium"/>Taken</p>
            </div>
            <div className="wth-160">
                <FormButton isLoading={loadButton} onClickFunc = {()=> goToCheckOut()}>NEXT</FormButton>
            </div>
        </div>
    );

    const renderCheckOut = () => (
        <CheckOutForm userID={userData.id} prodID={webinarID} prodType="webinar"/>
    );

    return (        
        <Fragment>
            {
                seatSelected ? renderCheckOut() : renderSeats() 
            }
        </Fragment>        
    )
});

const MapStateToProps = ({purchaseSeats, colors: {currentFontColors}}) => ({
    seatsArray: purchaseSeats.seatsArray,
    currentFontColors
})

const MapDispatchToProps = dispatch => ({
    getReservedStatus: getReservedStatus(dispatch),
    getPurchaseSeatsArray: getPurchaseSeatsArray(dispatch),
    setSeatsReserved: setSeatsReserved(dispatch),
    cancelReservation: cancelReservation(dispatch),
    setLoadAlerts: flag => dispatch(setLoadAlerts(flag))    // for waiting load
})
export default connect (MapStateToProps, MapDispatchToProps)(PurchaseSeatsPage);