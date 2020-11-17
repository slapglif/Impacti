import React, {useEffect,useState} from 'react';
import './product-page.style.scss';
import { MDBRow, MDBIcon } from 'mdbreact';
import { connect } from 'react-redux';
// for waiting load
import { setLoadAlerts } from '../../redux/alerts/alerts.action';
import { getProducts, addMoreProducts, setOffset } from '../../redux/products/products.action';
import ProductGalleryItem from '../../components/product-gallery-item/product-gallery-item.component';
import { withRouter } from 'react-router';

const ProductPage = withRouter(({location, getProducts, addMoreProducts, items, limit, offset, setOffset, setLoadAlerts}) => {

    const userData = JSON.parse(localStorage.getItem("userData"));

    const [isIconSpin, setIsIconSpin] = useState(false);

    const loadMoreData = async () => {
        if(items.count < (offset + limit))
            return;

        setIsIconSpin(true);    
        
        if (location && location.state && location.state.prodType)
            await addMoreProducts(limit,offset+limit,location.state.prodType);                   
        else
            await addMoreProducts(limit,offset+limit);         
        setOffset(offset+limit);        
        setIsIconSpin(false);
    }

    useEffect(() => {
        setOffset(0);
        
        async function loadData () {
            setLoadAlerts(true);
            if (location && location.state && location.state.prodType)
                await getProducts(limit,0,location.state.prodType);                
            else
                await getProducts(limit,0);
            setLoadAlerts(false);
        }
        loadData();
    }, [location]);
    
    return (
        <div className="product-page">
            {
                userData && location && location.state && location.state.firstName &&
                    <div className="welcome-msg">Welcome,&nbsp;{userData.first_name}!</div>
                   
            }
            <MDBRow>
                {
                   items && items.data && items.data.map( (item,i) => (
                        <ProductGalleryItem key={item.id} i={i} item = {item} />
                    ))
                }
            </MDBRow>

            {
                items && items.data.length > 0 && items.count > (offset + limit) && <div>
                    <div className="load-icon-wrapper">
                        <MDBIcon className={`load-more load-icon ${isIconSpin && 'spin'} `} icon="sync-alt" />
                    </div>
                    <p className="text-center load-more"><span className={`${items.count < (offset + limit) && 'no-need'}`} onClick={() => loadMoreData()}>LOAD MORE</span></p>
                </div>
            }
        </div>        
    )
});

const MapStateToProps = ({products: {items, limit, offset}}) => ({
    items,
    limit,
    offset
})

const MapDispatchToProps = dispatch => ({
    getProducts: getProducts(dispatch),
    addMoreProducts: addMoreProducts(dispatch),
    setOffset: offset => dispatch(setOffset(offset)),
    setLoadAlerts: flag => dispatch(setLoadAlerts(flag))    // for waiting load
})
export default connect(MapStateToProps, MapDispatchToProps)(ProductPage);

