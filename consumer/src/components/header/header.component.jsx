import React, { Fragment, useState, useEffect } from 'react';
import logo from '../../assets/gun-logo.png';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './header.style.scss';
import { Auth } from 'aws-amplify';

import {
    MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse,
    MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon
} from "mdbreact";

import { alertsShow, hideAlerts, getNotifications } from '../../redux/alerts/alerts.action';
import { delCurrentUser } from '../../redux/user/user.action';
import NotificationAlerts from '../alerts/alerts.component';

const Header = ({ isShow, alertItems, alertsToggle, hideAlerts, getNotifications, delCurrentUser, currentFontColors }) => {

    const userData = JSON.parse(localStorage.getItem("userData"));

    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState({ webinar: false, product: false, myaccount: false, faqs: false });
    const urlHistory = useHistory();
    const [flag, setFlag] = useState(-1);    // for 2 minutes setInterval

    useEffect(() => {

        if (urlHistory.location.pathname.indexOf("/faqs") > -1)
            setActiveItem({ webinar: false, product: false, myaccount: false, faqs: true });
        else if (urlHistory.location.pathname.indexOf("/myaccount") > -1)
            setActiveItem({ webinar: false, product: false, myaccount: true, faqs: false });
        else{
            if( urlHistory.location.state && urlHistory.location.state.prodType === "webinar")
                setActiveItem({ webinar: true, product: false, myaccount: false, faqs: false });
            else if( urlHistory.location.state && urlHistory.location.state.prodType === "physical")
                setActiveItem({ webinar: false, product: true, myaccount: false, faqs: false });
            else
                setActiveItem({ webinar: false, product: false, myaccount: false, faqs: false });
        }
            
    }, [urlHistory.location]);



    useEffect(() => {
        if (userData) {   
            // for get notification every 2 minutes
            if (flag < 0) {
                setFlag(setInterval(async () => {
                    if (JSON.parse(localStorage.getItem("userData"))) {
                        await getNotifications(userData.id);
                    }                                                  
                }, 120*1000));
            }
        }
    }, []);

    const [menuFontColor, setMenuFontColor] = useState("#3F729B");

    useEffect(() => {
        if (currentFontColors){
            const color = JSON.parse(currentFontColors.menu_color);
            setMenuFontColor(`rgba(${color.r }, ${color.g }, ${color.b }, ${color.a })`);
        }
            
    }, [currentFontColors]);

    return (
        <Fragment>
            <MDBNavbar className='customNav' color='white' light expand="md">
                <MDBNavbarBrand href="/" onClick={hideAlerts}>
                    <img src={logo} alt="Mata's Tactical Supply" />
                </MDBNavbarBrand>
                <MDBNavbarToggler onClick={() => setIsOpen(!isOpen)} />
                <MDBCollapse id="navbarCollapse3" isOpen={isOpen} navbar>
                    <MDBNavbarNav right>
                        {
                            JSON.parse(localStorage.getItem("userData")) ?
                                <MDBNavItem className="alerts-nav">
                                    <MDBNavLink to='#' className='notification-div' onClick={alertsToggle}>
                                        <MDBIcon className='notification-bell' far icon="bell" style={{color: menuFontColor}} />
                                        {
                                            alertItems.length > 0 && <button className='notification-button'>{alertItems.length}</button>
                                        }
                                    </MDBNavLink>
                                    {
                                        isShow && <div className="alerts-container">
                                            <NotificationAlerts alertItems={alertItems} />
                                        </div>
                                    }
                                </MDBNavItem>
                                :
                                null
                        }
                        <MDBNavItem onClick={()=>urlHistory.push("/product", {prodType: "webinar"})}>
                            <MDBNavLink to="#" className={`${activeItem.webinar && 'actived'} menu-item`}  onClick={()=> {
                                hideAlerts();                                
                            }}><span style={{color: menuFontColor}}>Webinars</span></MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem onClick={()=>urlHistory.push("/product", {prodType: "physical"})}>
                            <MDBNavLink to="#" className={`${activeItem.product && 'actived'} menu-item`}  onClick={()=> {
                                hideAlerts();                                
                            }}><span style={{color: menuFontColor}}>Products</span></MDBNavLink>
                        </MDBNavItem>

                        <MDBNavItem>
                            <MDBDropdown >
                                <MDBDropdownToggle nav className={`${activeItem.myaccount && 'actived'} menu-item`} onClick={()=> !userData && urlHistory.push("/myaccount/my_profile")}>
                                    <span style={{color: menuFontColor}}>My Account</span>
                                </MDBDropdownToggle>
                                {
                                    userData && <MDBDropdownMenu >
                                        <MDBDropdownItem className="menu-subitem" onClick={() => {
                                            hideAlerts();
                                            urlHistory.push("/myaccount/purchase_history");
                                        }}>
                                            <MDBIcon icon="cart-arrow-down" style={{color: menuFontColor}}/>
                                            <span style={{color: menuFontColor}}>Purchase history</span>
                                        </MDBDropdownItem>
                                        <MDBDropdownItem className="menu-subitem" onClick={() => {
                                            hideAlerts();
                                            urlHistory.push("/myaccount/my_profile");
                                        }}>
                                            <MDBIcon icon="user" style={{color: menuFontColor}}/>
                                            <span style={{color: menuFontColor}}>My profile</span>
                                        </MDBDropdownItem>
                                        <MDBDropdownItem className="menu-subitem" onClick={() => {
                                            hideAlerts();
                                            urlHistory.push("/myaccount/my_comments");
                                        }}>
                                            <MDBIcon far icon="comments" style={{color: menuFontColor}}/>
                                            <span style={{color: menuFontColor}}>My comments</span>
                                        </MDBDropdownItem>
                                        <MDBDropdownItem className="menu-subitem" onClick={() => {
                                            hideAlerts();
                                            Auth.signOut();
                                            localStorage.clear();
                                            delCurrentUser();   
                                            urlHistory.push("/");
                                        }}>
                                            <MDBIcon icon="sign-in-alt" style={{color: menuFontColor}}/>
                                            <span style={{color: menuFontColor}}>Log out</span>
                                        </MDBDropdownItem>
                                    </MDBDropdownMenu>
                                }
                            </MDBDropdown>
                        </MDBNavItem>

                        <MDBNavItem >
                            <MDBNavLink to="/faqs" className={`${activeItem.faqs && 'actived'} menu-item`} onClick={hideAlerts}><span style={{color: menuFontColor}}>FAQs</span></MDBNavLink>
                        </MDBNavItem>
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBNavbar>
        </Fragment>
    )
};

const MapStateToProps = ({ alerts, colors: {currentFontColors} }) => ({
    isShow: alerts.isShow,
    alertItems: alerts.alertItems,
    currentFontColors
});

const MapDispatchToProps = dispatch => ({
    alertsToggle: () => dispatch(alertsShow()),
    hideAlerts: () => dispatch(hideAlerts()),
    getNotifications: getNotifications(dispatch),
    delCurrentUser: () => dispatch(delCurrentUser())
})

export default connect(MapStateToProps, MapDispatchToProps)(Header);