import React, {useState} from 'react';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';
import './fontColor.style.scss';

const FontColorChange = ({purpose, colorPicker, setColorPicker}) => {
    
    const styles = reactCSS({
        'default': {
          color: {
            width: '36px',
            height: '14px',
            borderRadius: '2px',
            background: `rgba(${colorPicker.color.r }, ${colorPicker.color.g }, ${colorPicker.color.b }, ${colorPicker.color.a })`
          },
          swatch: {
            padding: '5px',
            background: '#fff',
            borderRadius: '1px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
            display: 'none',
            cursor: 'pointer',
          },
          popover: {
            position: 'absolute',
            marginTop: '-340px',
            marginLeft: '-140px',
            zIndex: '2',
          },
          cover: {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
          },
        },
    });

    return (
        <div className="fontWrapper">            
            <button className="color-btn" style={
                { background: `rgba(${colorPicker.color.r }, ${colorPicker.color.g }, ${colorPicker.color.b }, ${colorPicker.color.a })`}
                } onClick={()=> {
                    setColorPicker({...colorPicker, show: !colorPicker.show});
                }}></button>
              <label htmlFor="fontBtn" style={
                { color: `rgba(${colorPicker.color.r }, ${colorPicker.color.g }, ${colorPicker.color.b }, ${colorPicker.color.a })`}
            }>{purpose}</label>
            <div>
                <div style={ styles.swatch } onClick={()=>setColorPicker({...colorPicker, show: !colorPicker.show})}>
                    <div style={ styles.color } />
                </div>
                { colorPicker.show ? <div style={ styles.popover }>
                <div style={ styles.cover } onClick={ ()=> setColorPicker({...colorPicker, show: false}) }/>
                <SketchPicker color={ colorPicker.color } onChange={ col => setColorPicker({...colorPicker, color: col.rgb}) } />
                </div> : null }

            </div>
        </div>
    )
}

export default FontColorChange;