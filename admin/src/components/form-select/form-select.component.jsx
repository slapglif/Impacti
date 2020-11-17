import React from 'react';
import './form-select.style.scss';
import { MDBIcon } from 'mdbreact';

const FormSelect = ({options, label, showSelectBox, selectOption, optionShow, placeholder, forPayment, isInvalid}) => {

    return(
    <div className={`form-select-container ${forPayment === true && 'forPayment'}`}>
        <div className={`form-select ${forPayment === true && 'forPayment'}  ${isInvalid === true && 'red-outline'}`} onClick={showSelectBox}>
            <span className="label-span">{placeholder}</span>
            <MDBIcon icon="chevron-down" className="select-down-icon" />
        </div>
        {
            optionShow&&<div className="option-div">
                {
                    options.map( option => <div className="option-item" id={option} key={option} onClick={selectOption}>{option}</div>)
                }
            </div>
        }
        {
           label?
            (
                <label className = {`${ placeholder === "" ? "" : 'shrink'} form-input-label`}>
                    {label}
                </label>
            )
            : null
        }
    </div>
    )
};

export default FormSelect;