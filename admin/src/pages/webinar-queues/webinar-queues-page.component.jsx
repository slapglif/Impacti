import React, {useState, Fragment, useEffect} from 'react';
import { MDBRow, MDBCol } from 'mdbreact';
import CountPerPage from '../../components/table/count-per-page/count-per-page.component';
import TableFilterInput from '../../components/table/filter-input/filter-input.component';
import PageButtons from '../../components/table/pagination/pagination.component';
import { connect } from 'react-redux';
import FormSelect from '../../components/form-select/form-select.component';
import { getProductItems, setLimitPerPage, updateQueueLimit } from '../../redux/webinar-queue-list/webinar-queue-list.action';
import { loadPage } from '../../redux/user/user.action';
import './webinar-queues-page.style.scss';
import WebinarQueueListeRow from '../../components/table/webinar-queue-row/webinar-queue-row.component';
import {useAlert} from 'react-alert';

const WebinarQueuesPage = ({
    filterStr, 
    product_items, 
    limitPerPage, 
    pageNum,
    getProductItems,
    loadPage,
    setLimitPerPage,
    updateQueueLimit
    }) => {

    const alert = useAlert();

    // for select box of list types
    const typeFilter = ["Queued", "Scheduled"];
    const [typeFilterShow, setTypeFilterShow] = useState(false);
    const [currentTypeFilter, setCurrentTypeFilter] = useState("Queued");

    // for row counts per page
    const countSelect = [10,20,30,50];
    const [countSelectShow, setCountSelectShow] = useState(false);
    const [currentCount, setCurrentCount] = useState(10);

    // for max no of list webinars
    const [maxWebinarCount, setMaxWebinarCount] = useState(product_items.webinar_queue_limit);

    useEffect(() => {
        setLimitPerPage(currentCount);
    }, [currentCount]);

    useEffect(() => {
        async function load() {
            loadPage(true);
            await getProductItems(
                filterStr,   
                currentTypeFilter.toLowerCase(),
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
                currentTypeFilter.toLowerCase(),
                limitPerPage, 
                0
                );
            
            loadPage(false);
        }
        load();
    }, [currentTypeFilter, limitPerPage, filterStr]);

    useEffect(() => {
        setMaxWebinarCount(product_items.webinar_queue_limit);
    }, [product_items.webinar_queue_limit]);

    const numberFormat = (e) => {        
        const re = /^[0-9\b]+$/;
        // if value is not blank, then test the regex

        if (e.target.value === '' || re.test(e.target.value)) {
            setMaxWebinarCount(e.target.value);    
        }
    }

    useEffect(() => {
        console.log("Max webinar count======", maxWebinarCount);
        if (maxWebinarCount > 0)
            console.log(maxWebinarCount);
    }, [maxWebinarCount]);

    const updateMaxWebinarCount = async () => {
        loadPage(true);
        const result = await updateQueueLimit({
            queued_webinar_limit: parseInt(maxWebinarCount)
        })
        if (result === "success")
            alert.success("Changed queue limit successfully");
        else
            alert.error("Changing failed");
        loadPage(false);
    }

    return (
        <div className="webinar-queues-page">
            <div className="headerRow">
                <h2 className="text-white font-weight-bold">Webinar Queues</h2>
            </div>
            <div className="section">
                <MDBRow>
                    <MDBCol size="12" sm="12" md="6" lg="6" className="filterIndex">
                        <label>List type:</label>                        
                        <FormSelect options={typeFilter} showSelectBox={()=>setTypeFilterShow(!typeFilterShow)} selectOption={(event)=>{
                            setTypeFilterShow(false);
                            setCurrentTypeFilter(event.target.id);
                        }} optionShow={typeFilterShow} placeholder={currentTypeFilter}/>
            
                    </MDBCol>
                    <MDBCol middle size="12" sm="12" md="6" lg="6" className="text-right">
                            <label className="text-white">Max no. of listed webinars:</label>
                            <input className="max-no-webinars" type="text" value={maxWebinarCount} onChange={event => numberFormat(event)}/>
                            <button className="max-no-btn" onClick={()=>updateMaxWebinarCount()}>Update</button>
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
                
                {
                    currentTypeFilter === "Queued" ? 
                        <MDBRow className="table-header">
                        {/* <MDBCol size="1">
                            <FormCheckbox Notif={isAllChecked} handleChange = { () => setIsAllChecked(!isAllChecked) } />
                        </MDBCol> */}
                            <MDBCol size="1" className="text-white">
                                Thumbnail
                            </MDBCol>
                            <MDBCol size="2" className="text-white text-center">
                                Name
                            </MDBCol>
                            <MDBCol size="3" className="text-white text-center">
                                Description
                            </MDBCol>
                            
                            <MDBCol size="2" className="text-white text-center">
                                Price
                            </MDBCol>
                            <MDBCol size="2" className="text-white text-center">
                                No. of Seats
                            </MDBCol>         
                            <MDBCol size="2" className="text-white text-center">
                                Remove from queue
                            </MDBCol>             
                        </MDBRow>
                        :
                        <MDBRow className="table-header">                    
                            <MDBCol size="1" className="text-white">
                                Thumbnail
                            </MDBCol>
                            <MDBCol size="2" className="text-white text-center">
                                Name
                            </MDBCol>
                            <MDBCol size="2" className="text-white text-center">
                                Description
                            </MDBCol>      
                            <MDBCol size="2" className="text-white text-center">
                                Date
                            </MDBCol> 
                            <MDBCol size="2" className="text-white text-center">
                                Time
                            </MDBCol>            
                            <MDBCol size="1" className="text-white text-center">
                                Price
                            </MDBCol>
                            <MDBCol size="1" className="text-white text-center">
                                No. of Seats
                            </MDBCol>         
                            <MDBCol size="1" className="text-white text-center">
                                Add to queue
                            </MDBCol>             
                        </MDBRow>
                }
                
                {
                    product_items && product_items.rows && product_items.rows.length > 0 ? product_items.rows.map( item => <WebinarQueueListeRow
                        key = {item.id}
                        item = {item}
                        filterStr = {filterStr}
                        type = {currentTypeFilter.toLowerCase()}
                        pageLimit = {limitPerPage}
                        offset = {limitPerPage*(pageNum-1)}
                        />  )
                        :
                        <div className="non-row text-center">
                            No Data
                        </div>
                }
            </div>
            
        </div>
    )
}

const MapStateToProps = ({ webinarList: { filterStr, product_items, limitPerPage, pageNum }}) => ({
    filterStr,
    product_items,
    limitPerPage,
    pageNum
})

const MapDispatchToProps = dispatch => ({
    getProductItems: getProductItems(dispatch),
    loadPage: flag => dispatch(loadPage(flag)),
    setLimitPerPage: count => dispatch(setLimitPerPage(count)),
    updateQueueLimit: updateQueueLimit(dispatch)
})

export default connect(MapStateToProps, MapDispatchToProps)(WebinarQueuesPage);