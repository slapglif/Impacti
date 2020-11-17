import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setProductPageNum } from '../../../redux/product-list/product-list.action';
import './pagination.style.scss';

const PageButtons = ({ count, currentIndex, setProductPageNum}) => {
   
    const [countArray, setCountArray] = useState([]);

    useEffect(() => {
        let arrayVal = [];
        if (count === 0)
            setCountArray([]);
        else{
            if (currentIndex === 1){
                for(let i=1; i <=3; i++){
                    if ( i <= count)
                        arrayVal.push(i);
                }
            }
            else if (currentIndex === count){
                for(let i=currentIndex-2; i <=currentIndex; i++){
                    if ( 0 < i && i <= count)
                        arrayVal.push(i);
                }
            }
            else{
                for(let i=currentIndex-1; i <=currentIndex+1; i++){
                    if ( i <= count)
                        arrayVal.push(i);
                }
            }        
            setCountArray(arrayVal);
        }
    }, [currentIndex, count]);
   
    return (
        <div className="page-buttons">
            <div onClick={()=>{            
                    currentIndex - 1 > 0 &&  setProductPageNum(currentIndex - 1)                    
            }}>{"< "}<span className="hiddenSpan">Previous</span></div>            
            {
                countArray&&countArray.map(
                    item => <div 
                                key={item} 
                                className={`${item === currentIndex ? 'current ' : ''}pageNum`} 
                                onClick={()=>{
                                    setProductPageNum(item)
                                }}>
                                {item}
                            </div>
                )
            }           
            <div onClick={()=>{                
                    currentIndex + 1 <= count &&  setProductPageNum(currentIndex + 1)                    
            }}><span className="hiddenSpan">Next</span>{" >"}</div>
        </div>
    )
}

const MapDispatchToProps = dispatch => ({
    setProductPageNum: index => dispatch(setProductPageNum(index))
})

export default connect(null, MapDispatchToProps)(PageButtons);