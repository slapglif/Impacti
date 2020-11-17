import React, {useEffect, useRef} from 'react';
import './product-detail.style.scss';
import { MDBRow, MDBCol } from 'mdbreact';
import FormButton from '../../components/form-button/form-button.component';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
// for waiting load
import { setLoadAlerts } from '../../redux/alerts/alerts.action';
import { getCurrentProdItem, getCurrentComments, addCommentsFunc } from '../../redux/product-detail/product-detail.action';
import { getCurrentUser } from '../../redux/user/user.action';
import CommentsComponent from '../../components/comments/comments.component';
import { useState } from 'react';
import { withRouter } from 'react-router';
import { useAlert } from 'react-alert';

const ProdcutDetailPage = withRouter(({ match, getCurrentProdItem, getCurrentComments, addCommentsFunc, prodItem, prodComments, setLoadAlerts, getCurrentUser, currentFontColors}) => {

    const alert = useAlert();
    const userData = JSON.parse(localStorage.getItem("userData"));
    const historyUrl = useHistory();

    const prodID = match.params.id;
    const prodType = match.params.prodType;

    useEffect(() => {
        async function loadData() {
            setLoadAlerts(true);
            await getCurrentProdItem(prodID, prodType);
            await getCurrentComments(prodID);
            setLoadAlerts(false);
        }
        loadData();
    }, []);

    const [ownComment, setOwnComment] = useState();
    const textareaRef = useRef(null);
    useEffect(() => {
        textareaRef.current.style.height = "0px";
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = scrollHeight + "px";
    }, [ownComment]);

    const [fontColors, setFontColors] = useState({header1: "white", header2: "white", paragraph: "#a3a3a3", form: "#a3a3a3"});
    useEffect(() => {
        if (currentFontColors) {
            const header1color = JSON.parse(currentFontColors.header1_color);
            const header2color = JSON.parse(currentFontColors.header2_color);
            const paragraphcolor = JSON.parse(currentFontColors.paragraph_color);
            const formcolor = JSON.parse(currentFontColors.form_color);
            setFontColors({
                header1: `rgba(${header1color.r }, ${header1color.g }, ${header1color.b }, ${header1color.a })`,
                header2: `rgba(${header2color.r }, ${header2color.g }, ${header2color.b }, ${header2color.a })`,
                paragraph: `rgba(${paragraphcolor.r }, ${paragraphcolor.g }, ${paragraphcolor.b }, ${paragraphcolor.a })`,
                form: `rgba(${formcolor.r }, ${formcolor.g }, ${formcolor.b }, ${formcolor.a })`
            })

        }
    }, [currentFontColors]);
    
    const leaveCommentFunc = async () => {
        if(!ownComment || (ownComment.trim() === "")){
            return;
        }
        if(userData){
            setLoadAlerts(true);
            const user_comment = await getCurrentUser({email: userData.email},"fromDB");
            if(user_comment.comment_banned){
                setLoadAlerts(false);
                setOwnComment("");
                alert.error("You have been banned from commenting.");
                return;
            }
            else {
                
                const obj = {
                    user_id: userData.id,
                    product_id: prodID,
                    parent_id: "",
                    comment_content: ownComment,
                    product_type: prodType
                }
                
                await addCommentsFunc(obj);
                await getCurrentComments(prodID);
                setOwnComment("");
                setLoadAlerts(false);
            }           
        }       
    }
    return (
        <div className="product-detail-page">
            {
                prodItem && <MDBRow>
                <MDBCol size="12" sm="12" md="6" lg="6">
                    <img src={process.env.PUBLIC_URL + "/product_images/detail.png"} alt={prodType === 'webinar' ? prodItem.name : prodItem.productName} className="detail-img"/>
                </MDBCol>
                <MDBCol size="12" sm="12" md="6" lg="6" className="description-container">
                    <h1 className="mb-4" style={{color: fontColors.header1}}>{prodType === 'webinar' ? prodItem.name : prodItem.productName}</h1>
                    <p style={{color: fontColors.header2}}>Description:</p>
                    <div>
                        <p className="mb-4" style={{color: fontColors.paragraph}}>{prodItem.shortDescription && prodItem.shortDescription}</p>
                    </div>                    
                    {/* <p className="mt-2">
                        <img src={process.env.PUBLIC_URL + "/red-check.ico"} alt="" />
                        Lorem ipsum dolor sit amet</p>
                    <p className="mt-2">
                        <img src={process.env.PUBLIC_URL + "/red-check.ico"} alt="" />
                        consectetur</p>
                    <p className="mt-2">
                        <img src={process.env.PUBLIC_URL + "/red-check.ico"} alt="" />
                        adipiscing elit</p> */}
                    <p className="mb-4 mt-2" style={{color: fontColors.paragraph}}>
                        <span style={{color: fontColors.header2}}>Price: </span>
                        <span style={{color: fontColors.header2}}>{`$${prodType === "webinar" ? prodItem.price_per_seats : prodItem.pricePerItem}.00 `}</span>
                        each | <span style={{color: fontColors.header2}}>{`${prodType === "webinar" ? prodItem.remainingSeats : prodItem.amount} `}</span>
                        {`${prodType === "webinar" ? 'seats remaining' : 'left in stock'}`}</p>
                    <div>
                        <FormButton onClickFunc = {() => prodType === "webinar" ? historyUrl.push(`/purchase_seats/${prodItem.id}`) : historyUrl.push(`/buy_physical/${prodItem.id}`)}>{prodType === "webinar" ? 'PURCHASE SEAT' : 'BUY NOW'}</FormButton>
                    </div>
                </MDBCol>
            </MDBRow>
            }
            <MDBRow className="mb-4 t100">
                <MDBCol size="12" sm="12" md="8" lg="6">
                    <h1 style={{color: fontColors.header1}}>READ {"&"} WRITE COMMENTS</h1>
                </MDBCol>
                <MDBCol middle size="12" sm="12" md="4" lg="6" className="text-right">
                    <p style={{color: fontColors.paragraph}}>{prodComments && prodComments.length} Comments</p>
                </MDBCol>
            </MDBRow>
            <textarea 
                ref={textareaRef} 
                placeholder="Leave a Comment" 
                className="mb-3" 
                rows={1}
                value={ownComment} 
                onChange={(e) => setOwnComment(e.target.value)} 
                required
                style={{color: fontColors.form}}/>
            <div className="post-btn">
                <FormButton onClickFunc={leaveCommentFunc}>POST COMMENT</FormButton>
            </div>

            <hr className="split-hr"/>

            {
                prodComments ? prodComments.map(
                    (comment, i) => <CommentsComponent prodID = {prodID} key={i} comment={comment} i={i} prodComment={true}/>                    
                )
                :
                <h4 className="text-center mb-4" style={{color: fontColors.header2}}>No comments</h4>
            }             
        </div>
    )
});

const MapStateToProps = ({product_detail: { prodItem, prodComments }, colors: {currentFontColors}}) => ({
    prodItem,
    prodComments,
    currentFontColors
})

const MapDispatchToProps = dispatch => ({
    getCurrentProdItem: getCurrentProdItem(dispatch),
    getCurrentComments: getCurrentComments(dispatch),
    addCommentsFunc: addCommentsFunc(dispatch),
    getCurrentUser: getCurrentUser(dispatch),
    setLoadAlerts: flag => dispatch(setLoadAlerts(flag))    // for waiting load
})

export default connect(MapStateToProps, MapDispatchToProps)(ProdcutDetailPage);