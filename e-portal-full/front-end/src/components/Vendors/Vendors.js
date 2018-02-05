import React from 'react';
import {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import axios from 'axios';
import {login, logout, setTabnerVendors, deleteVendor, setVendorEmployees, setVendorInvoices, setVendorAddress} from '../../actions/mainActions';
import {connect} from "react-redux";
require("primereact/resources/themes/omega/theme.css");
require("primereact/resources/primereact.min.css");


class Vendors extends Component {

    constructor(){
        super();
        this.state = {
            ven: '',
            vendor_id: '',
            name: '',
            reg_state: '',
            invoice_freq: '',
            payment_freq: '',
            status: '',
            messageForCreateUser: '',
            message: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onVendorDelete = this.onVendorDelete.bind(this);
        this.handleCreateVendor = this.handleCreateVendor.bind(this);
        this.ifGotResponseFromCreateVendor = this.ifGotResponseFromCreateVendor.bind(this);
        this.onVendorSelect = this.onVendorSelect.bind(this);
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'text' ? target.value : target.value;
        const name = target.name;

        this.setState ({
            [name]: value.toUpperCase()
        }) ;

    }

    componentWillMount(){
        if(this.props.main.isLogged == 'false'){
            browserHistory.push("/home");
        } else {
            var config = {
                headers: {'Authorization': localStorage.getItem('tabner_token')}
            };
            axios.get('http://'+localStorage.getItem('your_ip')+':8090/tabnervendors', config)
                .then((response) => {
                    this.props.setTabnerVendors(response.data.response);
                    console.log(response);
                    console.log('dataaaa fromm redux');
                    console.log(this.props.main.tabnerVendors);
                    console.log(this.props.main.tabnerVendors[0]);

                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    handleCreateVendor(event){
        event.preventDefault();
        console.log(this.state.vendor_id + this.state.name + this.state.reg_state + this.state.invoice_freq + this.state.payment_freq + this.state.address);

        var config = {
            headers: {'Authorization': localStorage.getItem('tabner_token')}
        };
        axios.post('http://'+localStorage.getItem('your_ip')+':8090/newvendor', {
            vendor_id: this.state.vendor_id,
            name : this.state.name,
            reg_state : this.state.reg_state,
            invoice_freq: this.state.invoice_freq,
            payment_freq: this.state.payment_freq,
            status: this.state.status
        }, config)
            .then((response) => this.ifGotResponseFromCreateVendor(response))
            .catch(function (error) {
                console.log(error);
            });
    }

    ifGotResponseFromCreateVendor(response) {
        console.log(response);
        if (response.data.response === true) {

            console.log(response.data.response);

            browserHistory.push("/home");
            browserHistory.push("/loggedIn");

        }
        if (response.data.response === false){
            console.log('message is setting');
            this.setState({

                messageForCreateUser: '* The given Vendor details already exists'
            });
        }

    }

    onVendorSelect(index){
        console.log("------------------------------------------------------------------");
        var config = {
            headers: {'Authorization': localStorage.getItem('tabner_token')}
        };
        axios.post('http://'+localStorage.getItem('your_ip')+':8090/vendordetails', {
            vendor_id: this.props.main.tabnerVendors[index].vendor_id
        }, config)
            .then((response) => {
                this.props.setVendorEmployees(response.data.response[0]);
                this.props.setVendorInvoices(response.data.response[1]);
                this.props.setVendorAddress(response.data.response[2]);
                console.log(response);
                console.log('dataaaa fromm redux');
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    onVendorDelete(index){
        var alert_msg = window.confirm("Are you sure you want to delete?");
        if(alert_msg) {
            var config = {
                headers: {'Authorization': localStorage.getItem('tabner_token')}
            };
            axios.post('http://'+localStorage.getItem('your_ip')+':8090/deletevendor', {
                vendor_id: this.props.main.tabnerVendors[index].vendor_id
            }, config)
                .then((response) => this.ifGotResponseFromDeleteVendor(response, index))
                .catch(function (error) {
                    console.log(error);
                });
        }

    }

    ifGotResponseFromDeleteVendor(response, index){
        console.log(response);
        if (response.data.response === true) {

            console.log(response.data.response);
            this.props.deleteVendor(index);

        }
        if (response.data.response === false){
            console.log('message is setting');
            this.setState({
                messageForCreateUser: '* Something went wrong'
            });
        }
    }


    render(){

        const venEmployees = this.props.main.vendorEmployees.map((venemp, index) => {
            return <tr className="employee_hover" key={index}>
                <td>{venemp.emp_id}</td>
                <td>{venemp.first_name}</td>
                <td>{venemp.last_name}</td>
                <td>{venemp.email_id}</td>
                <td>{venemp.mobile_num}</td>
            </tr>
        });

        const venInvoices = this.props.main.vendorInvoices.map((veninv, index) => {
            return <tr className="employee_hover" key={index}>
                <td>{veninv.inv_id}</td>
                <td>{veninv.emp_id}</td>
                <td>{veninv.emp_name}</td>
                <td>{veninv.vendor_id}</td>
                <td>{veninv.vendor_name}</td>
                <td>{veninv.hours}</td>
                <td>{veninv.amount}</td>
                <td>{veninv.start_date}</td>
                <td>{veninv.end_date}</td>
            </tr>
        });

        const vendor_Address = this.props.main.vendorAddress.map((ven_addr, index) => {
            return <tr className="employee_hover" key={index}>
                <td>{ven_addr.address_line_1}</td>
                <td>{ven_addr.address_line_2}</td>
                <td>{ven_addr.suite_apt}</td>
                <td>{ven_addr.city}</td>
                <td>{ven_addr.state}</td>
                <td>{ven_addr.zipcode}</td>
            </tr>
        });

        const vendors = this.props.main.tabnerVendors.map((vendor, index) => {
            if(this.state.ven === ''){
                return   <tr className="employee_hover" key={index} >
                    <td><a href="#venEmp_table" onClick={ () => this.onVendorSelect(index)}>{vendor.vendor_id}</a></td>
                    <td>{vendor.name}</td>
                    <td>{vendor.reg_state}</td>
                    <td>{vendor.invoice_freq}</td>
                    <td>{vendor.payment_freq}</td>
                    <td> <span className="glyphicon glyphicon-trash" onClick = { () => this.onVendorDelete(index)}></span></td>
                </tr>
            } else {
                if((vendor.vendor_id.indexOf(this.state.ven) > -1) || (vendor.name.toUpperCase().indexOf(this.state.ven) > -1) || (vendor.reg_state.indexOf(this.state.ven) > -1) || (vendor.invoice_freq.toUpperCase().indexOf(this.state.ven) > -1) || (vendor.payment_freq.toUpperCase().indexOf(this.state.ven) > -1)){
                    return   <tr className="employee_hover" key={index} >
                        <td><a href="#venEmp_table" onClick={ () => this.onVendorSelect(index)}>{vendor.vendor_id}</a></td>
                        <td>{vendor.name}</td>
                        <td>{vendor.reg_state}</td>
                        <td>{vendor.invoice_freq}</td>
                        <td>{vendor.payment_freq}</td>
                        <td> <span className="glyphicon glyphicon-trash" onClick = { () => this.onVendorDelete(index)}></span></td>
                    </tr>
                } else {
                    return   <tr className="employee_hover" key={index} style={{display: 'none'}}>
                        <td><a href="#venEmp_table" onClick={ () => this.onVendorSelect(index)}>{vendor.vendor_id}</a></td>
                        <td>{vendor.name}</td>
                        <td>{vendor.reg_state}</td>
                        <td>{vendor.invoice_freq}</td>
                        <td>{vendor.payment_freq}</td>
                        <td> <span className="glyphicon glyphicon-trash" onClick = { () => this.onVendorDelete(index)}></span></td>
                    </tr>
                }
            }

        });

        return (

            <div className="container">

                <div className="table-div">
                    <div className="row justify-content-center">
                        <div className="col align-self-center">
                            {/*<div className="add-btn" style={{float: 'left'}}>
                                <button className="btn btn-primary" type="button" data-toggle="modal" data-target="#newVendor" data-backdrop="true">Add Vendor</button>
                            </div>*/}
                            <div className="col-xs-3" style={{float:'right', paddingRight: '0px'}}>
                                <input type="text" className="form-control"  placeholder="Search for..." id="ven" name="ven"
                                           onChange={this.handleInputChange}/>
                            </div>
                            <table class="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Vendor ID</th>
                                        <th>Vendor Name</th>
                                        <th>Registration State</th>
                                        <th>Invoice Frequency</th>
                                        <th>Payment Frequency</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {vendors}
                                    </tbody>
                                </table>

                                <div className= "container">
                                    <ul class="nav nav-tabs">
                                        <li class="active" id="venEmp_table"><a data-toggle="tab" href="#employees">Employees</a></li>
                                        <li><a data-toggle="tab" href="#invoices">Invoices</a></li>
                                        <li><a data-toggle="tab" href="#address">Address</a></li>
                                    </ul>

                                    <div class="tab-content">
                                        <div id="employees" class="tab-pane fade in active">
                                            <div className="row justify-content-center">
                                                <div className="col align-self-center">
                                                    <table class="table table-striped table-bordered">
                                                        <thead>
                                                        <tr>
                                                            <th>Employee ID</th>
                                                            <th>First Name</th>
                                                            <th>Last Name</th>
                                                            <th>Email</th>
                                                            <th>Mobile Number</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {venEmployees}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="invoices" class="tab-pane fade">
                                            <div className="row justify-content-center">
                                                <div className="col align-self-center">
                                                    <table class="table table-striped table-bordered">
                                                        <thead>
                                                        <tr>
                                                            <th>Invoice ID</th>
                                                            <th>Employee ID</th>
                                                            <th>Employee Name</th>
                                                            <th>Vendor ID</th>
                                                            <th>Vendor Name</th>
                                                            <th>Hours</th>
                                                            <th>Invoice Amount</th>
                                                            <th>Start Date</th>
                                                            <th>End Date</th>

                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {venInvoices}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                        </div>
                                        <div id="address" class="tab-pane fade">
                                            <div className="row justify-content-center">
                                                <div className="col align-self-center">
                                                    <table class="table table-striped table-bordered">
                                                        <thead>
                                                        <tr>
                                                            <th>Vendor Address Line 1</th>
                                                            <th>Vendor Address Line 2</th>
                                                            <th>Suite/Apt</th>
                                                            <th>City</th>
                                                            <th>State</th>
                                                            <th>Zipcode</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {vendor_Address}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="newVendor" tabindex="-1" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content"  style={{backgroundColor: '#2d60a3'}}>
                                <div className="modal-header">
                                    <div className="row">
                                        <div className="col-xs-11">
                                            <h4 className="modal-title forms-text">ADD NEW VENDOR</h4>
                                        </div>
                                        <div className="col-xs-1">
                                            <a data-dismiss="modal" style={{cursor : 'pointer'}}><span className="glyphicon glyphicon-remove"></span>
                                            </a></div>
                                    </div>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={this.handleCreateVendor.bind(this)}>
                                        <div className="form-group">
                                            <label htmlFor="idclient">Vendor ID</label>
                                            <input type="text" className="form-control" placeholder="Vendor ID" id= "vendor_id" name="vendor_id"
                                                   onChange={this.handleInputChange} required/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="clientname">Vendor Name</label>
                                            <input type="text" className="form-control" placeholder="VENDOR NAME" id= "name" name="name"
                                                   onChange={this.handleInputChange} required/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phone">Registration State</label>
                                            <input type="text" placeholder="REGISTRATION STATE" className="form-control" id="reg_state" name="reg_state"
                                                   onChange={this.handleInputChange} required/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="text">Invoice Frequency</label>
                                            <input type="text" placeholder="INVOICE FREQUENCY" className="form-control" id="invoice_freq" name="invoice_freq"
                                                   onChange={this.handleInputChange} required/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="location">Payment Frequency</label>
                                            <input type="text" placeholder="PAYMENT FREQUENCY" className="form-control" id="payment_freq" name="payment_freq"
                                                   onChange={this.handleInputChange} required/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="domain">Address</label>
                                            <input type="text" placeholder="ADDRESS" className="form-control" id="address" name="address"
                                                   onChange={this.handleInputChange} required/>
                                        </div>
                                        <div className = "row">
                                            <div className="col-xs-3"></div>
                                            <div className="col-xs-6">
                                                <p style={{color : 'white', textAlign : 'center'}}>{this.state.messageForCreateUser}</p>
                                            </div>
                                            <div className="col-xs-3"></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-xs-4"></div>
                                            <div className="col-xs-4">
                                                <button type="submit" className="btn btn-primary btn-lg btn-block btn-clr">Create</button>
                                            </div>
                                            <div className="col-xs-4"></div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        main: state.main

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: () => {
            dispatch(login());
        },
        logout: () => {
            dispatch(logout());
        },
        setTabnerVendors: (vendors) => {
            dispatch(setTabnerVendors(vendors));
        },
        deleteVendor: (index) => {
            dispatch(deleteVendor(index));
        },
        setVendorEmployees: (venEmployees) => {
            dispatch(setVendorEmployees(venEmployees));
        },
        setVendorInvoices: (venInvoices) => {
            dispatch(setVendorInvoices(venInvoices));
        },
        setVendorAddress: (vendor_Address) => {
            dispatch(setVendorAddress(vendor_Address));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Vendors);
