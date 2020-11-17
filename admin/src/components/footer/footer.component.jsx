import React from 'react';
import { Link } from 'react-router-dom';
import './footer.style.scss';

const FooterComponent = () => (
    <div className="footer">
        <Link to='/' className='grey-text'>&copy;<span>copyright </span>{new Date().getFullYear()}matas</Link>
    </div>
)

export default FooterComponent;