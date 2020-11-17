import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './App.scss';

import Header from './components/header/header.component';
import Footer from './components/footer/footer.component';
import SignUpPage from './pages/sign-up-page/sign-up-page.component';
import ContactUs from './pages/contactus/contactus.component';
import SignInPage from './pages/sign-in-page/sign-in-page.component';
import ForgotPassword from './pages/forgot-password/forgot-password.component';
import TermsAndConditionPage from './pages/term-condition-page/term-condition.component';
import {MDBIcon} from 'mdbreact';
import ResetPasswordPage from './pages/reset-password/reset-password.component';
import { getNotifications } from './redux/alerts/alerts.action';
import { getCurrentFontColors } from './redux/colors/colors.action';
import { setLoadAlerts } from './redux/alerts/alerts.action';

import LayOut from './Layout';

  const App = ({ currentUser, 
              isLoadingAlerts,
              isTableLoad,
              getNotifications,
              getCurrentFontColors,
              setLoadAlerts
            }) => {  
  
  const [userData, setUserData] = useState( JSON.parse(localStorage.getItem("userData")) || null )

  useEffect(() => {
    async function loadColors() {
      setLoadAlerts(true);
      await getCurrentFontColors();
      setLoadAlerts(false);
    }

    loadColors()
  }, []);

  useEffect(() => {    
    if(currentUser){  
      if(currentUser === "noInfo")
        localStorage.setItem("userData", JSON.stringify(null));
      else
        localStorage.setItem("userData", JSON.stringify(currentUser));
        
      setUserData(JSON.parse(localStorage.getItem("userData")));    
    }    
  }, [currentUser]);

  useEffect(() => {
    async function loadData() {
      await getNotifications(userData.id);
    }
    if(userData)
      loadData()
  }, [userData]);

  return (
    <div className = 'App'>
      <Header/>
      <div className="main-section">
        <Switch>                    
          <Route exact path = '/signup' render = {() => JSON.parse(localStorage.getItem("userData")) ? <Redirect to="/" /> : <SignUpPage/>} />
          <Route exact path = '/signin' render = {() => JSON.parse(localStorage.getItem("userData")) ? <Redirect to="/" /> : <SignInPage/>} />
          <Route exact path = '/forgot-password' render = {() => JSON.parse(localStorage.getItem("userData")) ? <Redirect to="/" /> : <ForgotPassword/>} />
          <Route exact path = '/resetpassword/:code/:userID' component = {ResetPasswordPage} />
          <Route exact path = '/contactus' component = {ContactUs} />
          <Route exact path = '/term_condition_page' component = {TermsAndConditionPage} />
          <Route path='/' render = {() => <LayOut />} />                   
        </Switch>
      </div>
      <Footer/>
      {
        (isLoadingAlerts || isTableLoad) && <div className="wait-loading">
            <MDBIcon className="loadIcon" icon="sync-alt" />
        </div>       
      }
    </div>
  )
}

const MapStateToProps = ({ user: {currentUser}, alerts: {isLoadingAlerts}, purchasedItems: { isTableLoad} }) => ({
    currentUser,
    isLoadingAlerts,
    isTableLoad
})

const MapDispatchToProps = dispatch => ({
  getNotifications: getNotifications(dispatch),
  getCurrentFontColors: getCurrentFontColors(dispatch),
  setLoadAlerts: flag => dispatch(setLoadAlerts(flag))
})


export default connect(MapStateToProps, MapDispatchToProps)(App);

