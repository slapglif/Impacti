import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { MDBIcon } from 'mdbreact';
import './App.scss';
import HeaderComponent from './components/header/header.component';
import FooterComponent from './components/footer/footer.component';
import DashboardPage from './pages/dashboard/dashboard-page';
import SignInPage from './pages/signin/signin-page.component';
import ForgotPassword from './pages/forgot-password/forgot-password.component';
import ResetPasswordPage from './pages/reset-password/reset-password.component';
import SideBar from './components/sidebar/sidebar.component';
import CategoriesPage from './pages/categories/categories-page.component';
import ProductListingPage from './pages/product-listing/product-listing-page.component';
import WebinarQueuesPage from './pages/webinar-queues/webinar-queues-page.component';
import SoldWebinarPage from './pages/sold-webinar/sold-webinar-page.component';
import FFLDatabasePage from './pages/ffl-database/ffl-database-page.component';
import SoldPhysicalProductsPage from './pages/sold-physical/sold-physical.page';
import UserManagementPage from './pages/user-management/user-management.page';
import FaqPage from './pages/faq/faq.page';
import SettingsPage from './pages/settings/settings.page';
import CompletedWebinarPage from './pages/completed-webinars/completed-webinars.page';
import ProductEditPage from './pages/product-listing/product-edit/product-edit.component';

const App = ({ currentUser, isLoadPage }) => {
  
  const [userData, setUserData] = useState( JSON.parse(localStorage.getItem("userData")) || null )

  useEffect(() => {    
    if(currentUser){  
      if(currentUser === "noInfo")
        localStorage.setItem("userData", JSON.stringify(null));
      else
        localStorage.setItem("userData", JSON.stringify(currentUser));
        
      setUserData(JSON.parse(localStorage.getItem("userData")));      
    }    
  }, [currentUser]);

  return (
    <div className="App">
      <HeaderComponent />
      <div className="main-section">
        {
          // userData && <SideBar />
        }
        <Switch>                    
            <Route exact path = '/' render = {() => userData ? <Redirect to="/dashboard" /> : <SignInPage/>} />
            <Route exact path = '/dashboard' render = {() => userData ? <DashboardPage/> : <SignInPage/>} />
            <Route exact path = '/product/category' render = {() => userData ? <CategoriesPage/> : <SignInPage/>} />
            <Route exact path = '/product/product/listing' render = {() => userData ? <ProductListingPage/> : <SignInPage/>} />
            <Route exact path = '/product/product/edit' render = {() => userData ? <ProductEditPage/> : <SignInPage/>} />
            <Route exact path = '/product/product/webinar' render = {() => userData ? <WebinarQueuesPage/> : <SignInPage/>} />
            <Route exact path = '/product/sold-webinar' render = {() => userData ? <SoldWebinarPage/> : <SignInPage/>} />
            <Route exact path = '/product/ffl-db' render = {() => userData ? <FFLDatabasePage/> : <SignInPage/>} />
            <Route exact path = '/product/completed-webinar' render = {() => userData ? <CompletedWebinarPage/> : <SignInPage/>} />
            <Route exact path = '/product/sold-physical' render = {() => userData ? <SoldPhysicalProductsPage/> : <SignInPage/>} />
            <Route exact path = '/user' render = {() => userData ? <UserManagementPage/> : <SignInPage/>} />
            <Route exact path = '/faq' render = {() => userData ? <FaqPage/> : <SignInPage/>} />
            <Route exact path = '/setting' render = {() => userData ? <SettingsPage/> : <SignInPage/>} />
            <Route exact path = '/forgot-password' render = {() => userData ? <DashboardPage/> : <ForgotPassword/>} />
            <Route exact path = '/resetpassword/:code/:userID' render = {() => userData ? <DashboardPage/> : <ResetPasswordPage/>}/>
            <Route render = { () => (<h1 className="text-white text-center">Page not found...</h1>)} />     
          </Switch>
      </div>
      <FooterComponent />
      {
        isLoadPage && <div className="wait-loading">
            <MDBIcon className="loadIcon" icon="sync-alt" />
        </div>       
      }
    </div>
  );
}

const MapStateToProps = ({ user: {currentUser, isLoadPage}}) => ({
  currentUser,
  isLoadPage
})

export default connect(MapStateToProps)(App);
