import React, {useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { connect } from 'react-redux';
import { getCurrentUser } from '../../redux/user/user.action';
import './signin-page.style.scss';
import FormInput from '../../components/form-input/form-input.component';
import FormButton from '../../components/form-button/form-button.component';
import { useAlert } from 'react-alert';

const SignInPage = ({getCurrentUser}) => {

    const alert = useAlert();

    const [credential, setCredential] = useState({ email:'', pass:''});

    const history = useHistory();

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
     
        if(isLoading)
            return;
        setIsLoading(true);

        try {
            const reuslt = await Auth.signIn(credential.email, credential.pass);                
            console.log("Getting token ============= ", reuslt);
            const sessionResult = await Auth.userSession(reuslt);
            localStorage.clear();
            localStorage.setItem("userSession", JSON.stringify(sessionResult));
            console.log("Getting session = = ", sessionResult);
             
            const firstName = await getCurrentUser({email: credential.email});
            if (firstName)
                history.push("/dashboard");
            else
                alert.error("Not registered user! Check and try again.");
            setIsLoading(false);
        } catch (error) {
            console.log(error);      
            alert.error("The username and/or password combination is incorrect.");
            setIsLoading(false);
        }
      
    }

    return(        
        <div className = 'sign-in-page'>                        
            <div className='login-form'>
                <form onSubmit={handleSubmit}>
                    <h2 className='login-title text-center font-weight-bold'>Login to Admin</h2>
                    <FormInput type="email" name = "email" label = "E-mail" value = {credential.email} handleChange = {(event) => setCredential({ ...credential, email: event.target.value})} required/>
                    <FormInput type="password" name = "pass" label = "Password" value = {credential.pass} handleChange = {(event) => setCredential({...credential, pass: event.target.value})} required/>
                    <FormButton type="submit" isLoading={isLoading}>LOG IN</FormButton>
                    <p className='mt-3'><Link to='/forgot-password' className='white-text text-center ft-400'>Forgot password ?</Link></p>
                </form>        
            </div>                      
        </div>
    );
};

const MapDispatchToProps = dispatch => ({
    getCurrentUser: getCurrentUser(dispatch)
})

export default connect(null, MapDispatchToProps)(SignInPage);