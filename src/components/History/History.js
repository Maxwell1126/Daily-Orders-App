import React, { Component } from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import axios from 'axios';
let orderHeader;
let dateHeader;

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
        notes:[],
    }
}

    componentDidMount() {
        this.getOrders();
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

    getNotes = (event) => {
        let notes = {
            order: this.state.historyQuery.order,
            date: this.state.historyQuery.date,
        }
        axios({
            method: 'POST',
            url: '/api/notesGet',
            data: notes,
        }).then((response) => {
            this.setState({

                ...this.state,
                notes: response.data,
            })
        })
    }

    getHistory = (event) => {
        const action = { type: 'POST_HISTORY', payload: this.state.historyQuery }
        this.props.dispatch(action)
        this.getNotes();
        orderHeader = <h3>{
            this.state.orders.map((order) => {
                if (order.order_id == this.state.historyQuery.order) {
                    return (order.order_name)
                }
            })}</h3>
        dateHeader = <h3>{this.state.historyQuery.date}</h3>
        
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
        if (this.state.notes.length > 0) {
            noteHeader = <h3>Notes:</h3>;
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
                    {this.state.orders.map((order) => {
                        return (<option value={order.order_id}>{order.order_name}</option>)
                    })}
                </select>
                <button onClick={this.getHistory}>Show history</button>
                <br></br>
                {orderHeader} {dateHeader}
                {noteHeader}
                <ul>
                    {this.state.notes.map((note) => {
                        return <li>{note.note_entry}</li>
                    })}
                </ul>
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