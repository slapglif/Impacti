import React from 'react';
import './buy-physical.style.scss';
import CheckOutForm from '../../components/payment-form/check-out-form/check-out-form.component';
import { withRouter } from 'react-router';

const BuyPhysicalProductPage = withRouter(({match}) => {
    const userID = JSON.parse(localStorage.getItem("userData")).id;
    const prodID = match.params.id;
    return (
        <CheckOutForm userID={userID} prodID={prodID} prodType="physical"/>
    )
})

export default BuyPhysicalProductPage;