import React, { Component } from 'react';
import { connect } from 'react-redux';
// import OrderSheet from '../OrderSheet/OrderSheet';
import axios from 'axios';

class UserPageOrders extends Component {

    componentDidMount() {
        this.props.getOrders();
    }

    toOrderSheet = (event) => {
        axios({
            method:'POST',
            url:'/api/dashboard',
            data:{
                id:this.props.order.id,
                person:this.props.user.id
            }
        }).then((response)=>{
            this.props.history.push(`/home/${this.props.order.id}`)
        })
    }
    // this could also be written with destructuring parameters as:
    // const UserPage = ({ user }) => (
    // and then instead of `props.user.username` you could use `user.username`
    // this.render
    // 
    render() {
        
        return (<li onClick={this.toOrderSheet}>{this.props.order.order_name}</li>)
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