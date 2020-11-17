import React, {useState, Fragment, useEffect} from 'react';
import './product-listing-page.style.scss';
import FormButton from '../../components/form-button/form-button.component';
import { MDBRow, MDBCol } from 'mdbreact';
import CountPerPage from '../../components/table/count-per-page/count-per-page.component';
import TableFilterInput from '../../components/table/filter-input/filter-input.component';
import PageButtons from '../../components/table/pagination/pagination.component';
import { connect } from 'react-redux';
import FormSelect from '../../components/form-select/form-select.component';
import ProductListeRow from '../../components/table/prduct-list-row/product-list-row.component';
import AddNewProductForm from '../../components/product-management/add-new/add-new.component';
import { setAddNewClicked, getProductItems, setLimitPerPage } from '../../redux/product-list/product-list.action';
import { loadPage } from '../../redux/user/user.action';

const ProductListingPage = ({
    filterStr, 
    product_items, 
    limitPerPage, 
    pageNum,
    isAddNewClicked,
    setAddNewClicked,
    getProductItems,
    loadPage,
    setLimitPerPage
    }) => {

    // for select box of prod types
    const typeFilter = ["All", "Physical", "Webinar"];
    const [typeFilterShow, setTypeFilterShow] = useState(false);
    const [currentTypeFilter, setCurrentTypeFilter] = useState("All");

    // for select box of prod types
    const stateFilter = ["Active", "Inactive", "Hold"];
    const [stateFilterShow, setStateFilterShow] = useState(false);
    const [currentStateFilter, setCurrentStateFilter] = useState("Inactive");
    
    // for row counts per page
    const countSelect = [10,20,30,50];
    const [countSelectShow, setCountSelectShow] = useState(false);
    const [currentCount, setCurrentCount] = useState(10);

    useEffect(() => {
        setLimitPerPage(currentCount);
    }, [currentCount]);

    // select all to delete
    // const [isAllChecked, setIsAllChecked] = useState(false);

    // delete selected rows
    // const [deleteList, setDeleteList] = useState([]);
    
    // const addToDelList = (id) => {
    //     let delList = deleteList;
    //     delList.push(id);
    //     setDeleteList([...delList]);
    // }

    // const removeFromDelList = (id) => {
    //     let delList = deleteList;
    //     let index = delList.indexOf(id);
    //     if (index > -1){
    //         delList.splice(index,1);
    //         setDeleteList([...delList]);
    //     }
    // }

    // const deletSelectedRows = async () => {
    //     if (deleteList.length !== 0) {
    //         console.log(deleteList);
    //         // loadPage(true);
    //         // const result = await deleteCategory(deleteList);
    //         // if (result === "success") {                
    //         //     await getCurrentCategories();
    //         //     alert.success("Delete successfully");
    //         // }
    //         // else
    //         //     alert.error("Deleting failed");
    //         // loadPage(false);
    //     }
    // }
    useEffect(() => {
        async function load() {
            loadPage(true);
            await getProductItems(
                "", 
                currentStateFilter.toLowerCase(), 
                currentTypeFilter === "All" ? "both" : currentTypeFilter.toLowerCase(),
                10, 
                0
                );
            loadPage(false);
        }
        !isAddNewClicked && load();
    }, [isAddNewClicked]);

    useEffect(() => {
        async function load() {
            loadPage(true);
            await getProductItems(
                filterStr, 
                currentStateFilter.toLowerCase(), 
                currentTypeFilter === "All" ? "both" : currentTypeFilter.toLowerCase(),
                limitPerPage, 
                limitPerPage*(pageNum-1)
                );
            loadPage(false);
        }
        load();
    }, [pageNum]);

    useEffect(() => {        
        async function load() {
            loadPage(true);
            await getProductItems(
                filterStr, 
                currentStateFilter.toLowerCase(), 
                currentTypeFilter === "All" ? "both" : currentTypeFilter.toLowerCase(),
                limitPerPage, 
                0
                );
            loadPage(false);
        }
        load();
    }, [currentTypeFilter, currentStateFilter, limitPerPage, filterStr]);


    const renderAddNewPage = () => (
        <AddNewProductForm/>
    )

    const renderListPage = () => (
        <Fragment>
            <MDBRow className="headerRow">
                <MDBCol size="12" sm="12" md="9" lg="10">
                    <h2 className="text-white font-weight-bold">Product Listing</h2>
                </MDBCol>
                <MDBCol size="6" sm="6" md="3" lg="2">
                    <FormButton onClickFunc={()=>setAddNewClicked(true)}>ADD NEW</FormButton>
                </MDBCol>
            </MDBRow>
            <div className="section">
                <MDBRow>
                    <MDBCol size="12" sm="12" md="6" lg="6" className="filterIndex">
                        <label>Filter by </label>
                        <label className="filterLabel">Type:</label>
                        <FormSelect options={typeFilter} showSelectBox={()=>setTypeFilterShow(!typeFilterShow)} selectOption={(event)=>{
                            setTypeFilterShow(false);
                            setCurrentTypeFilter(event.target.id);
                        }} optionShow={typeFilterShow} placeholder={currentTypeFilter}/>
                        <label className="filterLabel">State:</label>
                        <FormSelect options={stateFilter} showSelectBox={()=>setStateFilterShow(!stateFilterShow)} selectOption={(event)=>{
                            setStateFilterShow(false);
                            setCurrentStateFilter(event.target.id);
                        }} optionShow={stateFilterShow} placeholder={currentStateFilter}/>
                    </MDBCol>
                    <MDBCol middle size="12" sm="12" md="6" lg="6" className="text-right">
                            <label className="text-white">Total live webinars: </label>
                            <label className="text-white">{product_items.total_live_count}</label>
                    </MDBCol>
                </MDBRow>
                <div className="toolbar">
                    <div className="leftDiv">
                        <div>
                            <CountPerPage 
                                options={countSelect} 
                                showSelectBox={()=>setCountSelectShow(!countSelectShow)} 
                                selectOption={(event)=>{
                                    setCountSelectShow(false);
                                    setCurrentCount(Number(event.target.id));
                                }} 
                                optionShow={countSelectShow} 
                                placeholder={currentCount}
                            />
                            <label className="ml-1">Per Page</label>
                        </div>
                        <TableFilterInput str={filterStr}/>
                    </div>
                    <PageButtons count={Math.ceil(product_items.count/limitPerPage)} currentIndex = {pageNum}/>  
                </div>
                {/* <p className="deleteAction">Action: <i class="fas fa-trash-alt" onClick={()=>deletSelectedRows()}></i></p> */}
                
                <MDBRow className="table-header">
                    {/* <MDBCol size="1">
                        <FormCheckbox Notif={isAllChecked} handleChange = { () => setIsAllChecked(!isAllChecked) } />
                    </MDBCol> */}
                    <MDBCol size="1" className="text-white thumb">
                        Thumbnail
                    </MDBCol>
                    <MDBCol size="2" className="text-white text-center">
                        Name
                    </MDBCol>
                    <MDBCol size="2" className="text-white text-center">
                        Description
                    </MDBCol>
                    <MDBCol size="1" className="text-white text-center">
                        Type
                    </MDBCol>
                    <MDBCol size="1" className="text-white text-center">
                        Price
                    </MDBCol>
                    <MDBCol size="1" className="text-white text-center">
                        Quantity
                    </MDBCol>
                    <MDBCol size="2" className="text-white text-center">
                        Live Date
                    </MDBCol>
                    <MDBCol size="1" className="text-white text-center">
                        View/ Edit
                    </MDBCol>
                    <MDBCol size="1" className="text-white text-center">
                        Active/ Inactive
                    </MDBCol>
                </MDBRow>
                {
                    product_items && product_items.rows && product_items.rows.length > 0 ? product_items.rows.map( item => <ProductListeRow
                        key={item.id}
                        id = {item.id}
                        name={item.product_name}
                        description={item.shortDescription}
                        prodType={item.product_type}
                        price={item.product_price}
                        amount={item.Quantity}
                        date={item.scheduled_time}
                        status={item.product_status}
                        typeFilter = {currentTypeFilter}
                        statusFilter = {currentStateFilter}
                        img = {item.main_image}
                        // addToDelList = {(id)=>addToDelList(id)}
                        // removeFromDelList = {(id)=>removeFromDelList(id)}
                        // isAllChecked = {isAllChecked}
                        />  )
                        :
                        <div className="non-row text-center">
                            No Data
                        </div>
                }
            </div>
        </Fragment>
    )
    
    return (
        <div className="product-listing-page">
        {
            isAddNewClicked ? renderAddNewPage()
            :
            renderListPage()
        }
        </div>
    )
}

const MapStateToProps = ({ productList: { filterStr, product_items, limitPerPage, pageNum, isAddNewClicked }}) => ({
    filterStr,
    product_items,
    limitPerPage,
    pageNum,
    isAddNewClicked
})

const MapDispatchToProps = dispatch => ({
    setAddNewClicked: flag => dispatch(setAddNewClicked(flag)),
    getProductItems: getProductItems(dispatch),
    loadPage: flag => dispatch(loadPage(flag)),
    setLimitPerPage: count => dispatch(setLimitPerPage(count))
})

export default connect(MapStateToProps, MapDispatchToProps)(ProductListingPage);