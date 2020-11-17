import React from 'react';
import logo from '../../assets/imgs/gun-logo.png';
import './header.style.scss';

const HeaderComponent = () => (
    <div className="header">
        <img src={logo} alt="Mata's Tactical Supply" />
    </div>
)

export default HeaderComponent;