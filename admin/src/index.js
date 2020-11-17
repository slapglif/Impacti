import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './redux/store';
import { Amplify } from 'aws-amplify';
import config from './config'; 
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID
  },
  API: {
    endpoints: [
      {
        name: "matas",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
    ]
  }
});

// for alert template configuration
const alertOptions = {
  position: positions.TOP_RIGHT,
  timeout: 5000,
  transition: transitions.SCALE
}

ReactDOM.render(
  <Provider store={store}>
      <BrowserRouter>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <App />
        </AlertProvider>
      </BrowserRouter>
    </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
