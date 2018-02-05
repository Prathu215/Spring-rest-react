import React from 'react';
import {Component} from 'react';
import axios from 'axios';
import { browserHistory} from "react-router";
import {login, logout, setDefaultEmployee} from '../../actions/mainActions';
import {connect} from "react-redux";
import {DataTable} from 'primereact/components/datatable/DataTable';
import {Column} from 'primereact/components/column/Column';
require("primereact/resources/themes/omega/theme.css");
require("primereact/resources/primereact.min.css");


class DefaultEmployee extends Component {
    constructor(){
        super();

    }

    componentWillMount(){
        if(this.props.main.isLogged == 'false'){
            browserHistory.push("/home");
        } else {
            var config = {
                headers: {'Authorization': localStorage.getItem('tabner_token')}
            };
            console.log("user name......" + this.props.main.userName);
            axios.post('http://'+localStorage.getItem('your_ip')+':8090/defaulttabneremployee', {
                username : this.props.main.userName
            }, config)
                .then((response) => {
                    console.log('printinig default employee');
                    console.log(response.data.response);
                    this.props.setDefaultEmployee(response.data.response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    }
    render() {
        return(
            <div class="panel-group" id="accordion">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4 class="panel-title">
                            <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">Personal Information</a>
                        </h4>
                    </div>
                    <div id="collapse1" class="panel-collapse collapse">
                        <div class="panel-body">
                            <h5 className="col-md-9">Employee Id: {this.props.main.defaultEmployee.emp_id}</h5>
                            <h5 className="col-md-5">First Name: {this.props.main.defaultEmployee.first_name}</h5>
                            <h5 className="col-md-5">Last Name: {this.props.main.defaultEmployee.last_name}</h5>
                            <h5 className="col-md-5">Email: {this.props.main.defaultEmployee.email_id}</h5>
                            <h5 className="col-md-5">Mobile: {this.props.main.defaultEmployee.mobile_num}</h5>
                        </div>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4 class="panel-title">
                            <a data-toggle="collapse" data-parent="#accordion" href="#collapse2">Immigration Details</a>
                        </h4>
                    </div>
                    <div id="collapse2" class="panel-collapse collapse">
                        <div class="panel-body">
                            <div class="panel-body">
                            <div class="panel-group" id="accordion11">
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <h4 class="panel-title">
                                            <a data-toggle="collapse" data-parent="#accordion11" href="#collapse11">Passport Details</a>
                                        </h4>
                                    </div>
                                    <div id="collapse11" class="panel-collapse collapse">
                                        <div class="panel-body">
                                            <h5 className="col-md-5">Passport Number: {this.props.main.defaultEmployee.emp_id}</h5>
                                            <h5 className="col-md-5">Issued Country: {this.props.main.defaultEmployee.first_name}</h5>
                                            <h5 className="col-md-5">Issued Date: {this.props.main.defaultEmployee.last_name}</h5>
                                            <h5 className="col-md-5">Expiration Date: {this.props.main.defaultEmployee.email_id}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <h4 class="panel-title">
                                            <a data-toggle="collapse" data-parent="#accordion11" href="#collapse12">Visa Details</a>
                                        </h4>
                                    </div>
                                    <div id="collapse12" class="panel-collapse collapse">
                                        <div class="panel-body">
                                            <h5 className="col-md-5">Visa Number: {this.props.main.defaultEmployee.passport}</h5>
                                            <h5 className="col-md-5">Visa Type: {this.props.main.defaultEmployee.visa}</h5>
                                            <h5 className="col-md-5">Issued Date: {this.props.main.defaultEmployee.last_name}</h5>
                                            <h5 className="col-md-5">Expiration Date: {this.props.main.defaultEmployee.email_id}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <h4 class="panel-title">
                                            <a data-toggle="collapse" data-parent="#accordion11" href="#collapse13">I94 Details</a>
                                        </h4>
                                    </div>
                                    <div id="collapse13" class="panel-collapse collapse">
                                        <div class="panel-body">
                                            <h5 className="col-md-5">I94 Number: {this.props.main.defaultEmployee.education}</h5>
                                            <h5 className="col-md-5">Last Arrived Date: {this.props.main.defaultEmployee.experience}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4 class="panel-title">
                            <a data-toggle="collapse" data-parent="#accordion" href="#collapse3">Education Details</a>
                        </h4>
                    </div>
                    <div id="collapse3" class="panel-collapse collapse">
                        <div class="panel-body">
                            <h5 className="col-md-5">Education: {this.props.main.defaultEmployee.education}</h5>
                            <h5 className="col-md-5">Experience: {this.props.main.defaultEmployee.experience}</h5>
                            <h5 className="col-md-5">Skills: {this.props.main.defaultEmployee.skills}</h5>
                        </div>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4 class="panel-title">
                            <a data-toggle="collapse" data-parent="#accordion" href="#collapse4">Address Details</a>
                        </h4>
                    </div>
                    <div id="collapse4" class="panel-collapse collapse">
                        <div class="panel-body">
                            <h5 className="col-md-5">Address: {this.props.main.defaultEmployee.address}</h5>
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
        setDefaultEmployee: (employee) => {
            dispatch(setDefaultEmployee(employee));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultEmployee);