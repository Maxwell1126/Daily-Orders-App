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
const moment = require('moment');
moment().format();
class ManagerPageOrders extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.getOrders();
    }

    getOrders = () => {
        const action = { type: 'GET_ORDERS' };
        this.props.dispatch(action);
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
            <div>
                {/* {JSON.stringify(this.props.reduxStore.orders)} */}
                <Card raised="true">
                    <Table >
                        <TableHead>
                            Order's Pending Apporoval
                            <TableRow>
                                <TableCell>Order Name</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{this.props.reduxStore.orders.map((order) => {
                            if (order.status_id == 2) {
                                return (<UserPageOrdersClick key={order.id} order={order}
                                    history={this.props.history}
                                    getOrders={this.getOrders} />)
                            }
                        })}</TableBody>
                    </Table>
                </Card>

                <Card raised="true">
                    <Table >
                        <TableHead>
                            Order's Incomplete
                            <TableRow>
                                <TableCell>Order Name</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{this.props.reduxStore.orders.map((order) => {
                            if (order.status_id == 1) {
                                return (<UserPageOrdersClick key={order.id} order={order}
                                    history={this.props.history}
                                    getOrders={this.getOrders} />)
                            }
                        })}</TableBody>
                    </Table>
                </Card>

                <Card raised="true">
                    <Table >
                        <TableHead>
                            Order's Approved
                            <TableRow>
                                <TableCell>Order Name</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{this.props.reduxStore.orders.map((order) => {
                            if (order.status_id == 4) {
                                return (<UserPageOrdersClick key={order.id} order={order}
                                    history={this.props.history}
                                    getOrders={this.getOrders} />)
                            }
                        })}</TableBody>
                    </Table>
                </Card>       
            </div>
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