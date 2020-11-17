import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setFilterString } from '../../../redux/product-list/product-list.action';
import './filter-input.style.scss';
import { MDBIcon } from 'mdbreact';

const TableFilterInput = ({setFilterString, str,}) => {

    const [filterStr, setFilterStr] = useState( str || "" );
    
    return (
        <div className="table-filter-input">
            <input type="text" placeholder="Search by product name" value={filterStr} onChange={(e)=>setFilterStr(e.target.value)}/>
            <button onClick={()=>setFilterString(filterStr)}><span className="searchSpan">SEARCH</span><MDBIcon icon="search" className="searchBtn"/></button>
        </div>
    )
}

const MapDispatchToProps = dispatch => ({
    setFilterString: str => dispatch(setFilterString(str))
})

export default connect(null, MapDispatchToProps)(TableFilterInput);