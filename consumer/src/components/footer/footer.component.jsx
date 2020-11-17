import React, { useEffect } from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { hideAlerts } from '../../redux/alerts/alerts.action';
import { getSocialLinks } from '../../redux/others/others.action';
import './footer.style.scss';
import { MDBIcon } from 'mdbreact';
import { useState } from 'react';

const Footer = ({hideAlerts, getSocialLinks, social_links, currentFontColors}) => {

    useEffect(() => {
       async function load() {
           await getSocialLinks();
       }
       load();
    }, []);

    const [footerColor, setFooterColor] = useState("#9e9e9e");

    useEffect(() => {
        if (currentFontColors){
            const color = JSON.parse(currentFontColors.footer_color);
            setFooterColor(`rgba(${color.r }, ${color.g }, ${color.b }, ${color.a })`);
        }
    }, [currentFontColors]);

    return (
        <div className='footer-div'>
            <div>
                <Link to='/' onClick={hideAlerts} style={{color: footerColor}}>&copy;<span className="hidden">Copyright</span>{new Date().getFullYear()}matas</Link>
            </div>
            {
                social_links && <div>
                    <a href={social_links.facebook_link} target="_blank"><MDBIcon fab icon="facebook-f" className="facebook-icon" style={{color: footerColor, borderColor: footerColor}}/></a>
                    <a href={social_links.instagram_link} target="_blank"><MDBIcon fab icon="instagram" className="instagram-icon" style={{color: footerColor, borderColor: footerColor}}/></a>
                </div>
            }
            <div>
                <Link to='/term_condition_page' style={{color: footerColor}} onClick={hideAlerts}>Terms<span className="hidden">and Conditions</span></Link>
                <span style={{color: footerColor}}>&nbsp;|&nbsp;</span>
                <Link to='/contactus' style={{color: footerColor}} onClick={hideAlerts}>Contact<span className="hidden"> Us</span></Link>
            </div>
        </div>          
    )
};

const MapStateToProps = ({others: {social_links}, colors: {currentFontColors}}) => ({
    social_links,
    currentFontColors
})
const MapDispatchToProps = dispatch => ({
    hideAlerts: () => dispatch(hideAlerts()),
    getSocialLinks: getSocialLinks(dispatch)
})
export default connect(MapStateToProps, MapDispatchToProps)(Footer);