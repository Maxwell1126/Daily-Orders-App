import React, { Component } from 'react';
import { connect } from 'react-redux';
// import OrderSheet from '../OrderSheet/OrderSheet';
import axios from 'axios';
const moment = require('moment');
moment().format();

class UserPageOrders extends Component {

    componentDidMount() {
        this.props.getOrders();
    }
    // toOrderSheet = (event) => {
    //     let data= {
    //         id: this.props.order.id,
    //             person: this.props.user.id
    //     }
    //     const action = { type: 'POST_ORDERSHEET', payload: data }
    //     this.props.dispatch(action);
    //     this.props.history.push(`/home/${this.props.order.id}`);
    // }

    toOrderSheet = (event) => {
        axios({
            method:'POST',
            url:'/api/dashboardPost',
            data:{
                id:this.props.order.order_id,
                person:this.props.user.id
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
        let orderContent;
        if(this.props.user.manager==true){
            orderContent = <li onClick={this.toOrderSheet}>
                {/* {JSON.stringify(this.props.order)} */}
                            {this.props.order.order_name}
                            {this.props.order.username}</li>
        }else{
            orderContent = <li onClick={this.toOrderSheet}>
                {JSON.stringify(this.props.order)}
                            {this.props.order.order_name}</li>
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