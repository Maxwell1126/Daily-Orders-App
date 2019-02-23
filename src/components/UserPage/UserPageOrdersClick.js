import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
const moment = require('moment');

class UserPageOrders extends Component {
constructor(){
super()
this.state={
    date: moment().format('L'),
}
}
    componentDidMount() {
        this.props.getOrders();
    }

    toOrderSheet = (event) => {
        axios({
            method:'POST',
            url:'/api/dashboardPost',
            data:{
                id:this.props.order.order_id,
                person:this.props.order.person_id,
                date:this.state.date,
            }
        }).then((response)=>{
            this.props.history.push(`/home/${this.props.order.order_id}`)
        })
    }
    // this could also be written with destructuring parameters as:
    // const UserPage = ({ user }) => (
    // and then instead of `props.user.username` you could use `user.username`
    // this.render
    // 
    render() {
        let statusName;
        if(this.props.order.status_id==1){
            statusName = <p>Incomplete</p>
        }else if(this.props.order.status_id==2){
            statusName=<p>Complete</p>
        } else if (this.props.order.status_id==4){
            statusName=<p>Approved</p>
        }
        let orderContent;
        if(this.props.user.manager==true){
            orderContent = <TableRow onClick={this.toOrderSheet}>
                <TableCell>{this.props.order.order_name}</TableCell>
                <TableCell>{this.props.order.username}</TableCell>
            </TableRow>
        }else{
            orderContent = <TableRow onClick={this.toOrderSheet}>
                <TableCell>{this.props.order.order_name}</TableCell>
                        <TableCell>{statusName}</TableCell></TableRow>
        }
        return (orderContent)
    }
}
// Instead of taking everything from state, we just want the user info.
// if you wanted you could write this code like this:
// const mapStateToProps = ({user}) => ({ user });
const mapStateToProps = state => ({
    user: state.user,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(UserPageOrders);