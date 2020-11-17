import React, {useState} from 'react';
import { Link, withRouter } from 'react-router-dom';
import FormInput from '../../components/form-input/form-input.component';
import FormButton from '../../components/form-button/form-button.component';
import PasswordPolicy from '../../components/password-policy/password-policy.component';
import { connect } from 'react-redux';
import { sendResetPassword } from '../../redux/user/user.action';
import './reset-password.style.scss';
import { useAlert } from 'react-alert';

const ResetPasswordPage = withRouter(({match, sendResetPassword}) => {
    
    const alert = useAlert();

    const resetCode = match.params.code;
    const resetuserID = match.params.userID;

    const [resetPass, setResetPass] = useState({pass: '', confirmPass: '', isConfirmed: false});
    const [isLoading, setIsLoading] = useState(false);
    const [wrongPassPolicy, setWrongPassPolicy] = useState(false);

    const passwordValidator = require('password-validator');
    const schema = new passwordValidator();

    schema
    .is()
    .min(8)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits()
    .has()
    .symbols();

    const handleResetClick = async event => {
        event.preventDefault();
        if(isLoading)
            return;
        setIsLoading(true);
        
        setWrongPassPolicy(false);
        if(schema.validate(resetPass.pass)){
            if( resetPass.pass === resetPass.confirmPass ){
                const result = await sendResetPassword(resetuserID,resetCode,resetPass.pass);
                if (result === "success")
                    setResetPass({ ...resetPass, isConfirmed: true });
                else
                    alert.error("Password reset failed!");
            }
            else{
                alert.error("Password dismatch!");
            }
        }
        else {
            setWrongPassPolicy(true);
        }
        setIsLoading(false);
    };

    const handleClose = () => {
        setWrongPassPolicy(false);
    }

    const renderResetPassForm = () => (
        <div className="reqCodeForm">
            <form onSubmit = { handleResetClick }>
                <h2 className='req-title'>Reset your password</h2>
                <FormInput 
                    type="password" 
                    name = "newPass" 
                    label = "New password" 
                    value = {resetPass.pass} 
                    handleChange = {(event) => setResetPass({ ...resetPass, pass: event.target.value})} 
                    required/>
                {
                    wrongPassPolicy&&<div className="passPolicyContainer">
                            <PasswordPolicy handleClose={handleClose}/>
                        </div>
                }
                <FormInput 
                    type="password" 
                    name = "rePass" 
                    label = "Confirm password" 
                    value = {resetPass.confirmPass} 
                    handleChange = {(event) => setResetPass({ ...resetPass, confirmPass: event.target.value})} 
                    required/>
                <FormButton 
                    type="submit" 
                    isLoading={isLoading}>
                    RESET
                </FormButton>
            </form>
        </div>      
    );

    const renderSuccessMessage = () => (       
        <div className="reqCodeForm">           
            <h3 className='req-title'>Your password has been reset</h3>
            <p>
                <Link to="/">
                    <span className="font-weight-bolder text-white">Click here to login with your new credentials.</span>
                </Link>
            </p>            
        </div>  
    )

    return (
        <div className="reset-password-page">
            {
                resetPass.isConfirmed ? renderSuccessMessage() : renderResetPassForm()
            }
        </div>
    )
});

const MapDispatchToProps = dispatch => ({
    sendResetPassword: sendResetPassword(dispatch)
})
export default connect(null, MapDispatchToProps)(ResetPasswordPage);