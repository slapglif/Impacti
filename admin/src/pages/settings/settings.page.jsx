import React, {useState, useEffect} from 'react';
import './settings.style.scss';
import FormButton from '../../components/form-button/form-button.component';
import FormInput from '../../components/form-input/form-input.component';
import Switch from 'react-switch';
import { MDBRow, MDBCol } from 'mdbreact';
import HeaderColorChange from './components/headerColor/headerColor.component';
import FooterColorChange from './components/footerColor/footerColor.component';
import FontColorChange from './components/fontColor/fontColor.component';
import { connect } from 'react-redux';
import { updateCurrentFontColors, getCurrentFontColors } from '../../redux/colorChnage/colorChange.action';
import { loadPage } from '../../redux/user/user.action';
import { useAlert } from 'react-alert';

const SettingsPage = ({updateCurrentFontColors, getCurrentFontColors, loadPage}) => {

    const alert = useAlert();

    const [switchSetting, setSwitchSetting] = useState({disableComment: false, hideComment: false, background: false});
    const [socialLinkUrl, setSocialLinkUrl] = useState({facebook: '', instagram: ''});
    const [contactEmail, setContactEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // font color picker
    const [menuFont, setMenuFont] = useState({
        show: false, 
        color: {
          r: 255,
          g: 255,
          b: 255,
          a: 1
        }
    });
    const [footerFont, setFooterFont] = useState({
        show: false, 
        color: {
          r: 255,
          g: 255,
          b: 255,
          a: 1
        }
    });
    const [header1Font, setHeader1Font] = useState({
        show: false, 
        color: {
          r: 255,
          g: 255,
          b: 255,
          a: 1
        }
    });
    const [header2Font, setHeader2Font] = useState({
        show: false, 
        color: {
          r: 255,
          g: 255,
          b: 255,
          a: 1
        }
    });
    const [tableHeaderFont, setTableHeaderFont] = useState({
        show: false, 
        color: {
          r: 255,
          g: 255,
          b: 255,
          a: 1
        }
    });
    const [tableContentFont, setTableContentFont] = useState({
        show: false, 
        color: {
          r: 255,
          g: 255,
          b: 255,
          a: 1
        }
    });
    const [formFont, setFormFont] = useState({
        show: false, 
        color: {
          r: 255,
          g: 255,
          b: 255,
          a: 1
        }
    });
    const [paragraphFont, setParagraphFont] = useState({
        show: false, 
        color: {
          r: 255,
          g: 255,
          b: 255,
          a: 1
        }
    });
    const [specialFont, setSpecialFont] = useState({
        show: false, 
        color: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        }
    }); 

    useEffect(() => {
        async function loadColors() {
            loadPage(true);
            const fontColors = await getCurrentFontColors();
            
            if (fontColors) {
                setMenuFont({...menuFont, color: JSON.parse(fontColors.menu_color)});
                setFooterFont({...footerFont, color: JSON.parse(fontColors.footer_color)});
                setHeader1Font({...header1Font, color: JSON.parse(fontColors.header1_color)});
                setHeader2Font({...header2Font, color: JSON.parse(fontColors.header2_color)});
                setTableHeaderFont({...tableHeaderFont, color: JSON.parse(fontColors.table_header_color)});
                setTableContentFont({...tableContentFont, color: JSON.parse(fontColors.table_content_color)});
                setFormFont({...formFont, color: JSON.parse(fontColors.form_color)});
                setParagraphFont({...paragraphFont, color: JSON.parse(fontColors.paragraph_color)});
                setSpecialFont({...specialFont, color: JSON.parse(fontColors.special_color)});
            }    
            loadPage(false);     
            
        }
        
        loadColors();
        
    }, []);

    const changeFontColors = async () => {
        if (isLoading)
            return;
        
        const colors = {
            menu_color: JSON.stringify(menuFont.color),
            footer_color: JSON.stringify(footerFont.color),
            header1_color: JSON.stringify(header1Font.color),
            header2_color: JSON.stringify(header2Font.color),
            table_header_color: JSON.stringify(tableHeaderFont.color),
            table_content_color: JSON.stringify(tableContentFont.color),
            form_color: JSON.stringify(formFont.color),
            paragraph_color: JSON.stringify(paragraphFont.color),
            special_color: JSON.stringify(specialFont.color)
        }

        setIsLoading(true);
        const result = await updateCurrentFontColors(colors);

        if (result === "success")
            alert.success("Changed successfully");
        else
            alert.error("Failed changing");

        setIsLoading(false);

    }

    return (
        <div className="settings-page">
            <div className="general-setting mb-4">
                <h2 className="text-white font-weight-bold mb-4">General Settings</h2>
                <div className="disable-comment">
                    <div className="content-div mt-4">
                        <h4 className="text-white font-weight-bolder">Disable User Comments</h4>
                        <p className="mb-4 grey-text">The admin can turn off user responses to comments and only allow the admin to respond.</p>
                    </div>
                    <div className="switch-div mt-4">
                        <Switch onColor="#57bd7a" onChange={()=>setSwitchSetting({...switchSetting, disableComment: !switchSetting.disableComment})} checked={switchSetting.disableComment} />
                    </div>
                </div>
                <div className="disable-comment">
                    <div className="content-div mt-4">
                        <h4 className="text-white font-weight-bolder">Hide Comments Completely</h4>
                        <p className="mb-4 grey-text">The admin can turn off the comment system entirely site-wide.</p>
                    </div>
                    <div className="switch-div mt-4">
                        <Switch onColor="#57bd7a" onChange={()=>setSwitchSetting({...switchSetting, hideComment: !switchSetting.hideComment})} checked={switchSetting.hideComment} />
                    </div>
                </div>

                <h4 className="text-white font-weight-bolder mt-4">Terms and Conditions Management</h4>
                <p className="grey-text mb-4">The admin can update the terms and conditions here by pasting or typing into a text box the terms and conditions.</p>
                <textarea className="mb-4" name="terms_conditions" rows="7" placeholder="Type here..."></textarea>
                <div className="btn-200">
                    <FormButton>UPDATE</FormButton>
                </div>
            </div>

            <div className="general-setting">
                <h2 className="text-white font-weight-bold mb-4">Advance Settings</h2>
                <hr/>
                <h4 className="text-white font-weight-bolder mt-4">Social Media Links</h4>
                <p className="grey-text mb-4">The admin should be able to set a Facebook and an Instagram link for the social media icons in the footer of the customer facing site.</p>
                <MDBRow>
                    <MDBCol size="12" sm="6" md="6" lg="5">
                        <FormInput type="text" name = "facebook_link" label="Add Facebook Link" value = {socialLinkUrl.facebook} handleChange = {(event) => setSocialLinkUrl({...socialLinkUrl, facebook: event.target.value})} />
                    </MDBCol>
                    <MDBCol size="12" sm="6" md="6" lg="5">
                        <FormInput type="text" name = "instagram_link" label="Add Instagram Link" value = {socialLinkUrl.instagram} handleChange = {(event) => setSocialLinkUrl({...socialLinkUrl, instagram: event.target.value})} />
                    </MDBCol>
                    <MDBCol size="12" sm="6" md="6" lg="2">
                        <FormButton>SAVE</FormButton>
                    </MDBCol>
                </MDBRow>

                <hr className="mt-4"/>

                <h4 className="text-white font-weight-bolder mt-4">Contact Us Page</h4>
                <p className="grey-text mb-4">The admin can change the text on the contact us page, and specify what emails the contact form goes to.</p>
                <textarea className="mb-4 no-back" name="contact_us" rows="5"></textarea>
                <MDBRow>
                    <MDBCol size="12" sm="6" md="6" lg="6">
                        <FormInput type="email" name = "contact_address" label="Email Address going to" value = {contactEmail} handleChange = {(event) => setContactEmail(event.target.value)} />
                    </MDBCol>
                </MDBRow>
                <MDBRow className="mt-4">
                    <MDBCol size="12" sm="6" md="4" lg="2">
                        <FormButton>SAVE</FormButton>
                    </MDBCol>
                </MDBRow>

                <hr className="mt-4"/>
                <HeaderColorChange/>

                <hr className="mt-4"/>
                <FooterColorChange />

                <hr className="mt-4"/>
                <h4 className="text-white font-weight-bolder mt-4">Change Font Color</h4>
                <p className="grey-text mb-4">The admin can change the font color of titles, paragraphs and other texts.</p>

                <div className="fontColorWrapper">
                    <FontColorChange purpose="Menu" colorPicker={menuFont} setColorPicker={setMenuFont}/>
                    <FontColorChange purpose="Footer" colorPicker={footerFont} setColorPicker={setFooterFont}/>
                    <FontColorChange purpose="Header1" colorPicker={header1Font} setColorPicker={setHeader1Font}/>
                    <FontColorChange purpose="Header2" colorPicker={header2Font} setColorPicker={setHeader2Font}/>
                    <FontColorChange purpose="Table Header" colorPicker={tableHeaderFont} setColorPicker={setTableHeaderFont}/>
                    <FontColorChange purpose="Table Content" colorPicker={tableContentFont} setColorPicker={setTableContentFont}/>
                    <FontColorChange purpose="Form" colorPicker={formFont} setColorPicker={setFormFont}/>
                    <FontColorChange purpose="Paragraph" colorPicker={paragraphFont} setColorPicker={setParagraphFont}/>
                    <FontColorChange purpose="Special" colorPicker={specialFont} setColorPicker={setSpecialFont}/>
                </div>
                <div className="fontColorChangeBtn mt-3">
                    <FormButton onClickFunc={()=>changeFontColors()} isLoading={isLoading}>CHANGE COLOR</FormButton>
                </div>
                
            </div>
        </div>
    )
}

const MapDispatchToProps = dispatch => ({
    updateCurrentFontColors: updateCurrentFontColors(dispatch),
    getCurrentFontColors: getCurrentFontColors(dispatch),
    loadPage: flag => dispatch(loadPage(flag))
})

export default connect(null, MapDispatchToProps)(SettingsPage);