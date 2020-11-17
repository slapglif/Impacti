import React from 'react';
import './count-per-page.style.scss';
import { MDBIcon } from 'mdbreact';

const CountPerPage = ({options, showSelectBox, selectOption, optionShow, placeholder,}) => {

    return(
    <div className="count-per-page">
        <div className="form-select" onClick={showSelectBox}>
            <span className="label-span">{placeholder}</span>
            <MDBIcon icon="caret-down"/>
        </div>
        {
            optionShow&&<div className="option-div">
            {
                options.map( option => <div className="option-item" id={option} key={option} onClick={selectOption}>{option}</div>)
            }
        </div>
        }
    </div>
    )
};

export default CountPerPage;