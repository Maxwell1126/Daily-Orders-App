import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserPageOrdersClick from './UserPageOrdersClick';
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
                {JSON.stringify(this.props.reduxStore.orders)}
                <ul>Order's Pending Apporoval
                {this.props.reduxStore.orders.map((order) => {
                    if(order.status_id == 2){
                    return (<UserPageOrdersClick key={order.id} order={order}
                                                 history={this.props.history}
                                                 getOrders={this.getOrders} />)
                    }
                })}</ul>
                <ul>Order's Incomplete
                {this.props.reduxStore.orders.map((order) => {
                    if (order.status_id == 1) {
                        return (<UserPageOrdersClick key={order.id} order={order}
                            history={this.props.history}
                            getOrders={this.getOrders} />)
                    }
                })}</ul>
                <ul>Order's Approved
                {this.props.reduxStore.orders.map((order) => {
                    if (order.status_id == 4) {
                        return (<UserPageOrdersClick key={order.id} order={order}
                            history={this.props.history}
                            getOrders={this.getOrders} />)
                    }
                })}</ul>
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