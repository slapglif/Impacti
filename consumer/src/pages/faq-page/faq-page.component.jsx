import React, {useEffect} from 'react';
import './faq-page.style.scss';
import { MDBRow, MDBCol } from 'mdbreact';
import { connect } from 'react-redux';
import { getFaqItems } from '../../redux/faq-items/faq-items.action';
import FaqItemComponent from '../../components/faq-item/faq-item.component';
// for waiting load
import { setLoadAlerts } from '../../redux/alerts/alerts.action';
import { useState } from 'react';
const FaqPage = ({items, getFaqItems, setLoadAlerts, currentFontColors}) => {

    useEffect(() => {
        async function loadData() {
            setLoadAlerts(true);
            await getFaqItems();
            setLoadAlerts(false);
        }
        loadData();
    }, []);

    const [fontColor, setFontColor] = useState("white");
    useEffect(() => {
        if (currentFontColors) {
            const color = JSON.parse(currentFontColors.header1_color);
            setFontColor(`rgba(${color.r }, ${color.g }, ${color.b }, ${color.a })`);
        }
    }, [currentFontColors]);

    return (
        <div className = 'faq-page'>
            <h2 className="text-center font-weight-bold" style={{color: fontColor}}>Frequently asked questions</h2>
            <MDBRow>
                {
                    items && items.length > 0 && items.map( item => <MDBCol size="12" sm="12" md="6" lg="6" key={item.id}>
                        <FaqItemComponent question={item.question} answer={item.answer}/>         
                    </MDBCol> )
                }                      
            </MDBRow>
        </div>
    )
};

const MapStateToProps = ({faq_items: {items}, colors: {currentFontColors}}) => ({
    items,
    currentFontColors
})

const MapDispatchToProps = dispatch => ({
    getFaqItems: getFaqItems(dispatch),
    setLoadAlerts: flag => dispatch(setLoadAlerts(flag))    // for waiting load
})

export default connect(MapStateToProps, MapDispatchToProps)(FaqPage);