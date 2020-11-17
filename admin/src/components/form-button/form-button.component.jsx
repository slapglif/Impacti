import React, {Fragment} from 'react';
import './form-button.style.scss';
import {MDBIcon} from 'mdbreact';

const FormButton = ({children, greyCol, isLoading, onClickFunc, ...otherProps}) => {
    return(
        <Fragment>
            <button className={` ${greyCol ? 'greyColor' : ''} form-button font-weight-bold`} {...otherProps} onClick = {onClickFunc}>                
                {
                    isLoading&&<MDBIcon className="loadSubIcon" icon="sync-alt" />
                }
                {children}
            </button>
        </Fragment>
    )
};

export default FormButton;