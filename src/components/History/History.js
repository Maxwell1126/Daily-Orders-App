import React, { Component } from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import axios from 'axios';
class History extends Component {
constructor(){
    super()
    this.state={
        orders:[],
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

    render() {
        return (
            <div>
                <h1>History</h1>
                <input type="date"/>
                <select>
                    {this.state.orders.map((order) => {
                        return (<option>{order.order_name}</option>)
                    })}
                </select>
                <button>Show history</button>
                <br></br>
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
export default connect(mapStateToProps)(History);