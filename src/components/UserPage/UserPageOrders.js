import React, { Component } from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
// import OrderSheet from '../OrderSheet/OrderSheet';
// import axios from 'axios';

class UserPageOrders extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.getOrders();
    }

    toOrderSheet = (event) => {
        this.props.history.push(`/home/:${this.props.order.id}`)
        console.log('stuff', this.props.order.id);

    }
    // this could also be written with destructuring parameters as:
    // const UserPage = ({ user }) => (
    // and then instead of `props.user.username` you could use `user.username`
    // this.render
    // 
    render() {
        
        return (<li onClick={this.toOrderSheet}>{JSON.stringify(this.props.order.id)}{this.props.order.order_name}</li>)
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