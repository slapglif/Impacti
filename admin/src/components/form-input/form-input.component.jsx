import React from 'react';
import './form-input.style.scss';

const FormInput = ({ handleChange, label, ...otherProps}) =>  {

    return (
        <div className = 'group'>
            <input className = {`${otherProps.changeEmail ? "red-outline" : ""} form-input`} onChange = {handleChange} {...otherProps} autoFocus = {otherProps.changeEmail} />
            {
            label?
                (
                    <label className = {`${ otherProps.value.length ? 'shrink' : '' } ${otherProps.changeEmail ? "red-label" : ""} form-input-label`}>
                        {label}
                    </label>
                )
                : null
            }
        </div>
    )
}
export default FormInput;