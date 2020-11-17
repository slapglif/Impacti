import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { alertsShow, removeReadItem, readNotifications, setLoadAlerts } from '../../redux/alerts/alerts.action';
import { Link } from 'react-router-dom';
import './alerts.style.scss';

const NotificationAlerts = ({alertItems, alertsToggle, removeReadItem, readNotifications, setLoadAlerts}) => {

    const historyURL = useHistory();

    const handleChange = async (id, url) => {
        setLoadAlerts(true);
        const isSuccess = await readNotifications(id);
        if(isSuccess === "success"){
            removeReadItem(id);
            setLoadAlerts(false);
            historyURL.push(url);   
            alertsToggle();                   
        }
        else{
            setLoadAlerts(false);
            return;
        }          
       
    }

    return (
        <div className="alerts-div-wrapper">
            <div className="triangleDiv"></div>
            <div className="alerts-popup-div">
                <div className="font-weight-bolder text-center top-div">
                    {
                        alertItems.length > 0 ? <Fragment>
                            <span>Notifications</span>
                            <button className='alerts-count-btn'>{alertItems.length}</button>
                        </Fragment>
                        :
                            <span>No Notifications</span>
                    }                    
                </div>
                <div className="notification-items-container">
                    {
                        alertItems.length > 0 &&
                            alertItems.map(alertItem=>{
                                if(alertItem.service_type === "webinar_start"){
                                    return(                                       
                                        <div className="notification-item" key={alertItem.id} onClick={() => handleChange(alertItem.id,`/purchase_seats/${alertItem.product_id}`)}>                                
                                            <img src={process.env.PUBLIC_URL + "/prodAlert.png"} className="item-img" alt={alertItem.product_name}/>  

                                            <div className="desc-div">
                                                <div className="font-weight-bold">{alertItem.product_name}</div>
                                                <div className="font-weight-bolder">has been sold out</div>
                                            </div>
                                        </div>                                    
                                    )
                                }
                                else{
                                    return(                        
                                        <div className="notification-item" key={alertItem.id} onClick={() =>handleChange(alertItem.id,`/products/${alertItem.product_type}/${alertItem.product_id}`)}>                                
                                            <img src={process.env.PUBLIC_URL + "/prodAlert.png"} className="item-img" alt={alertItem.product_name}/>  

                                            <div className="desc-div">
                                                <div className="font-weight-bold">{alertItem.product_name}</div>
                                                <div className="font-weight-bolder">has been sold out</div>
                                            </div>
                                        </div>                                  
                                    )
                                }
                            })
                    }
                </div>
                <Link to = "/alerts_page">
                    <div className="close-notification" onClick={alertsToggle}>
                        <p className="text-center">View All Notifications</p>
                    </div>
                </Link>
            </div> 
        </div>
    )
};

const MapDispatchToProps = dispatch => ({
    alertsToggle: () => dispatch(alertsShow()),
    removeReadItem: (id) => dispatch(removeReadItem(id)),
    readNotifications: readNotifications(dispatch),
    setLoadAlerts: flag => dispatch(setLoadAlerts(flag))
})

export default connect(null, MapDispatchToProps)(NotificationAlerts);