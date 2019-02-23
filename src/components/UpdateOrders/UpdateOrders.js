import React, { Component } from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import UpdateOrdersProducts from './UpdateOrdersProducts';
import axios from 'axios';
const moment = require('moment');

class UpdateOrders extends Component {

    constructor() {
        super()
        this.state = {
            orders: [],
            selectedOrder: null,
            orderProducts: [],
            allProducts:[],
            people: [],
            oldProduct:null,
            product:null,
            writer:null,
            date: moment().format('L'),
        }
    }

    componentDidMount() {
        this.getOrders();
        this.getPerson();
        this.getOldProduct();
    }

    getOrders = () => {
        console.log('in get orders');

        let userId = { id: this.props.reduxStore.user.id,
                        date: this.state.date }
        axios({
            method: 'GET',
            url: '/api/dashboardGet',
            data: userId,
        }).then((response) => {
            this.setState({
                orders: response.data
            })
        }).catch((error)=>{
            console.log('error in getOrders',error);
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
        }).catch((error)=>{
            console.log('error in getPerson', error);    
        })
    }
    getOldProduct = (event)=>{
        axios({
            method:'GET',
            url:'/api/updateorders/oldproducts',
        }).then((response)=>{
            this.setState({
                allProducts:response.data
            })
        }).catch((error) => {
            console.log('error in selectedOldProduct', error);
        })
    }

    setOldProduct=(event)=>{
        this.setState({
            ...this.state.oldProduct, oldProduct: event.target.value,
        })
    }

    addOldProduct = (event) => {
        console.log('in addOldProduct');
        
        let productToAdd = {
            name: this.state.oldProduct,
            id: this.state.selectedOrder
        }
        axios({
            method: 'POST',
            url: '/api/updateorders/old',
            data: productToAdd
        }).then((response) => {
            this.getProducts();
        }).catch((error) => {
            console.log('error in addProduct', error);
        })
    }

    getProducts = (event) =>{
        let orderId = {id:this.state.selectedOrder}
        axios({
            method: 'POST',
            url: '/api/updateorders/products',
            data: orderId,
        }).then((response)=>{
            this.setState({
                orderProducts:response.data
            })
        }).catch((error)=>{
            console.log('error in getProducts',error);   
        })
    }

    setOrder = (event) => {
        this.setState({
            ...this.state.selectedOrder, selectedOrder: event.target.value,
        }, () => {
            this.getProducts() 
        });
    }

    setWriter = (event)=>{
        this.setState({
            ...this.state.writer, writer:event.target.value,
        })
    }

    updateWriter = (event) =>{
        let writer = {id:this.state.writer,
                        orderId:this.state.selectedOrder}
        axios({
            method:'PUT',
            url:'/api/updateorders',
            data: writer,
        }).then((response)=>{
            this.getProducts();
        }).catch((error)=>{
            console.log('error in updateWriter', error);           
        })
    }

    setProduct = (event) =>{
        this.setState({
            ...this.state.product, product: event.target.value
        })
    }

    addProduct = (event)=>{
        let productToAdd = {name:this.state.product,
                            id:this.state.selectedOrder}
        axios({
            method:'POST',
            url:'/api/updateorders/add',
            data:productToAdd
        }).then((response)=>{
            this.getProducts();
        }).catch((error)=>{
            console.log('error in addProduct',error);    
        })
    }

    render() {
    
        let orderWriterContent;
        let orderHeader;
        let addNewProduct;
        let addOldProduct;
        if (this.state.selectedOrder != null) { 
            orderWriterContent =<div><select onChange={this.setWriter}>
                <option value='' disabled selected > Select a Crew Member</option>
                {this.state.people.map((person) => {
                    return (<option value={person.id}>{person.username}</option>)
                })}
            </select>
            <button onClick={this.updateWriter}>Update Writer</button></div> 

            orderHeader = <h1>Update Order: {this.state.orders.map((order) => {
                if (order.id == this.state.selectedOrder) {
                    return (order.order_name)
                }
            })}</h1>
            addOldProduct=
            <div>
                Add Existing Product 
                <select onChange={this.setOldProduct}>
                    <option value='' disabled selected> Select Product</option>
                    {this.state.allProducts.map((product)=>{
                        return (<option value={product.id}>
                            {product.product_name}</option>)
                    })}
                </select>
                <button onClick={this.addOldProduct}>Add Old Product</button>
            </div>
            addNewProduct=
                <div>Add New Product <input type="text" placeholder="product name" 
                        onChange={this.setProduct}/>
                <button onClick={this.addProduct}>Add Product</button> </div>
        }else{
            orderHeader = <h1>Update Orders</h1>
        }
        let currentWriter;
        if (this.state.orderProducts.length>0){
            currentWriter = <h3>Current Writer: {this.state.orderProducts[0].username}</h3>
        }
        return (
            <div>
                {orderHeader}
                
                {JSON.stringify(this.state.oldProduct)}
                {JSON.stringify(this.state.selectedOrder)}
                {/* <p>{JSON.stringify(this.state.historyQuery)}</p>
                <p>{JSON.stringify(this.state.products)}</p> */}
                {/* <p>{JSON.stringify(this.props.reduxStore.products)}</p> */}
                <select onChange={this.setOrder}>
                    <option value="" disabled selected>Select an Order</option>
                    {this.state.orders.map((order) => {
                        return (<option value={order.id}>{order.order_name}</option>)
                    })}
                </select>
                {/* <button onClick={this.getHistory}>Show history</button> */}
                <br></br>
                
                <br></br>
                {orderWriterContent}
                <br></br>
                {currentWriter}
                <br></br>
                <ul>
                    {this.state.orderProducts.map((product) => {
                    return (<UpdateOrdersProducts 
                    getProducts={this.getProducts} product={product}/>)
                })}</ul>
                {addOldProduct}
                {addNewProduct}
                <br></br>
            </div>
        )
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(UpdateOrders);