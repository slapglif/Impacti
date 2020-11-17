import React from 'react';
import './landing.style.scss';
import FormButton from '../../components/form-button/form-button.component';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';

const LandingPage = ({currentFontColors}) => {

    const history = useHistory();

    const [fontColors, setFontColors] = useState({
        header1: "white",
        header2: "white"
    });

    useEffect(() => {
        if (currentFontColors) {
            const h1Color = JSON.parse(currentFontColors.header1_color);
            const h2Color = JSON.parse(currentFontColors.header2_color);
            setFontColors({
                header1: `rgba(${h1Color.r }, ${h1Color.g }, ${h1Color.b }, ${h1Color.a })`,
                header2: `rgba(${h2Color.r }, ${h2Color.g }, ${h2Color.b }, ${h2Color.a })`
            })
        }

    }, [currentFontColors]);

    return (
        <div className="landing-page">
            <div className="content">
                <p style={{color: fontColors.header1}}>MATA'S</p>
                <p style={{color: fontColors.header1}}>TACTICAL SUPPLY</p>
                <p style={{color: fontColors.header2}}>Built from a forged upper and lower AR-15 receiver with a standard barrel nut interface and mil-spec controls; The MC5 is made for abuse and high round counts.</p>
                <div className="btns">
                    <FormButton onClickFunc={() => history.push("/product", {prodType: "physical"})}>ONLINE GUN STORE</FormButton>
                    <FormButton onClickFunc={() => history.push("/product", {prodType: "webinar"})}>FIREARM WEBINARS</FormButton>
                </div>
            </div>
        </div>
    )
}

const MapStateToProps = ({ colors: { currentFontColors }}) => ({
    currentFontColors
})
export default connect(MapStateToProps)(LandingPage);