import React, {useState} from 'react';
import './dashboard-page.style.scss';
import { MDBRow, MDBCol } from 'mdbreact';
import FormSelect from '../../components/form-select/form-select.component';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
  } from 'recharts';

const DashboardPage = () => {
    
    const revenue_data = [
        {name: 'JAN', value: 1910},
        {name: 'MAR', value: 2980},
        {name: 'MAY', value: 2000},
        {name: 'JUL', value: 2750},
        {name: 'SEP', value: 3900},
        {name: 'NOV', value: 2390},
    ];

    //for selectbox of revenue types
    const revenueTypes = ["Both", "Webinars", "Products"];
    const [revenueOptionShow, setRevenueOptionShow] = useState(false);
    const [selectedRevenue, setSelectedRevenue] = useState("Both");

     //for selectbox of revenue period
     const revenuePeriod = ["Day", "Week", "Month", "Year"];
     const [revenuePeriodsShow, setRevenuePeriodsShow] = useState(false);
     const [selectedRevenuePeriod, setSelectedRevenuePeriod] = useState("Day");

    const member_data = [
        {name: 'JAN', value: 180},
        {name: 'MAR', value: 272},
        {name: 'MAY', value: 120},
        {name: 'JUL', value: 144},
        {name: 'SEP', value: 225},
        {name: 'NOV', value: 93}
    ];
    
     //for selectbox of member period
     const memberPeriod = ["Day", "Week", "Month", "Year"];
     const [memberPeriodsShow, setMemberPeriodsShow] = useState(false);
     const [selectedMemberPeriod, setSelectedMemberPeriod] = useState("Day");

     const category_data = [
        {name: 'JAN', both: 5000, physical: 2400, webinar: 2400},
        {name: 'FEB', both: 5000, physical: 1398, webinar: 2210},
        {name: 'MAR', both: 5000, physical: 3800, webinar: 2290},
        {name: 'APR', both: 5780, physical: 3908, webinar: 2000},
        {name: 'MAY', both: 5890, physical: 4800, webinar: 2181},
        {name: 'JUN', both: 5390, physical: 3800, webinar: 2500},
        {name: 'JUL', both: 5490, physical: 4300, webinar: 2100},
        {name: 'AUG', both: 5000, physical: 3800, webinar: 2290},
        {name: 'SEP', both: 5780, physical: 3908, webinar: 2000},
        {name: 'OCT', both: 4890, physical: 4800, webinar: 2181},
        {name: 'NOV', both: 5390, physical: 4050, webinar: 2500},
        {name: 'DEC', both: 5490, physical: 4300, webinar: 2100},
    ];

    //for selectbox of category period
    const categoryPeriod = ["Day", "Week", "Month", "Year"];
    const [categoryPeriodsShow, setCategoryPeriodsShow] = useState(false);
    const [selectedCategoryPeriod, setSelectedCategoryPeriod] = useState("Day");

    const tooltipstyle = {
        backgroundColor: 'lightgrey',
        border: '2px solid white'
    }


    return (
        <div className="dashboard-page">
  
            {/* <div className="graph-wrapper"> */}
            <MDBRow>
                <MDBCol>
                    <div className="graph-wrapper">
                        <div className="graph-header">
                            <p className="text-white">Revenue Counter</p>
                            <FormSelect options={revenueTypes} showSelectBox={()=>setRevenueOptionShow(!revenueOptionShow)} selectOption={(event)=>{
                                setRevenueOptionShow(false);
                                setSelectedRevenue(event.target.id);
                            }} optionShow={revenueOptionShow} placeholder={selectedRevenue}/>
                            <FormSelect options={revenuePeriod} showSelectBox={()=>setRevenuePeriodsShow(!revenuePeriodsShow)} selectOption={(event)=>{
                                setRevenuePeriodsShow(false);
                                setSelectedRevenuePeriod(event.target.id);
                            }} optionShow={revenuePeriodsShow} placeholder={selectedRevenuePeriod}/>
                        </div>
                        <div style={{ width: '100%', height: 240 }}>
                            <ResponsiveContainer>
                            <AreaChart
                                data={revenue_data}
                                margin={{
                                top: 10, right: 30, left: 0, bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="15%" stopColor="grey" stopOpacity={0.9}/>
                                    <stop offset="85%" stopColor="grey" stopOpacity={0}/>
                                    </linearGradient>
                                    
                                </defs>
                                <CartesianGrid stroke="grey" horizontal={false}/>
                                <XAxis dataKey="name" stroke="white" tick={{fontSize: 11}} tickMargin={5} axisLine={{stroke: "grey"}} tickLine={{stroke: "grey"}}/>
                                <YAxis stroke="white" tickLine={false} axisLine={false} tick={{fontSize: 11}} tickMargin={5}/>
                                <Tooltip contentStyle={tooltipstyle}/>
                                <Area type="monotone" dataKey="value" stroke="#e43c59" strokeWidth="2" dot={{ fill: '#e43c59', strokeWidth: 2 }} fillOpacity={1} fill="url(#colorRevenue)"/>
                            </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>                    
                </MDBCol>
                <MDBCol>
                    <div className="graph-wrapper">
                        <div className="graph-header">
                            <p className="text-white">Member Counter</p>
                            <FormSelect options={memberPeriod} showSelectBox={()=>setMemberPeriodsShow(!memberPeriodsShow)} selectOption={(event)=>{
                                setMemberPeriodsShow(false);
                                setSelectedMemberPeriod(event.target.id);
                            }} optionShow={memberPeriodsShow} placeholder={selectedMemberPeriod}/>
                        </div>
                        <div style={{ width: '100%', height: 240 }}>
                            <ResponsiveContainer>
                            <AreaChart
                                data={member_data}
                                margin={{
                                top: 10, right: 30, left: 0, bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient id="colorMember" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="15%" stopColor="grey" stopOpacity={0.9}/>
                                    <stop offset="85%" stopColor="grey" stopOpacity={0}/>
                                    </linearGradient>
                                    
                                </defs>
                                <CartesianGrid horizontal={false} stroke="grey"/>
                                <XAxis dataKey="name" stroke="white" tick={{fontSize: 11}} axisLine={{stroke: "grey"}} tickLine={{stroke: "grey"}} tickMargin={5}/>
                                <YAxis stroke="white" tickLine={false} axisLine={false} tick={{fontSize: 11}} tickMargin={5}/>
                                <Tooltip contentStyle={tooltipstyle}/>
                                <Area type="monotone" dataKey="value" stroke="#e43c59" strokeWidth="2" dot={{ fill: '#e43c59', strokeWidth: 2 }} fillOpacity={1} fill="url(#colorMember)" />
                            </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </MDBCol>
            </MDBRow>    
            <MDBRow>
                <MDBCol>
                    <div className="graph-wrapper">
                        <div className="graph-header">
                            <p className="text-white">Category Sales</p>
                            <FormSelect options={categoryPeriod} showSelectBox={()=>setCategoryPeriodsShow(!categoryPeriodsShow)} selectOption={(event)=>{
                                setCategoryPeriodsShow(false);
                                setSelectedCategoryPeriod(event.target.id);
                            }} optionShow={categoryPeriodsShow} placeholder={selectedCategoryPeriod}/>
                        </div>
                        <div style={{ width: '100%', height: 260 }}>
                            <ResponsiveContainer>
                            <BarChart data={category_data}
                                    margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                            <CartesianGrid stroke="grey" strokeDasharray="7 5" vertical={false}/>
                            <XAxis dataKey="name" stroke="white" tick={{fontSize: 11}} axisLine={{stroke: "grey"}} tickLine={false} tickMargin={5}/>
                            <YAxis stroke="white" tickLine={false} axisLine={false} tick={{fontSize: 11}} tickMargin={5}/>
                            <Tooltip contentStyle={tooltipstyle}/>
                            <Bar barSize={10} radius={10} dataKey="both" fill="#e41c39" />
                            <Bar barSize={10} radius={10} dataKey="physical" fill="grey" />
                            <Bar barSize={10} radius={10} dataKey="webinar" fill="white" />
                            </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </MDBCol>
            </MDBRow>            
        </div>
    )
}

export default DashboardPage;