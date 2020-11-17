import React from 'react';
import './product-gallery-item.style.scss';
import { useHistory } from 'react-router-dom';
import { MDBCol } from 'mdbreact';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';

const ProductGalleryItem = ({item,i, currentFontColors}) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const historyUrl = useHistory();

    const [colors, setColors] = useState({header1: "white", header2: "white"});

    useEffect(() => {
        if( currentFontColors ){
            const header1color = JSON.parse(currentFontColors.header1_color);
            const header2color = JSON.parse(currentFontColors.header2_color);
            setColors({header1: `rgba(${header1color.r }, ${header1color.g }, ${header1color.b }, ${header1color.a })`,
                header2: `rgba(${header2color.r }, ${header2color.g }, ${header2color.b }, ${header2color.a })`});
        }
    }, [currentFontColors]);

    return (
        <MDBCol size="12" sm="6" md="6" lg="3" className="list-item">
            <div className="img-wrapper" onClick={()=>{
                userData ? historyUrl.push(`/products/${item.product_type}/${item.id}`) : historyUrl.push('/signin')
            }}>
                <img src={process.env.PUBLIC_URL + `/product_images/Product${i%8+1}.png`} alt={item.product_name} className="prod-img" />
                <label>{item.product_type === "webinar" ? "WEBINAR" : "PRODUCT"}</label>
            </div>
            <p className="text-center mt-2" style={{color: colors.header1}}>{item.product_name}</p>
            <p className="text-center" style={{color: colors.header2}}><span style={{color: colors.header2}}>{`$${item.product_price}.00 `}</span>each | <span style={{color: colors.header2}}>{item.product_count} </span>{item.product_type === "webinar" ? "seats remaining" : "left in stock"}</p>
        </MDBCol>
    )
};

const MapStateToProps = ({ colors: {currentFontColors}}) => ({
    currentFontColors
})
export default connect(MapStateToProps)(ProductGalleryItem);