import React, { Component } from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import axios from 'axios';
let orderHeader;
let dateHeader;

class UpdateOrders extends Component {

    constructor() {
        super()
        this.state = {
            orders: [],
            order: null,
            products: [],
        }
    }

    componentDidMount() {
        this.getOrders();
    }

    getOrders = () => {
        const action = { type: 'GET_ORDERS' };
        this.props.dispatch(action);
    }

    getHistory = (event) => {
        const action = { type: 'POST_HISTORY', payload: this.state.historyQuery }
        this.props.dispatch(action)
        this.getNotes();
        orderHeader = <h3>{
            this.props.reduxStore.orders.map((order) => {
                if (order.id == this.state.historyQuery.order) {
                    return (order.order_name)
                }
            })}</h3>
        dateHeader = <h3>{this.state.historyQuery.date}</h3>

    }

    setOrder = (event) => {
        this.setState({
            ...this.state.order, order: event.target.value,
        })
        console.log('order', this.state.order);
    }

    render() {
        return (
            <div>
                <h1>Update Orders</h1>
                
                
                {/* <p>{JSON.stringify(this.state.historyQuery)}</p>
                <p>{JSON.stringify(this.state.products)}</p> */}
                {/* <p>{JSON.stringify(this.props.reduxStore.products)}</p> */}
                <select onChange={this.setOrder}>
                    <option value="" disabled selected>Select an Order</option>
                    {this.props.reduxStore.orders.map((order) => {
                        return (<option value={order.id}>{order.order_name}</option>)
                    })}
                </select>
                {/* <button onClick={this.getHistory}>Show history</button> */}
                <br></br>
                {orderHeader}
                <br></br>

                <div>{this.props.reduxStore.products.map((product) => {
                    return <div>{product.product_name} {product.quantity}</div>
                })}</div>
                <br></br>
                <LogOutButton className="log-in" />
            </div>
        )
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(UpdateOrders);