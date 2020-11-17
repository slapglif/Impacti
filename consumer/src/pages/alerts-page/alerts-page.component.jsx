import React from 'react';
import './alerts-page.style.scss';
import { MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdbreact';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { removeReadItem, readNotifications, setLoadAlerts } from '../../redux/alerts/alerts.action';
import ReactTimeAgo from 'react-time-ago'
import { useState, useEffect } from 'react';

const AlertsPage = ({alertItems, removeReadItem, readNotifications, setLoadAlerts, currentFontColors}) => {

    const historyURL = useHistory();

    const [fontColors, setFontColors] = useState({
        header1: "white",
        header2: "white",
        paragraph: "#a3a3a3"
    });

    useEffect(() => {
        if ( currentFontColors ) {
            const h1Color = JSON.parse(currentFontColors.header1_color);
            const h2Color = JSON.parse(currentFontColors.header2_color);
            const pColor = JSON.parse(currentFontColors.paragraph_color);

            setFontColors({
                header1: `rgba(${h1Color.r }, ${h1Color.g }, ${h1Color.b }, ${h1Color.a })`,
                header2: `rgba(${h2Color.r }, ${h2Color.g }, ${h2Color.b }, ${h2Color.a })`,
                paragraph: `rgba(${pColor.r }, ${pColor.g }, ${pColor.b }, ${pColor.a })`,
            })
        }
    }, [currentFontColors]);

    const handleChange = async (id, url) => {
        setLoadAlerts(true);
        const isSuccess = await readNotifications(id);
        if(isSuccess === "success"){
            removeReadItem(id);
            setLoadAlerts(false);
            if(url)
                historyURL.push(url);             
        }
        else{
            setLoadAlerts(false);
            return;
        }     
    };
    
    return (
    <MDBContainer>
        <div className="alerts-page">            
            <p className="title" style={{color: fontColors.header1}}>Sold Out Webinar Products Alerts</p>
            <div className="alerts-container">
                <MDBContainer>
                    <p className="font-weight-bolder" style={{color: fontColors.header2}}>Alerts</p>
                    {
                        alertItems.length > 0 ?
                            alertItems.map( alertItem => {
                                if(alertItem.service_type === "webinar_start"){
                                    return(                                        
                                        <div className="alert-item" key={alertItem.id}>
                                            <MDBRow between>                                                
                                                <MDBCol middle size="10" sm="10" md="11" lg="11">
                                                    <div className="goToUrl" onClick={() => handleChange(alertItem.id,`/webinars/${alertItem.product_id}`)}>
                                                        <MDBRow>
                                                            <MDBCol middle size="3" sm="3" md="2" lg="1">
                                                                <img src={process.env.PUBLIC_URL + "/prodAlert.png"} className="item-img" alt={alertItem.product_name}/> 
                                                            </MDBCol>
                                                            <MDBCol middle size="9" sm="9" md="10" lg="11">
                                                                <p className="font-weight-bolder" style={{color: fontColors.paragraph}}><span className="font-weight-bold" style={{color: fontColors.header2}}>{alertItem.product_name} </span>has been sold out</p>
                                                                {/* <p className="time-p">{alertItem.createdAt}</p> */}
                                                                <div><ReactTimeAgo date={new Date(new Date(alertItem.createdAt).toString())}/></div>
                                                            </MDBCol>
                                                        </MDBRow>
                                                    </div>
                                                </MDBCol>                                              
                                                                                                    
                                                <MDBCol className="text-center" middle size="2" sm="2" md="1" lg="1">
                                                    <MDBIcon className="closeBtn" icon="times" onClick={()=>handleChange(alertItem.id)}/>
                                                </MDBCol>
                                            </MDBRow>
                                        </div>
                                    )
                                }
                                else{
                                    return(                                        
                                        <div className="alert-item" key={alertItem.id}>
                                            <MDBRow between>
                                                <MDBCol middle size="10" sm="10" md="11" lg="11">
                                                    <div className="goToUrl" onClick={() => handleChange(alertItem.id,`/products/${alertItem.product_type}/${alertItem.product_id}`)}>
                                                        <MDBRow>
                                                            <MDBCol middle size="3" sm="3" md="2" lg="1">
                                                                <img src={process.env.PUBLIC_URL + "/prodAlert.png"} className="item-img" alt={alertItem.product_name} />
                                                            </MDBCol>
                                                            <MDBCol middle size="9" sm="9" md="10" lg="11">
                                                                <p className="font-weight-bolder" style={{color: fontColors.paragraph}}><span className="font-weight-bold" style={{color: fontColors.header2}}>{alertItem.product_name} </span>is newly added</p>
                                                                {/* <p className="time-p">{alertItem.createdAt}</p> */}
                                                                <div><ReactTimeAgo date={new Date(new Date(alertItem.createdAt).toString())}/></div>
                                                            </MDBCol>
                                                        </MDBRow>
                                                    </div>
                                                </MDBCol>  

                                                <MDBCol className="text-center" middle size="2" sm="2" md="1" lg="1" >
                                                    <MDBIcon className="closeBtn" icon="times" onClick={()=>handleChange(alertItem.id)}/>
                                                </MDBCol>
                                            </MDBRow>
                                        </div>                        
                                    )
                                }
                            })
                        :
                            <h3 className="text-center font-weight-bolder" style={{color: fontColors.header2}}>No new notifications</h3>
                    }
                </MDBContainer>
            </div>         
        </div>
    </MDBContainer>
    )
};

const MapStateToProps = ({alerts, colors: {currentFontColors}}) => ({
    alertItems: alerts.alertItems,
    currentFontColors
})

const MapDispatchToProps = dispatch => ({
    removeReadItem: (id) => dispatch(removeReadItem(id)),
    readNotifications: readNotifications(dispatch),
    setLoadAlerts: flag => dispatch(setLoadAlerts(flag))
})


export default connect(MapStateToProps, MapDispatchToProps)(AlertsPage);