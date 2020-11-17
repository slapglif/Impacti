import React, {useState, useEffect} from 'react';
import './check-out-form.style.scss';
import { MDBRow, MDBCol } from 'mdbreact';
// import CheckoutPayButton from '../checkout-button/checkout-button.component';
import CreditCardNumberInput from '../ccNum-input/ccNum-input.component';
import FormSelect from '../../form-select/form-select.component';
import FormCheckbox from '../../form-checkbox/form-checkbox.component';
import FormButton from '../../form-button/form-button.component';
import { connect } from 'react-redux';
import { purchaseWebinarSeats, buyPhysicalProduct } from '../../../redux/purchase-seats/purchase-seats.action';

import { Link, useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';

const CheckOutForm = ({userID, prodID, purchaseWebinarSeats, buyPhysicalProduct, prodType, currentFontColors}) => {

    const alert = useAlert();

    const [fontColors, setFontColors] = useState({header1: "white", paragraph: "#a3a3a3", form: "#13a3a3"});
    useEffect(() => {
        if (currentFontColors) {
            const pColor = JSON.parse(currentFontColors.paragraph_color);
            const h1Color = JSON.parse(currentFontColors.header1_color);
            const formColor = JSON.parse(currentFontColors.form_color);
          
            setFontColors({
                paragraph: `rgba(${pColor.r }, ${pColor.g }, ${pColor.b }, ${pColor.a })`,
                header1: `rgba(${h1Color.r }, ${h1Color.g }, ${h1Color.b }, ${h1Color.a })`,
                form: `rgba(${formColor.r }, ${formColor.g }, ${formColor.b }, ${formColor.a })`      
            })
        }
    }, [currentFontColors]);

    const paymentConfig = {
        clientKey: "7G2B5wL3VnU2eB78yx6AFH7rJ6K6UMF83PMaLMRtw4XmrGbuhFr34244Wvp2uUEm",
        apiLoginId: "5munKRRN46r"
    }

    const historyURL = useHistory();

    const [isCCBtnClicked, setIsCCBtnClicked] = useState(true);

    // for payment with Credit card
    const [creditInfo, setCreditInfo] = useState({cardNum: '', month: '', year: '', cvc:''});
    const [isCCInvalid, setIsCCInvalid] = useState(false);
    const [loadButton, setLoadButton] = useState(false);

    const selectOptions1 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [optionShow1, setOptionShow1] = useState(false);
    const [placeholder1, setPlaceholder1] = useState("Month");

    const selectOptions2 = [2020,2021,2022,2023,2024,2025,2026,2027,2028,2029];
    const [optionShow2, setOptionShow2] = useState(false);
    const [placeholder2, setPlaceholder2] = useState("Year");

    const [isCVCInvalid, setIsCVCInvalid] = useState(false);
    const [isMonthInvalid, setIsMonthInvalid] = useState(false);
    const [isYearInvalid, setIsYearInvalid] = useState(false);

    
    const [isTermsChecked, setIsTermsChecked] = useState(false);
    const [isTermsUnchecked, setIsTermsUnchecked] = useState(false);

    // for payment with bank transfer
    // const [bankInfo, setBankInfo] = useState({bankName: '', bankNumber: '', ABANumber: '', accountName: ''});

    // for bank account types
    // const selectOptions = ["Personal Checking","Personal Savings", "Business Checking"];
    // const [optionShow, setOptionShow] = useState(false);
    // const [currentType, setCurrentType] = useState("Personal Checking");


    const creditCardNumberFormat = (value) => {
        let v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let matches = v.match(/\d{4,16}/g);
        let match = matches && matches[0] || '';
        let parts = [];
        let len = match.length;
        for (let i = 0; i<len; i+=4) {
            parts.push(match.substring(i, i+4))
        }
    
        if (parts.length) {
            return parts.join(' ')
        } else {
            return value
        }
    }   

    
    const cvcNumberFormat = (e) => {        
        const re = /^[0-9\b]+$/;
        // if value is not blank, then test the regex

        if (e.target.value === '' || re.test(e.target.value)) {
            setCreditInfo({ ...creditInfo, cvc: e.target.value})
        }
    }

    const validateCVCNumber = (cvcNum) => {
        let cvcRegEx = /^[0-9]{3,4}$/;
        return cvcRegEx.test(cvcNum);
    }

    const validateCreditCardNumber = (ccNum) => {

        ccNum = ccNum.split(" ").join("");
    
        var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
        var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
        var amexpRegEx = /^(?:3[47][0-9]{13})$/;
        var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
        return visaRegEx.test(ccNum) || mastercardRegEx.test(ccNum) || amexpRegEx.test(ccNum) || discovRegEx.test(ccNum);
    }

    const sendPaymentDataToAnet = () => {
        const authData = {};
        authData.clientKey = paymentConfig.clientKey;
        authData.apiLoginID = paymentConfig.apiLoginId;
        const cardData = {};
        cardData.cardNumber = creditInfo.cardNum.replace(/\s/g, "");
        cardData.month = creditInfo.month;
        cardData.year = creditInfo.year;
        cardData.cardCode = creditInfo.cvc;
        const secureData = {};
        secureData.authData = authData;
        secureData.cardData = cardData;
        return new Promise((resolve, reject) => {
          window.Accept.dispatchData(secureData, (res) => {
            if (res.messages.resultCode === "Error") return reject(res);
            resolve(res);
          });
        });
      };

    const handleCreditCardCheckOut = async event => {
        event.preventDefault();
        if (loadButton)
            return;
        
        setIsCCInvalid(false);
        setIsCVCInvalid(false);
        setIsTermsUnchecked(false);
        setIsMonthInvalid(false);
        setIsYearInvalid(false);
  
        const isValidCCNum = validateCreditCardNumber(creditInfo.cardNum);
        const isValidCVCNum = validateCVCNumber(creditInfo.cvc);
        
        if(isValidCCNum && isValidCVCNum && isTermsChecked && (placeholder1 !== "Month") && (placeholder2 !== "Year")){
            setLoadButton(true);
            
            sendPaymentDataToAnet()
            .then((res) => {
                const { opaqueData } = res;
                switch (prodType) {
                    case "physical":
                        buyPhysicalProduct({
                        opaqueData,
                        userID,
                        productID: prodID,
                        orderStatus: "Purchased",
                        product_type: "product",
                        })
                        .then((res) => {
                            setLoadButton(false);
                            if (res.message === "success") {
                                historyURL.push("/product");
                            }
                        })
                        .catch((err) => {
                            console.log(err.response.data);
                            setLoadButton(false);
                        });
                        break;
                    case "webinar":
                        purchaseWebinarSeats({
                        opaqueData,
                        user_id: userID,
                        webinar_id: prodID,
                        })
                        .then((res) => {
                            setLoadButton(false);
                            if (res.message === "success") {
                                historyURL.push("/product");
                            }
                        })
                        .catch((err) => {
                            console.log(err.message);
                            setLoadButton(false);
                        });
                        break;
                default:
                    return;
                }
            })
            .catch((err) => {
                console.log(err.messages);
                if (err.messages.message[0].code === "E_WC_05")
                    setIsCCInvalid(true);
                else
                    alert.error(err.messages.message[0].text);
                setLoadButton(false);
            });
        }
        else{
            if(!isValidCCNum)
                setIsCCInvalid(true);
            if(!isValidCVCNum)
                setIsCVCInvalid(true);
            if(!isTermsChecked)
                setIsTermsUnchecked(true);
            if(placeholder1 === "Month")
                setIsMonthInvalid(true);
            if(placeholder2 === "Year")
                setIsYearInvalid(true);
            return;
        }
    }

    // const handleBankTransfer = async event => {
    //     event.preventDefault();
    //     if (loadButton)
    //         return;

    //     if (isTermsChecked){
    //         setLoadButton(true);

    //         let result;
    //         if (prodType === "webinar")
    //             result = await purchaseWebinarSeats(userID, prodID);
    //         else 
    //             result = await buyPhysicalProduct(userID, prodID);
    //         setLoadButton(false);
    //         if (result.message === "success") {
    //             historyURL.push("/");
    //         }
    //     }
    //     else{
    //         setIsTermsUnchecked(true);
    //         return;
    //     }
    // }
    

    return (
        <div className="check-out-page">
            <div className="check-out-form">
                <h2 className="font-weight-bold text-center mb-4" style={{color: fontColors.header1}}>Checkout</h2>
                {/* <MDBRow className="payBtnGroup">
                    <MDBCol>
                        <CheckoutPayButton payType="card" active={isCCBtnClicked} onClickFunc={()=>{
                            setIsTermsUnchecked(false);
                            setIsCCBtnClicked(true);
                            }}/>               
                    </MDBCol>
                    <MDBCol>
                        <CheckoutPayButton payType="bank" active={!isCCBtnClicked} onClickFunc={()=>{
                            setIsTermsUnchecked(false);
                            setIsCCBtnClicked(false);
                        }}/>
                    </MDBCol>
                </MDBRow> */}
                {/* {
                    isCCBtnClicked ?  */}
                    <form onSubmit={handleCreditCardCheckOut}>
                        <p className="label">Card Number</p>
                        <CreditCardNumberInput value = {creditInfo.cardNum} handleChange = {(event) => setCreditInfo({ ...creditInfo, cardNum: creditCardNumberFormat(event.target.value)})} forCC={true} style={{color: fontColors.form}} placeHolder="number" isInvalidNum={isCCInvalid} autoComplete="cc-number"/>
                        {
                            isCCInvalid && <p className="text-danger invalidNum">Invalid CC Number</p>
                        }
                        <MDBRow className="mb-4 mt-4">
                            <MDBCol size="6" sm="6" md="6" lg="4">
                                <p className="label">Expiration Date</p>
                                <FormSelect forPayment = {true} options={selectOptions1} showSelectBox={()=>setOptionShow1(!optionShow1)} selectOption={(event)=>{
                                    setOptionShow1(false);
                                    setPlaceholder1(event.target.id);
                                    setCreditInfo({...creditInfo, month: (selectOptions1.indexOf(event.target.id)+1) < 10 ? "0"+(selectOptions1.indexOf(event.target.id)+1).toString() : (selectOptions1.indexOf(event.target.id)+1).toString()});
                                }} optionShow={optionShow1} placeholder={placeholder1} isInvalid={isMonthInvalid}/>
                                {
                                    isMonthInvalid && <p className="text-danger invalidNum">Invalid Month</p>
                                }
                            </MDBCol>
                            <MDBCol size="6" sm="6" md="6" lg="4">
                                <p className="label">&nbsp;</p>
                                <FormSelect forPayment = {true} options={selectOptions2} showSelectBox={()=>setOptionShow2(!optionShow2)} selectOption={(event)=>{
                                    setOptionShow2(false);
                                    setPlaceholder2(event.target.id);
                                    setCreditInfo({...creditInfo, year: (event.target.id).slice(2)});
                                }} optionShow={optionShow2} placeholder={placeholder2} isInvalid={isYearInvalid}/>
                                {
                                    isYearInvalid && <p className="text-danger invalidNum">Invalid Year</p>
                                }
                            </MDBCol>
                            <MDBCol size="12" sm="12" md="12" lg="4">
                                <p className="label">CVC</p>
                             
                                <input className={`${isCVCInvalid ? "red-outline" : ""} cvc-input`} style={{color: fontColors.form}} type="text" placeholder="Three Digits"  value = {creditInfo.cvc} onChange = {(event) => cvcNumberFormat(event)} maxLength="4" autoComplete="cc-csc"/>
                                {
                                    isCVCInvalid && <p className="text-danger invalidNum">Invalid CVC Number</p>
                                }
                            </MDBCol>
                        </MDBRow>
                        <div className = 'checkbox-container  mb-4'>
                            <FormCheckbox Notif = {isTermsChecked} handleChange = {()=> 
                                setIsTermsChecked(!isTermsChecked)}/>
                            <p style={{color: fontColors.paragraph}}>I confirm that I have understood I am buying a {`${prodType==="webinar" ? "webinar" : "physical product"}`} and I have read the &nbsp;<Link to='/term_condition_page' className='underline'>Terms and Conditions</Link></p>
                        </div>
                        {
                            isTermsUnchecked&&<div className="alert alert-danger text-center" role="alert">
                                                You should accept Terms&amp;Conditions!
                                            </div>
                        } 
                        <FormButton isLoading={loadButton} type="submit">CHECKOUT</FormButton>
                    </form>
                    {/* :
                    <form onSubmit={handleBankTransfer}>
                        <p className="label">Bank Name</p>
                        <CreditCardNumberInput value = {bankInfo.bankName} handleChange = {(event) => setBankInfo({ ...bankInfo, bankName: event.target.value})} forCC={false} placeHolder="bank name" required/>
                        
                        <p className="label mt-2">Bank Account Number</p>
                        <CreditCardNumberInput value = {bankInfo.bankNumber} handleChange = {(event) => setBankInfo({ ...bankInfo, bankNumber: event.target.value})} forCC={false} placeHolder="bank account number" required/>
                        
                        <p className="label mt-2">ABA Routing Number</p>
                        <CreditCardNumberInput value = {bankInfo.ABANumber} handleChange = {(event) => setBankInfo({ ...bankInfo, ABANumber: event.target.value})} forCC={false} placeHolder="ABA number" required/>
                        
                        <p className="label mt-2">Name On Account</p>
                        <CreditCardNumberInput value = {bankInfo.accountName} handleChange = {(event) => setBankInfo({ ...bankInfo, accountName: event.target.value})} forCC={false} placeHolder="account name" required/>
                        
                        <p className="label mt-2">Bank Account Type</p>
                        <FormSelect forPayment = {true} options={selectOptions} showSelectBox={()=>setOptionShow(!optionShow)} selectOption={(event)=>{
                            setOptionShow(false);
                            setCurrentType(event.target.id);
                        }} optionShow={optionShow} placeholder={currentType}/>
                        <div className = 'checkbox-container  mb-4 mt-4'>
                            <FormCheckbox Notif = {isTermsChecked} handleChange = {()=> 
                                setIsTermsChecked(!isTermsChecked)}/>
                            <p className="grey-text">I confirm that I have understood I am buying a webinar and I have read the &nbsp;<Link to='/term_condition_page' className='underline'>Terms and Conditions</Link></p>
                        </div>
                        {
                            isTermsUnchecked&&<div className="alert alert-danger text-center" role="alert">
                                            You should accept Terms&amp;Conditions!
                                        </div>
                        } 
                        <FormButton isLoading={loadButton} type="submit">CHECKOUT</FormButton>
                    </form>
                } */}
            </div>
        </div>
    )
}

const MapStateToProps = ({ colors: {currentFontColors}}) => ({
    currentFontColors
})

const MapDispatchToProps = dispatch => ({
    purchaseWebinarSeats: purchaseWebinarSeats(dispatch),
    buyPhysicalProduct: buyPhysicalProduct(dispatch)
})

export default connect(MapStateToProps, MapDispatchToProps)(CheckOutForm);
