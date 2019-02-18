import React, { Component } from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import axios from 'axios';
let orderHeader;

class UpdateOrders extends Component {

    constructor() {
        super()
        this.state = {
            orders: [],
            selectedOrder: null,
            products: [],
            people: [],
        }
    }

    componentDidMount() {
        this.getOrders();
        this.getPerson();
    }

    getOrders = () => {
        console.log('in get orders');

        let userId = { id: this.props.reduxStore.user.id }
        axios({
            method: 'POST',
            url: '/api/dashboardGet',
            data: userId,
        }).then((response) => {
            this.setState({
                orders: response.data
            })
        })

        // const action = { type: 'GET_ORDERS', payload:id};
        // this.props.dispatch(action);
    }

    getPerson = (event)=>{
        axios({
            method:'GET',
            url:'/api/updateorders',
        }).then((response)=>{
            this.setState({
                people:response.data
            })
        })
    }

    setOrder = (event) => {
        this.setState({
            ...this.state.selectedOrder, selectedOrder: event.target.value,
        })
    }

    render() {
        orderHeader = <h3>{
            this.state.orders.map((order) => {
                if (order.order_id == this.state.order) {
                    return (order.order_name)
                }
            })}</h3>
        let orderWriterContent;
        if (this.state.selectedOrder != null) {
            orderWriterContent = <select onChange={this.setOrder}>
                <option value='' disabled selected > Select a Crew Member</option>
                {this.state.people.map((person) => {
                    return (<option value={person.id}>{person.username}</option>)
                })}
            </select>
        }
        return (
            <div>
                <h1>Update Orders</h1>

                {JSON.stringify(this.state.orders)}
                {/* <p>{JSON.stringify(this.state.historyQuery)}</p>
                <p>{JSON.stringify(this.state.products)}</p> */}
                {/* <p>{JSON.stringify(this.props.reduxStore.products)}</p> */}
                <select onChange={this.setOrder}>
                    <option value="" disabled selected>Select an Order</option>
                    {this.state.orders.map((order) => {
                        return (<option value={order.order_id}>{order.order_name}</option>)
                    })}
                </select>
                {/* <button onClick={this.getHistory}>Show history</button> */}
                <br></br>
                {orderHeader}
                <br></br>
                    {orderWriterContent}
                <div>{this.state.products.map((product) => {
                    return <div>{product.product_name}</div>
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