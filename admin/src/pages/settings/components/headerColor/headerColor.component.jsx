import React, {useState} from 'react';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';

const HeaderColorChange = () => {

    const [colorPicker, setColorPicker] = useState({
        show: false, 
        color: 'linear-gradient(90deg, rgba(50,120,228,1) 0%, rgba(86,209,36,1) 32%, rgba(253,29,29,1) 67%, rgba(242,252,69,1) 100%)'
    });
    
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
            marginTop: '-370px',
            marginLeft: '220px',
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
        <div>
            <h4 className="text-white font-weight-bolder mt-4">Change Header Color</h4>
            <p className="grey-text mb-4">The admin can change header color of consumer site.</p>
            <button className="color-btn c1 actived"></button>
            <button className="color-btn c2"></button>
            <button className="color-btn c3"></button>
            <button className="color-btn c4"></button>
            <button className="color-btn c5"></button>
            <button className="color-btn c6" style={
                {background: `rgba(${colorPicker.color.r }, ${colorPicker.color.g }, ${colorPicker.color.b }, ${colorPicker.color.a })`}
                } onClick={()=> {
                    console.log(colorPicker.color);
                    setColorPicker({...colorPicker, show: !colorPicker.show});
                }}></button>
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

export default HeaderColorChange;