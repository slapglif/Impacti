import React, {useState, useEffect} from 'react';
import './verify-code-input.style.scss';

import { MDBIcon } from 'mdbreact';
import FormButton from '../../components/form-button/form-button.component';
import { connect } from 'react-redux';

const VerifyCodeInput = ({
        handleConfirmSubmit, 
        email_or_phone, 
        phone, 
        credential,
        setCredential,
        resendCode,
        isResend, 
        isLoading,
        isShowResend,
        currentFontColors}) => {

        const [fontColor, setFontColor] = useState({header1: "white", header2: "white", paragraph: "#a3a3a3"});
        useEffect(() => {
            if (currentFontColors) {
                const h1Color = JSON.parse(currentFontColors.header1_color);                
                const h2Color = JSON.parse(currentFontColors.header2_color);
                const pColor = JSON.parse(currentFontColors.paragraph_color);
                setFontColor({
                    header1: `rgba(${h1Color.r }, ${h1Color.g }, ${h1Color.b }, ${h1Color.a })`,
                    header2: `rgba(${h2Color.r }, ${h2Color.g }, ${h2Color.b }, ${h2Color.a })`,
                    paragraph: `rgba(${pColor.r }, ${pColor.g }, ${pColor.b }, ${pColor.a })`,
                })
            }
        }, [currentFontColors]);
        
        let codeInput1 = React.createRef();
        let codeInput2 = React.createRef();
        let codeInput3 = React.createRef();
        let codeInput4 = React.createRef();
        let codeInput5 = React.createRef();
        let codeInput6 = React.createRef();

        const [codeInput, setCodeInput] = useState({code1:'',code2:'',code3:'',code4:'',code5:'',code6:''});
     
        const handleTextChange1 = e=> {
            if (e.target.value.length <= 1) {
                setCodeInput({...codeInput, code1:e.target.value});
            }
            if (e.target.value.length === 1) {
                codeInput2.current.focus();
            }
        }
        const handleTextChange2 = e=> {
            if (e.target.value.length <= 1) {
                setCodeInput({...codeInput, code2:e.target.value});
            }
            if (e.target.value.length === 1) {
                codeInput3.current.focus();
            }
        }
        const handleTextChange3 = e=> {
            if (e.target.value.length <= 1) {
                setCodeInput({...codeInput, code3:e.target.value});
            }
            if (e.target.value.length === 1) {
                codeInput4.current.focus();
            }
        }

        const handleTextChange4 = e=> {
            if (e.target.value.length <= 1) {
                setCodeInput({...codeInput, code4:e.target.value});
            }
            if (e.target.value.length === 1) {
                codeInput5.current.focus();
            }
        }

        const handleTextChange5 = e=> {
            if (e.target.value.length <= 1) {
                setCodeInput({...codeInput, code5:e.target.value});
            }
            if (e.target.value.length === 1) {
                codeInput6.current.focus();
            }
        }

        const handleTextChange6 = e=> {  
            if (e.target.value.length <= 1) {
                setCodeInput({...codeInput, code6:e.target.value});
            }  
            if (e.target.value.length === 1) {
                setCredential({...credential, confirmcode:codeInput.code1+codeInput.code2+codeInput.code3+codeInput.code4+codeInput.code5+e.target.value});
            }   
        }

        return (
            <form onSubmit={handleConfirmSubmit}>
                <h2 className='text-center font-weight-bold' style={{color: fontColor.header1}}>Verify your {email_or_phone}</h2>
                <p className="text-center my-p-color font-weight-bolder" style={{color: fontColor.paragraph}}>Please enter the 6 digit code sent to <span className="red-span">{
                    email_or_phone === "Phone" ? phone : credential.email
                }</span></p>
                <div className="code-input-group">
                    <input value={codeInput1.code1} id={`${email_or_phone}1`} type="tel" className="code-input" onChange={handleTextChange1} maxLength="1" autoComplete="off"/>
                    <input value={codeInput1.code2} id={`${email_or_phone}2`} type="tel" className="code-input" ref={codeInput2} onChange={handleTextChange2} maxLength="1" autoComplete="off"/>
                    <input value={codeInput1.code3} id={`${email_or_phone}3`} type="tel" className="code-input" ref={codeInput3} onChange={handleTextChange3} maxLength="1" autoComplete="off"/>
                    <input value={codeInput1.code4} id={`${email_or_phone}4`} type="tel" className="code-input" ref={codeInput4} onChange={handleTextChange4} maxLength="1" autoComplete="off"/>
                    <input value={codeInput1.code5} id={`${email_or_phone}5`} type="tel" className="code-input" ref={codeInput5} onChange={handleTextChange5} maxLength="1" autoComplete="off"/>
                    <input value={codeInput1.code6} id={`${email_or_phone}6`} type="tel" className="code-input" ref={codeInput6} onChange={handleTextChange6} maxLength="1" autoComplete="off"/>                    
                </div>
                {
                    isShowResend ?
                        <p className="text-center resend-param" style={{color: fontColor.header2}}><span onClick={resendCode}><strong>
                            RESEND CODE
                            {
                                isResend&&<MDBIcon className="load-sub-icon" icon="sync-alt" />
                            }
                        </strong></span></p>
                        :
                        <div className="pt-4 pb-4"></div>
                }
                <FormButton type="submit" isLoading={isLoading}>CONFIRM</FormButton>
            </form>
        )
};
const MapStateToProps = ({colors: {currentFontColors}}) => ({
    currentFontColors
})
export default connect(MapStateToProps)(VerifyCodeInput);