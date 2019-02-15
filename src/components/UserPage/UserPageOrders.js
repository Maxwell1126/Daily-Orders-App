import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserPageOrdersClick from './UserPageOrdersClick';
const moment = require('moment');
moment().format();
class UserPageOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orders: [],
        }
    }

    componentDidMount() {
        this.getOrders();
    }

    getOrders = () => {
        const action = { type: 'GET_ORDERS' };
        this.props.dispatch(action);
    }
    // getOrders = (event) => {
    //   axios.get('api/dashboard').then(response => {
    //     this.setState({
    //       ...this.state,
    //       orders: response.data,
    //     })
    //   })
    // }

    toOrderSheet = (event) => {
        this.props.history.push('/home:/id')
    }

    toHistory = (event) => {
        this.props.history.push('/history')
    }
    // this could also be written with destructuring parameters as:
    // const UserPage = ({ user }) => (
    // and then instead of `props.user.username` you could use `user.username`
    // this.render
    // 
    render() {
        return (
            <div>
                <ul>{this.props.reduxStore.orders.map((order) => {
        return (<UserPageOrdersClick key={order.id}order={order} history={this.props.history} getOrders={this.getOrders}/>)
      })}</ul>
                <button onClick={this.toHistory}>History</button>
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
export default connect(mapStateToProps)(UserPageOrders);
