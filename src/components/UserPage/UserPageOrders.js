import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserPageOrdersClick from './UserPageOrdersClick';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
const moment = require('moment');
moment().format();
class UserPageOrders extends Component {
    constructor(props) {
        super(props)
        this.state={
            orders:[],
        }
    }

    componentDidMount() {
        this.getOrders();
    }

    getOrders = () => {
        console.log('in get orders');
        
        let userId = { id:this.props.reduxStore.user.id}
        axios({
            method:'POST',
            url:'/api/dashboardGet',
            data: userId,
        }).then((response)=>{
            this.setState({
                orders: response.data
            })
        })
        
        // const action = { type: 'GET_ORDERS', payload:id};
        // this.props.dispatch(action);
    }

    toOrderSheet = (event) => {
        this.props.history.push('/home:/id')
    }
    // this could also be written with destructuring parameters as:
    // const UserPage = ({ user }) => (
    // and then instead of `props.user.username` you could use `user.username`
    // this.render
    // 
    render() {
        return (  
                <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Order Name</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{this.state.orders.map((order) => {
        return (<UserPageOrdersClick key={order.id}order={order} history={this.props.history} getOrders={this.getOrders}/>)
                })}</TableBody>
                </Table>
        )
    }
}
// Instead of taking everything from state, we just want the user info.
// if you wanted you could write this code like this:
// const mapStateToProps = ({user}) => ({ user });
const mapStateToProps = reduxStore => ({
    reduxStore,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(UserPageOrders);
