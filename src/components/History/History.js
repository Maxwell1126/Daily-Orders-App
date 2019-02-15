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

    getOrders = () => {
        const action = { type: 'GET_ORDERS' };
        this.props.dispatch(action);
    }

    getNotes = (event) => {
        const action = { type: 'GET_NOTES', payload:this.state.historyQuery.order}
        this.props.dispatch(action)
    }

    getHistory = (event) => {
        const action = { type: 'POST_HISTORY', payload: this.state.historyQuery }
        this.props.dispatch(action)
        this.getNotes();
    }

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
        let noteHeader;
        let dateHeader;
        let orderHeader;
        if(this.props.reduxStore.notes.length>0){
            noteHeader= <h3>Notes:</h3>;
            dateHeader=<h3>{this.state.historyQuery.date}</h3>
            orderHeader = <h3>{
                this.props.reduxStore.orders.map((order) => {
                    if (order.id == this.state.historyQuery.order) {
                        return (order.order_name)
                    }
                })}</h3>

        }

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
                {noteHeader}
                <ul>
                    {this.props.reduxStore.notes.map((note) => {
                        return <li>{note.note_entry}</li>
                    })}
                </ul>
                <br></br>
                {orderHeader} {dateHeader}
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