import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserPageOrdersClick from './UserPageOrdersClick';
import axios from 'axios';
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
            <div>
                
                <ul>{this.state.orders.map((order) => {
        return (<UserPageOrdersClick key={order.id}order={order} history={this.props.history} getOrders={this.getOrders}/>)
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
export default connect(mapStateToProps)(UserPageOrders);
