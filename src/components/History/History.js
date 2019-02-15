import React, { Component } from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import axios from 'axios';
class History extends Component {
constructor(){
    super()
    this.state={
        orders:[],
        historyQuery:{
            date:null,
            order:null,
        },
        products:[],
    }
}
    componentDidMount() {
        this.getOrders();
    }
    // getOrders = (event) => {
    //     axios.get('/api/dashboard').then(response => {
    //         this.setState({
    //             ...this.state.orders,
    //             orders: response.data,
    //         })
    //     })
    // }

    getOrders = () => {
        const action = { type: 'GET_ORDERS' };
        this.props.dispatch(action);
    }

    getHistory = (event) => {
        const action = { type: 'POST_HISTORY', payload: this.state.historyQuery }
        this.props.dispatch(action)
    }

    // getHistory = (event) => {
    //     axios({
    //             method:'POST',
    //             url:'/api/history',
    //             data:this.state.historyQuery,
    //          }).then(response => {
    //         this.setState({
    //             ...this.state.products,
    //             products: response.data,
    //         })
    //     })
    // }

    setOrder = (event) => {
        this.setState({
            historyQuery: {
                ...this.state.historyQuery,
                order: event.target.value,
            }
        })
    }

    setDate = (event) => {
        this.setState({
            historyQuery: {
                ...this.state.historyQuery,
                date: event.target.value,
            }
        })
    }

    render() {
        return (
            <div>
                <h1>History</h1>
                {/* <p>{JSON.stringify(this.state.historyQuery)}</p>
                <p>{JSON.stringify(this.state.products)}</p> */}
                {/* <p>{JSON.stringify(this.props.reduxStore.products)}</p> */}
                <input type="date" onChange={this.setDate}/>
                <select onChange={this.setOrder}>
                    <option value="" disabled selected>Select an Order</option>
                    {this.props.reduxStore.orders.map((order) => {
                        return (<option value={order.id}>{order.order_name}</option>)
                    })}
                </select>
                <button onClick={this.getHistory}>Show history</button>
                <br></br>
                <div>{this.props.reduxStore.products.map((product)=>{
                    return<div>{product.product_name} {product.quantity}</div>
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
export default connect(mapStateToProps)(History);