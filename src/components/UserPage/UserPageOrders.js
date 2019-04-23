import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserPageOrdersClick from './UserPageOrdersClick';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { CardContent } from '@material-ui/core';
const moment = require('moment');
moment().format();
class UserPageOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orders: [],
            date: moment().format('L'),
        }
    }

    componentDidMount() {
        this.getOrders();
    }

    getOrders = () => {
        console.log('in get orders');

        let userId = { id: this.props.reduxStore.user.id,
                        date: this.state.date, }
        axios({
            method: 'POST',
            url: '/api/orders',
            data: userId,
        }).then((response) => {
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
            <Grid
                container
                style={{ padding: 20 }}
                direction="column"
                justify="space-evenly"
                alignItems="stretch">
            <Card >
                    
                    <Grid
                    container
                    justify="center"
                    alignItems="center">
                        <strong>Your Orders</strong>
                    </Grid>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Order Name</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{this.state.orders.map((order) => {
                        return (<UserPageOrdersClick key={order.id} order={order} history={this.props.history} getOrders={this.getOrders} />)
                    })}</TableBody>
                </Table>
            </Card>
            </Grid>
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
