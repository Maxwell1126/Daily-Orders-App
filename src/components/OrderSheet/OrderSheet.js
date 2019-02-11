import React, { Component } from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import axios from 'axios';

class OrderSheet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orders: [],
        }
    }

    componentDidMount() {
        this.getOrders();
    }
    getOrders = (event) => {
        axios.get('api/dashboard').then(response => {
            this.setState({
                ...this.state,
                orders: response.data,
            })
        })
    }
    // this could also be written with destructuring parameters as:
    // const UserPage = ({ user }) => (
    // and then instead of `props.user.username` you could use `user.username`
    // this.render
    // 
    render() {
        return (
            <div>
                <p>Order Sheet</p>
                {/* <h1 id="welcome">
                    Welcome, {this.props.user.username}!
     </h1>
                <p>Your Orders:</p>
                <p>{this.state.orders.map((order) => {
                    return (order.order_name)
                })}</p> */}
                <LogOutButton className="log-in" />
            </div>
        )
    }
}
// Instead of taking everything from state, we just want the user info.
// if you wanted you could write this code like this:
// const mapStateToProps = ({user}) => ({ user });
const mapStateToProps = state => ({
    user: state.user,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(OrderSheet);