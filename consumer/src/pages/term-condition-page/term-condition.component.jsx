import React from 'react';
import './term-condition.style.scss';
import { MDBRow, MDBCol } from 'mdbreact';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';

const TermsAndConditionPage = ({currentFontColors}) => {

    const [fontColor, setFontColor] = useState({
        header1: "white",
        header2: "white",
        paragraph: "#a3a3a3"
    });
    useEffect(() => {
        if (currentFontColors) {
            const h1Color = JSON.parse(currentFontColors.header1_color);
            const h2Color = JSON.parse(currentFontColors.header2_color);
            const pColor = JSON.parse(currentFontColors.paragraph_color);

            setFontColor({
                header1: `rgba(${h1Color.r }, ${h1Color.g }, ${h1Color.b }, ${h1Color.a })`,
                header2: `rgba(${h2Color.r }, ${h2Color.g }, ${h2Color.b }, ${h2Color.a })`,
                paragraph: `rgba(${pColor.r }, ${pColor.g }, ${pColor.b }, ${pColor.a })`
            })
        }
    }, [currentFontColors]);

    return(
        <div className="term-condition-page">
            <MDBRow className="title">
                <MDBCol bottom size="12" sm="12" md="6" lg="6">
                    <p className="size33" style={{color: fontColor.header1}}>Terms &#38; Conditions</p>
                </MDBCol>
                <MDBCol bottom size="12" sm="12" md="6" lg="6">
                    <p className="font-weight-bold text-right" style={{color: fontColor.header2}}>Last Revised: <span style={{color: fontColor.paragraph}}>Sept 2,2019</span></p>
                </MDBCol>
            </MDBRow>
            <div className="section-div">
                <div className="section-title">
                    <h4 className="text-white">1. Introduction:</h4>
                </div>
                <div className="section-content">
                    <div>
                        <h5 className="text-white">1.1</h5>
                    </div>
                    <div className="grey-text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </div>
                </div>
                <div className="section-content">
                    <div>
                        <h5 className="text-white">1.2</h5>
                    </div>
                    <div className="grey-text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </div>
                </div>

                <div className="section-title">
                    <h4 className="text-white">2. Accessing Mata's Technical Supply:</h4>
                </div>
                <div className="section-content">
                    <div>
                        <h5 className="text-white">2.1</h5>
                    </div>
                    <div className="grey-text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </div>
                </div>

                <div className="section-title">
                    <h4 className="text-white">3. Payment Terms:</h4>
                </div>
                <div className="section-content">
                    <div>
                        <h5 className="text-white">3.1</h5>
                    </div>
                    <div className="grey-text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </div>
                </div>
            </div>

           
                
            
        </div>
    )
};

const MapStateToProps = ({ colors: { currentFontColors }}) => ({
    currentFontColors
})

export default connect(MapStateToProps)(TermsAndConditionPage);