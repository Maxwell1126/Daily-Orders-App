import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserPageOrdersClick from './UserPageOrdersClick';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import { CardContent } from '@material-ui/core';
const moment = require('moment');
moment().format();
class ManagerPageOrders extends Component {
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

    // getOrders = () => {
    //     const action = { type: 'GET_ORDERS' };
    //     this.props.dispatch(action);
    // }
    getOrders = () => {
        console.log('in get orders');

        let userId = {
            //id: this.props.reduxStore.user.id,
            date: this.state.date,
        }
        axios({
            method: 'POST',
            url: '/api/orders',
            data: userId,
        }).then((response) => {
            this.setState({
                orders: response.data
            })
        })
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
                <Grid container
                    direction="column"
                    justify="space-evenly"
                    alignItems="stretch">
                    <Grid
                        container
                        direction="column"
                        justify="space-evenly"
                        alignItems="stretch"
                    style={{ padding: 20 }}>
                <Card >
                    <CardContent><strong>Orders Pending Apporoval</strong>
                    </CardContent>
                    <Table >
                        <TableHead alignItems="center">        
                            <TableRow>
                                <TableCell>Order Name</TableCell>
                                <TableCell>Writer</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{this.state.orders.map((order) => {
                            if (order.status_id == 2) {
                                return (<UserPageOrdersClick key={order.id} order={order}
                                    history={this.props.history}
                                    getOrders={this.getOrders} />)
                            }
                        })}</TableBody>
                    </Table>
                </Card>
                        </Grid>
                    <Grid
                        container
                        direction="column"
                        justify="space-evenly"
                        alignItems="stretch"
                        style={{ padding: 20 }}>
                <Card >
                    <CardContent><strong>Orders Incomplete</strong>
                    </CardContent>
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell>Order Name</TableCell>
                                <TableCell>Writer</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{this.state.orders.map((order) => {
                            if (order.status_id == 1) {
                                return (<UserPageOrdersClick key={order.id} order={order}
                                    history={this.props.history}
                                    getOrders={this.getOrders} />)
                            }
                        })}</TableBody>
                    </Table>
                </Card>
                    </Grid>
                    <Grid
                        container
                        direction="column"
                        justify="space-evenly"
                        alignItems="stretch"
                        style={{ padding: 20 }}>
                <Card >
                    <CardContent>
                        <strong>Orders Approved</strong>
                    </CardContent>
                    <Table >
                        <TableHead>
                                    
                            <TableRow>
                                <TableCell>Order Name</TableCell>
                                <TableCell>Writer</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{this.state.orders.map((order) => {
                            if (order.status_id == 4) {
                                return (<UserPageOrdersClick key={order.id} order={order}
                                    history={this.props.history}
                                    getOrders={this.getOrders} />)
                            }
                        })}</TableBody>
                    </Table>
                </Card> 
                </Grid> 
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
export default connect(mapStateToProps)(ManagerPageOrders);