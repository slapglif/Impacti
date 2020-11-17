import React, { useState, useEffect, useRef } from 'react';
import { Auth, Storage } from 'aws-amplify';
import { connect } from 'react-redux';
import { updateCurrentUser } from '../../redux/user/user.action';
import FormInput from '../../components/form-input/form-input.component';
import FormButton from '../../components/form-button/form-button.component';
import FormSelect from '../../components/form-select/form-select.component';
import Input from 'react-phone-number-input/input';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { MDBIcon } from 'mdbreact';
import NotificationSelect from '../../components/notification-select/notification-select.component';
import './myaccount-page.style.scss';
import VerifyCodeInput from '../../components/verify-code-input/verify-code-input.component';
import Autocomplete from 'react-google-autocomplete';
import { useAlert } from 'react-alert';

const MyAccountPage = ({ updateCurrentUser, currentFontColors }) => {

    const [fontColors, setFontColors] = useState({
        header1: "white",
        header2: "white",
        form: "#a3a3a3",
        paragraph: "#a3a3a3"
    });
    useEffect(() => {
        if (currentFontColors) {
            const h1Color = JSON.parse(currentFontColors.header1_color);
            const h2Color = JSON.parse(currentFontColors.header2_color);
            const form = JSON.parse(currentFontColors.form_color);
            const pColor = JSON.parse(currentFontColors.paragraph_color);

            setFontColors({
                header1: `rgba(${h1Color.r }, ${h1Color.g }, ${h1Color.b }, ${h1Color.a })`,
                header2: `rgba(${h2Color.r }, ${h2Color.g }, ${h2Color.b }, ${h2Color.a })`,
                form: `rgba(${form.r }, ${form.g }, ${form.b }, ${form.a })`,
                paragraph: `rgba(${pColor.r }, ${pColor.g }, ${pColor.b }, ${pColor.a })`
            })

        }
    }, [currentFontColors]);
    
    const alert = useAlert();

    const userData = JSON.parse(localStorage.getItem("userData"));

    const [profilePicURL, setProfilePicURL] = useState();

    useEffect(() => {        
        async function fetchData() {
            setProfilePicURL(await Storage.get(userData.profile_picture));
        }
        if(userData.profile_picture)
              fetchData();                                 
    }, []);

    const [credential, setCredential] = useState({
        username: userData ? userData.username : '',
        email: userData ? userData.email : '',
        firstname: userData ? userData.first_name : '',
        lastname: userData ? userData.last_name : '',
        address: userData ? userData.address : '',
        confirmcode: '',
        isVerified: userData ? userData.is_verified : false
    });


    const [phone, setPhone] = useState( userData ? userData.phone_number : null);

    const [isLoading, setIsLoading] = useState(false);

    //For resend code
    const [isResend, setIsResend] = useState(false);

    // For email change

    const [codeSent, setCodeSent] = useState({ email: false, phone: false });
    const [verifyMethod, setVerifyMethod] = useState(userData.verified_method);
    const [isEmailVerified, setIsEmailVerified] = useState(userData.is_email_verified || false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(userData.is_phone_verified || false);
    const [changeEmail, setChangeEmail] = useState(false);
    const [changePhone, setChangePhone] = useState(false);
    const [isValidPhone, setIsValidPhone] = useState(false);

    useEffect(() => {
       
        async function update() {
            await finalUpdate(false, "email");
        }
        update();   
    }, [isEmailVerified]);

    useEffect(() => {

        async function update() {
            await finalUpdate(false, "phone");
        }
        update();   
    }, [isPhoneVerified]);

    // For notification
    let isProd = false, isWebinar = false, isProdPhone = false, isProdEmail = false, isWebinarPhone = false, isWebinarEmail = false;

    if (userData.notify_products === "none")
        isProd = false;
    else {
        isProd = true;
        if (userData.notify_products.includes("email"))
            isProdEmail = true;
        if (userData.notify_products.includes("phone"))
            isProdPhone = true;
    }

    if (userData.notify_webinar === "none")
        isWebinar = false;
    else {
        isWebinar = true;
        if (userData.notify_webinar.includes("email"))
            isWebinarEmail = true;
        if (userData.notify_webinar.includes("phone"))
            isWebinarPhone = true;
    }

    const [notification, setNotification] = useState({ product: isProd, webinar: isWebinar });
    const [prodNot, setProdNot] = useState({ phone: isProdPhone, email: isProdEmail });
    const [webinarNot, setWebinarNot] = useState({ phone: isWebinarPhone, email: isWebinarEmail });

    //For selecting verification methods 
    const selectOptions = ["Reverify", "Change"];
    const [optionShow, setOptionShow] = useState(false);
    const [placeholder, setPlaceholder] = useState("Reverify");

    // For upload image crop

    const [upImg, setUpImg] = useState();
    const [imgRef, setImgRef] = useState(null);
    const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 9 / 9 });
    const [previewUrl, setPreviewUrl] = useState();
    const [isShow, setIsShow] = useState(false);

    const uploadFile = useRef(null);
    const fileInputLink = React.createRef();

    // for phone validataion
    const validatePhoneNumber = (num) => {
        var phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        return phoneNumberPattern.test(num);
    }

    const onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () => setUpImg(reader.result));
            reader.readAsDataURL(e.target.files[0]);
        }
        setIsShow(true);
    };

    const onLoad = img => {
        setImgRef(img);
    };

    const makeClientCrop = async crop => {
        if (imgRef && crop.width && crop.height) {
            createCropPreview(imgRef, crop, "profile.jpeg");
        }
    };

    const createCropPreview = async (image, crop, fileName) => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        const reader = new FileReader()
        canvas.toBlob(blob => {
            reader.readAsDataURL(blob)
            reader.onloadend = () => {
                let arr = reader.result.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);

                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                uploadFile.current = new File([u8arr], "profile-" + userData.id + "-pic.jpg", { type: mime });
            }
        })
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    reject(new Error("Canvas is empty"));
                    return;
                }
                blob.name = fileName;
                window.URL.revokeObjectURL(previewUrl);

                setPreviewUrl(window.URL.createObjectURL(blob));

            }, "image/jpeg");
        });
    };

    const s3Upload = async (file) => {
        console.log("FIle===", file);
        const stored = await Storage.put(file.name, file, {
            contentType: file.type,
            cacheControl: 'max-age=31536000'
        });

        return stored.key;
    }

    const emailVerifyFunc = async () => {

        try {
            const user = await Auth.currentAuthenticatedUser();
          
            await Auth.updateUserAttributes(user, { email: credential.email });

            if(isEmailVerified)
                setIsEmailVerified(false)
            else
                await finalUpdate(false, "email");

            setIsLoading(false);
            setCodeSent({ phone: false, email: true });           
            
        } catch (error) {
            console.log(error);
            alert.error(error.message);
            setIsLoading(false);
        }
    }

    const phoneVerifyFunc = async () => {

        setIsLoading(true);

        try {
            const user = await Auth.currentAuthenticatedUser();
            await Auth.updateUserAttributes(user, { phone_number: phone });

            if(isPhoneVerified) 
                setIsPhoneVerified(false);        
            else
                await finalUpdate(false, "phone");

            setIsLoading(false);
            setCodeSent({ email: false, phone: true });          
              
        } catch (error) {
            alert.error(error.message);
            setIsLoading(false);
        }
    }

    const finalUpdate = async (verifiedVal, emailOrPhone) => {
              
        if( isEmailVerified && isPhoneVerified )
            verifiedVal = true;

        try {
            const attachment = uploadFile.current ? await s3Upload(uploadFile.current) : userData.profile_picture;
            console.log(attachment);
                     
            // for notification for prods and webinar
            let notify_product_val = "";
            let notify_webinar_val = "";

            if (notification.product) {
                if (prodNot.phone && prodNot.email)
                    notify_product_val = "email and phone";
                else if (prodNot.phone && !prodNot.email)
                    notify_product_val = "phone";
                else if (!prodNot.phone && prodNot.email)
                    notify_product_val = "email";
                else
                    notify_product_val = "none";
            }
            else
                notify_product_val = "none";

            if (notification.webinar) {
                if (webinarNot.phone && webinarNot.email)
                    notify_webinar_val = "email and phone";
                else if (webinarNot.phone && !webinarNot.email)
                    notify_webinar_val = "phone";
                else if (!webinarNot.phone && webinarNot.email)
                    notify_webinar_val = "email";
                else
                    notify_webinar_val = "none";
            }
            else
                notify_webinar_val = "none";
            emailOrPhone === "both" ?
                updateCurrentUser({
                    id: userData.id,
                    username: credential.username,
                    first_name: credential.firstname,
                    last_name: credential.lastname,
                    address: credential.address,
                    email: credential.email,
                    phone_number: phone,
                    profile_picture: attachment,
                    notify_products: notify_product_val,
                    notify_webinar: notify_webinar_val,
                    verified_method: verifyMethod,
                    is_verified: verifiedVal,
                    is_email_verified: isEmailVerified,
                    is_phone_verified: isPhoneVerified

                })
                :
                emailOrPhone === "email" ? 
                    updateCurrentUser({
                        id: userData.id,
                        username: credential.username,
                        first_name: credential.firstname,
                        last_name: credential.lastname,
                        address: credential.address,
                        email: credential.email,
                        profile_picture: attachment,
                        notify_products: notify_product_val,
                        notify_webinar: notify_webinar_val,
                        verified_method: verifyMethod,
                        is_verified: verifiedVal,
                        is_email_verified: isEmailVerified,
                        is_phone_verified: isPhoneVerified

                    })
                    :
                    updateCurrentUser({
                        id: userData.id,
                        username: credential.username,
                        first_name: credential.firstname,
                        last_name: credential.lastname,
                        address: credential.address,
                        phone_number: phone,
                        profile_picture: attachment,
                        notify_products: notify_product_val,
                        notify_webinar: notify_webinar_val,
                        verified_method: verifyMethod,
                        is_verified: verifiedVal,
                        is_email_verified: isEmailVerified,
                        is_phone_verified: isPhoneVerified

                    })


            setIsLoading(false);
            // const attachmentURL = await Storage.vault.get(attachment);

        } catch (e) {
            console.log(e);
            setIsLoading(false);
        }
    }
    
    const handleSubmit = async (event) => {
        
        event.preventDefault();
        setIsValidPhone(false);
        setChangePhone(false);

        if(isLoading)
            return;
        
        if( ( phone.trim() === "" ) || !validatePhoneNumber(phone.slice(2))) {
            setIsValidPhone(true);
            return;
        }

        if (uploadFile.current && uploadFile.current.size > 5000000) {
            alert.error("Please pick a file smaller than 5 MB.");
            return;
        }

        // if (credential.email !== userData.email) {
        //     emailVerifyFunc();
        // }
        if (phone !== userData.phone_number) {
            phoneVerifyFunc();
        }
        else{
            finalUpdate(false, "both");
            alert.success("Updated successfully");
        }                  
    }

    const handleConfirmSubmit = async (event) => {
        event.preventDefault();

        if(isLoading)
            return;

        setIsLoading(true);

        try {
            await Auth.verifyCurrentUserAttributeSubmit("email", credential.confirmcode);
            setIsEmailVerified(true);
            setChangeEmail(false);
            if (phone !== userData.phone_number)
                phoneVerifyFunc(); ////////////////////////
            else
                setCodeSent({ phone: false, email: false });
            setCredential({...credential, isVerified: true});
            setIsLoading(false);

        } catch (error) {
            alert.error(error.message);
            setIsLoading(false);
        }
    }

    const handlePhoneConfirmSubmit = async (event) => {
        event.preventDefault();
        if(isLoading)
            return;

        setIsLoading(true);

        try {
            await Auth.verifyCurrentUserAttributeSubmit("phone_number", credential.confirmcode);
            setIsPhoneVerified(true);
            setChangePhone(false);
            setCodeSent({ email: false, phone: false });
            setIsLoading(false);            
        } catch (error) {
            alert.error(error.message);
            setIsLoading(false);
        }
    }

    const resendCode = async (phonenumber = false) => {
        if(isLoading)
            return;
        setIsResend(true);
        try {
            phonenumber ? 
                await Auth.verifyCurrentUserAttribute("phone_number")
                : 
                await Auth.verifyCurrentUserAttribute("email")
            setIsResend(false);
        } catch (error) {
            alert.error(error.message);
            setIsResend(false);
        }
    }

    const handleReverifiedSubmit = async (event) => {

        event.preventDefault();
        setIsLoading(true);
        
        if(placeholder === "Reverify"){
            try {
                await Auth.verifyCurrentUserAttribute("email");
    
                setIsLoading(false);
                setCredential({...credential, isVerified: true});
                setCodeSent({ phone: false, email: true });
                
            } catch (error) {
                alert.error(error.message);
                setIsLoading(false);
            } 
        }
        else{
            setChangeEmail(true);
            setIsLoading(false);
            setCredential({...credential, isVerified: true});
            setCodeSent({ phone: false, email: false });
        }
         
    }

    const handleReverifiedPhoneSubmit = async (event) => {

        event.preventDefault();
        setIsLoading(true);
        if(placeholder === "Reverify"){
            try {
                await Auth.verifyCurrentUserAttribute("phone_number");

                setIsLoading(false);
                setCredential({...credential, isVerified: true});
                setCodeSent({ email: false, phone: true });
                
            } catch (error) {
                alert.error(error.message);
                setIsLoading(false);
            } 
        }
        else{
            setChangePhone(true);
            setIsLoading(false);
            setCredential({...credential, isVerified: true});
            setCodeSent({ phone: false, email: false });
        }                    
    }

    const renderForm = () => (
        <div className='profile-form'>
            <form onSubmit={handleSubmit}>
                <h2 className='text-center font-weight-bold mb-4' style={{color: fontColors.header1}}>My Profile</h2>
                <div className='photo-div'>
                    {
                        previewUrl && <img className='photo-img' alt={credential.username} src={previewUrl} />
                    }
                    {
                        !previewUrl && profilePicURL && <img className='photo-img' alt={credential.username} src={profilePicURL} />
                    }
                    {
                        !(previewUrl || profilePicURL) && <div className='non-photo-img' onClick={() => fileInputLink.current.click()}>
                            <MDBIcon icon="camera" />
                        </div>
                    }
                </div>
                <div className="upload-text-wrapper">
                    <span className='text-center mt-2 upload-text' onClick={() => fileInputLink.current.click()} style={{color: fontColors.header2}}><MDBIcon icon="pencil-alt" className='mr-2' />Edit Picture</span>
                </div>

                <div>
                    <input type="file" accept="image/*" id='hidden-input-field' onChange={onSelectFile} ref={fileInputLink} />
                </div>
                {
                    isShow && <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div id='crop-container' className="mt-2">
                            <ReactCrop
                                className='crop-div'
                                src={upImg}
                                onImageLoaded={onLoad}
                                crop={crop}
                                onChange={c => setCrop(c)}
                                onComplete={makeClientCrop}
                            />
                            <button id='crop-btn' onClick={() => setIsShow(false)}>Done</button>
                        </div>
                    </div>
                }
                <FormInput type="text" name='username' label='Username*' value={credential.username} handleChange={(event) => setCredential({ ...credential, username: event.target.value })} autocomplete="name" required />
                <FormInput type="text" name='firstname' label='First Name*' value={credential.firstname} handleChange={(event) => setCredential({ ...credential, firstname: event.target.value })} autocomplete="name" required />
                <FormInput type="text" name='lastname' label='Last Name*' value={credential.lastname} handleChange={(event) => setCredential({ ...credential, lastname: event.target.value })} autocomplete="name" required />
                <div className="phone-group">
                    <Autocomplete
                        className="phone-input"
                        placeholder=""
                        value = {credential.address}
                        onChange = {(e)=> setCredential({...credential, address: e.target.value})}
                        onPlaceSelected={(place) => {
                            setCredential({...credential, address: place.formatted_address})
                        }}
                        types={['address']}
                        componentRestrictions={{country: "us"}}
                        style={{color: fontColors.form}}
                        required
                    />
                     <label className = {`${credential.address ? 'shrink' : ''} phone-input-label`}>Address*</label>
                </div>
                <FormInput type="email" name='email' label='Email*' value={credential.email} handleChange={(event) => setCredential({ ...credential, email: event.target.value })} isDisabled={true} changeEmail={changeEmail} disabled />
                {/* {
                    changeEmail && <p className="text-danger changeP">Please change current email.</p>
                } */}
                <div className='phone-group'>
                    <Input
                        className={`${changePhone || isValidPhone ? 'red-outline' : ''} phone-input`}
                        country="US"
                        value={phone}
                        onChange={setPhone}
                        autocomplete="tel"
                        autoFocus = {changePhone}
                        style={{color: fontColors.form}}/>
                    <label className={`${phone ? 'shrink' : ''} ${changePhone || isValidPhone ? 'red-label' : ''} phone-input-label`}>Phone Number*</label>
                    {
                        changePhone && <p className="text-danger changeP">Please change current phone number.</p>
                    }
                    {
                        isValidPhone && <p className="text-danger changeP">Invalid phone number.</p>
                    }
                </div>
                <NotificationSelect title="Notifications for new products" notif={notification.product} handleChange={() => {
                    setNotification({ ...notification, product: !notification.product });
                    setProdNot({ phone: false, email: false });
                }} emailNotif={prodNot.email} emailNotifChange={() => setProdNot({ ...prodNot, email: !prodNot.email })} phoneNotif={prodNot.phone} phoneNotifChange={() => setProdNot({ ...prodNot, phone: !prodNot.phone })} />
                <NotificationSelect title="Notifications for live webinars" notif={notification.webinar} handleChange={() => {
                    setNotification({ ...notification, webinar: !notification.webinar });
                    setWebinarNot({ phone: false, email: false });
                }} emailNotif={webinarNot.email} emailNotifChange={() => setWebinarNot({ ...webinarNot, email: !webinarNot.email })} phoneNotif={webinarNot.phone} phoneNotifChange={() => setWebinarNot({ ...webinarNot, phone: !webinarNot.phone })} />
                <FormButton type="submit" isLoading={isLoading}>SAVE NOW</FormButton>
            </form>
        </div>
    )

    const renderVerificationForm = (phonenumber = false) => (
        <div className='profile-form confirm'>
            <VerifyCodeInput
                handleConfirmSubmit={ phonenumber ? handlePhoneConfirmSubmit : handleConfirmSubmit}
                email_or_phone={ phonenumber ? "Phone" : "Email"}
                phone={phone}
                credential={credential}
                setCredential={setCredential}
                resendCode={() => resendCode(phonenumber)} 
                isResend={isResend}
                isShowResend={true}
                isLoading={isLoading} />
        </div>
    )

    const renderReverifyForm = () => (
        <div className='profile-form unverified-form'>
            <form onSubmit={ 
                !isPhoneVerified ? handleReverifiedPhoneSubmit: handleReverifiedSubmit 
            }>
                <div className="icon-div">
                    <MDBIcon far icon="times-circle" className="unverified-icon"/>
                </div>
                <h2 className='text-center' style={{color: fontColors.header1}}>You are not verified!</h2>
                <p className="text-center font-weight-bolder" style={{color: fontColors.paragraph}}>You should reverify or change your { !isPhoneVerified ? "Phone" : "Email"} <span>({ !isPhoneVerified ? phone : credential.email})</span> again.</p>
                <FormSelect options={selectOptions} label={placeholder === "Reverify" ? !isPhoneVerified ? "Reverify your phone" : "Reverify your email" : !isPhoneVerified ? "Change your phone" : "Change your email" } showSelectBox={()=>setOptionShow(!optionShow)} selectOption={(event)=>{
                    setOptionShow(false);
                    setPlaceholder(event.target.id);
                }} optionShow={optionShow} placeholder={placeholder}/>
                <FormButton type="submit" isLoading={isLoading}>NEXT</FormButton>
            </form>
        </div>
    )

    return (
        <div className='myaccount-page'>
            
            {
                codeSent.email && renderVerificationForm()
            }
            {
                codeSent.phone && renderVerificationForm(true)
            }
            {
                !credential.isVerified && renderReverifyForm()
            }
            {
                !(codeSent.email || codeSent.phone || !credential.isVerified) && renderForm()
            }
        </div>
    );
}

const MapStateToProps = ({colors: {currentFontColors}}) => ({
    currentFontColors
})

const MapDispatchToProps = dispatch => ({
    updateCurrentUser: updateCurrentUser(dispatch)
})
export default connect(MapStateToProps, MapDispatchToProps)(MyAccountPage);