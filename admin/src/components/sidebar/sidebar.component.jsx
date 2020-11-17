import React, { useState, useEffect } from 'react';
import './sidebar.style.scss';
import { MDBIcon } from 'mdbreact';
import { useHistory } from 'react-router-dom';

const SideBar = () => {

    const urlHistory = useHistory();    

    const [subMenuShow, setSubMenuShow] = useState(false);
    const [subProdShow, setSubProdShow] = useState(false);
    const [menuActive, setMenuActive] = useState({dashboard: true, product: false, user: false, faq: false, setting: false});
    const [subMenuActive, setSubMenuActive] = useState({categories: false, products: false, sold_webinars: false, ffl_db: false, completed_webinars: false, sold_physical: false });
    const [subProdActive, setSubProdActive] = useState({prod: false, webinar: false});

    useEffect(() => {
        if (urlHistory.location.pathname.indexOf("/product/") > -1) {
            setMenuActive({dashboard: false, product: true, user: false, faq: false, setting: false});
            setSubMenuShow(true);
            if (urlHistory.location.pathname.indexOf("/product/product") > -1) {
                setSubMenuActive({categories: false, products: true, sold_webinars: false, ffl_db: false, completed_webinars: false, sold_physical: false });
                setSubProdShow(true);
                if (urlHistory.location.pathname === "/product/product/listing")
                    setSubProdActive({prod: true, webinar: false});
                if (urlHistory.location.pathname === "/product/product/webinar")
                    setSubProdActive({prod: false, webinar: true});
            }
            else {
                setSubProdShow(false);
                if (urlHistory.location.pathname.indexOf("/category") > -1)
                    setSubMenuActive({categories: true, products: false, sold_webinars: false, ffl_db: false, completed_webinars: false, sold_physical: false });
                if (urlHistory.location.pathname.indexOf("/sold-webinar") > -1)
                    setSubMenuActive({categories: false, products: false, sold_webinars: true, ffl_db: false, completed_webinars: false, sold_physical: false });
                if (urlHistory.location.pathname.indexOf("/ffl-db") > -1)
                    setSubMenuActive({categories: false, products: false, sold_webinars: false, ffl_db: true, completed_webinars: false, sold_physical: false });
                if (urlHistory.location.pathname.indexOf("/completed-webinar") > -1)
                    setSubMenuActive({categories: false, products: false, sold_webinars: false, ffl_db: false, completed_webinars: true, sold_physical: false });
                if (urlHistory.location.pathname.indexOf("/sold-physical") > -1)
                    setSubMenuActive({categories: false, products: false, sold_webinars: false, ffl_db: false, completed_webinars: false, sold_physical: true });              
            }
                

        }
        else {
            setSubMenuShow(false);
            switch (urlHistory.location.pathname) {
                case "/dashboard":
                    setMenuActive({dashboard: true, product: false, user: false, faq: false, setting: false});
                    break;
                case "/user":
                    setMenuActive({dashboard: false, product: false, user: true, faq: false, setting: false});
                    break;
                case "/faq":
                    setMenuActive({dashboard: false, product: false, user: false, faq: true, setting: false});
                    break;
                case "/setting":
                    setMenuActive({dashboard: false, product: false, user: false, faq: false, setting: true});
                    break;
                default:
                    break;
            }
        }
            
        
        // if (urlHistory.location.pathname.indexOf("/faqs") > -1)
        //     setActiveItem({ product: false, myaccount: false, faqs: true });
        // else if (urlHistory.location.pathname.indexOf("/myaccount") > -1)
        //     setActiveItem({ product: false, myaccount: true, faqs: false });
        // else
        //     setActiveItem({ product: true, myaccount: false, faqs: false });
    }, [urlHistory.location.pathname]);
    
    return (
        <div className="side-bar">
            <div className={`${menuActive.dashboard ? 'active' : ''} parent-menu`} onClick = { 
                () => { 
                    setMenuActive({dashboard: true, product: false, user: false, faq: false, setting: false}); setSubMenuShow(false);
                    urlHistory.push("/dashboard");
                }
            }>Dashboard</div>
            <div className={`${menuActive.product ? 'active' : ''} parent-menu with-sub-menu`} onClick = {
                ()=> {
                setSubMenuShow(!subMenuShow);
                setMenuActive({dashboard: false, product: true, user: false, faq: false, setting: false});
                }
            }>
                <p>Product Management</p>
                <button>{ subMenuShow ? <MDBIcon icon="minus" /> : <MDBIcon icon="plus" />}</button>
            </div>
            {
                subMenuShow && <div className="sub-wrapper">
                    <div className={`${subMenuActive.categories ? 'active' : ''} sub-menu`} onClick = {
                        () => { 
                            setSubMenuActive({categories: true, products: false, sold_webinars: false, ffl_db: false, completed_webinars: false, sold_physical: false}); 
                            setSubProdShow(false);
                            urlHistory.push("/product/category")
                            }
                        }><i class="fas fa-chevron-right"></i>Categories</div>

                    <div className={`${subMenuActive.products ? 'active' : ''} sub-menu`} onClick = {
                        () => { 
                            setSubMenuActive({categories: false, products: true, sold_webinars: false, ffl_db: false, completed_webinars: false, sold_physical: false}); 
                            setSubProdShow(!subProdShow);
                            }
                        }><i class="fas fa-chevron-right"></i>Products</div>
                    
                    {
                        subProdShow && <div>
                            <div className={`${subProdActive.prod ? 'active' : ''} sub-menu sub-prod`} onClick = {
                                () => {
                                    setSubProdActive({prod: true, webinar: false});
                                    urlHistory.push("/product/product/listing");
                                    }
                                }><i class="fas fa-genderless"></i>Product listing</div>

                            <div className={`${subProdActive.webinar ? 'active' : ''} sub-menu sub-prod`} onClick = {
                                () => { 
                                    setSubProdActive({prod: false, webinar: true});
                                    urlHistory.push("/product/product/webinar");
                                    }
                                }><i class="fas fa-genderless"></i>Webinar queues</div>
                        </div>
                    }

                    <div className={`${subMenuActive.sold_webinars ? 'active' : ''} sub-menu`} onClick = {
                        () => { 
                            setSubMenuActive({categories: false, products: false, sold_webinars: true, ffl_db: false, completed_webinars: false, sold_physical: false}); 
                            setSubProdShow(false);
                            urlHistory.push("/product/sold-webinar");
                            }
                        }><i class="fas fa-chevron-right"></i>Sold out webinars</div>

                    <div className={`${subMenuActive.ffl_db ? 'active' : ''} sub-menu`} onClick = {() => { 
                            setSubMenuActive({categories: false, products: false, sold_webinars: false, ffl_db: true, completed_webinars: false, sold_physical: false}); 
                            setSubProdShow(false);
                            urlHistory.push("/product/ffl-db");
                            }
                        }><i class="fas fa-chevron-right"></i>FFL database</div>

                    <div className={`${subMenuActive.completed_webinars ? 'active' : ''} sub-menu`} onClick = {() => {
                            setSubMenuActive({categories: false, products: false, sold_webinars: false, ffl_db: false, completed_webinars: true, sold_physical: false}); 
                            setSubProdShow(false);
                            urlHistory.push("/product/completed-webinar");
                            }
                        }><i class="fas fa-chevron-right"></i>Completed webinars</div>

                    <div className={`${subMenuActive.sold_physical ? 'active' : ''} sub-menu`} onClick = {
                        () => { setSubMenuActive({categories: false, products: false, sold_webinars: false, ffl_db: false, completed_webinars: false, sold_physical: true}); 
                        setSubProdShow(false);
                        urlHistory.push("/product/sold-physical");
                        }
                    }><i class="fas fa-chevron-right"></i>Sold physical products</div>
                </div>
            }
            <div className={`${menuActive.user ? 'active' : ''} parent-menu`} onClick = { 
                () => { 
                    setMenuActive({dashboard: false, product: false, user: true, faq: false, setting: false}); setSubMenuShow(false); 
                    urlHistory.push("/user");
                    }
                }>User Management</div>
            <div className={`${menuActive.faq ? 'active' : ''} parent-menu`} onClick = { 
                () => { 
                    setMenuActive({dashboard: false, product: false, user: false, faq: true, setting: false}); setSubMenuShow(false); 
                    urlHistory.push("/faq");
                    }
                }>Faq</div>
            <div className={`${menuActive.setting ? 'active' : ''} parent-menu`} onClick = { 
                () => { 
                    setMenuActive({dashboard: false, product: false, user: false, faq: false, setting: true}); setSubMenuShow(false); 
                    urlHistory.push("/setting");
                    }
                }>Settings</div>
        </div>
    )
}

export default SideBar;