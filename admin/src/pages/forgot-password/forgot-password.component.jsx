import React, { useState } from 'react';
import { connect } from 'react-redux';
import { sendForgotPassword } from '../../redux/user/user.action';
import './forgot-password.style.scss';
import FormInput from '../../components/form-input/form-input.component';
import FormButton from '../../components/form-button/form-button.component';
import { useAlert } from 'react-alert';

const ForgotPassword = ({ sendForgotPassword }) => {

    const alert = useAlert();

    const [forgotPass, setForgotPass] = useState({email: ""});    
    const [isLoading, setIsLoading] = useState(false);    

    const handleSendCodeClick = async event => {

        if(isLoading)
            return;
        setIsLoading(true);

        event.preventDefault();   
        
        const result = await sendForgotPassword(forgotPass.email);
        if (result === "success")
            alert.success("Request success! Check your email.");
        else
            alert.error("Unregistered user!");

        setIsLoading(false);

    };

    const renderRequestCodeForm = () => (     
        <div className="reqCodeForm">
            <form onSubmit = { handleSendCodeClick }>
                <h2 className='req-title'>Forgot Password</h2>
                <FormInput 
                    type="email" 
                    name = "email" 
                    label = "E-mail Address" 
                    value = {forgotPass.email} 
                    handleChange = {(event) => setForgotPass({ ...forgotPass, email: event.target.value})} 
                    required/>
                <div className="emailExistLabel">
                    <p className="font-weight-bolder text-center">If an account with this email exists, a password reset email will be sent shortly. </p>    
                </div>                
                <FormButton 
                    type="submit" 
                    isLoading={isLoading}>
                    SEND
                </FormButton>   
            </form>
        </div>         
    );

    return(
        <div className="forgot-password-page">
            {       
                renderRequestCodeForm()
            }
        </div>
    )
};

const MapDispatchToProps = dispatch => ({
    sendForgotPassword: sendForgotPassword(dispatch)
});

export default connect( null, MapDispatchToProps)(ForgotPassword);