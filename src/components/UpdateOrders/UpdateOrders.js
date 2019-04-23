import React, { Component } from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import UpdateOrdersProducts from './UpdateOrdersProducts';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

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
            url: '/api/orders',
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
        let buttonStatus;
        let oldProductStatus;
        let productStatus;
        if(this.state.writer==null){
            buttonStatus=true
        }
        if (this.state.oldProduct == null) {
            oldProductStatus = true
        }
        if (this.state.product == null) {
            productStatus = true
        }
        if (this.state.selectedOrder != null) { 
            orderWriterContent =<div><select onChange={this.setWriter}>
                <option value='' disabled selected > Select a Crew Member</option>
                {this.state.people.map((person) => {
                    return (<option value={person.id}>{person.username}</option>)
                })}
            </select>
            <button disabled={buttonStatus} onClick={this.updateWriter}>Update Writer</button></div> 

            orderHeader = <h1>Update Order: {this.state.orders.map((order) => {
                if (order.id == this.state.selectedOrder) {
                    return (order.order_name)
                }
            })}</h1>
            addOldProduct=
                <Grid
                    container
                    style={{ padding: 20 }}
                    direction="column"
                    justify="space-between"
                    alignItems="space-between">
                Add Existing Product 
                <Grid
                    container
                    style={{ paddingTop: 10 }}
                    direction="column"
                    justify="space-between"
                    alignItems="space-between">
                <select onChange={this.setOldProduct}>
                    <option value='' disabled selected> Select Product</option>
                    {this.state.allProducts.map((product)=>{
                        return (<option value={product.id}>
                            {product.product_name}</option>)
                    })}
                </select>
                </Grid>
                <Grid
                    container
                    style={{ paddingTop: 10 }}
                    direction="column"
                    justify="space-between"
                    alignItems="space-between">
                <Button variant="outlined"disabled={oldProductStatus} onClick={this.addOldProduct}>Add Old Product</Button>
            </Grid></Grid>
            addNewProduct=
                <Grid
                    container
                    style={{ padding: 20 }}
                    direction="column"
                    justify="space-between"
                    alignItems="space-between">
                    Add New Product <input type="text" placeholder="product name" 
                    onChange={this.setProduct} /><Grid
                        container
                        style={{ paddingTop: 10 }}
                        direction="column"
                        justify="space-between"
                        alignItems="space-between">
                <Button variant="outlined"disabled={productStatus} onClick={this.addProduct}>Add Product</Button></Grid> </Grid>
        }else{
            orderHeader = <h1>Update Orders</h1>
        }
        let currentWriter;
        if (this.state.orderProducts.length>0){
            currentWriter = <h3>Current Writer: {this.state.orderProducts[0].username}</h3>
        }
        return (
            <div>
                <Grid contianer
                    direction="column"
                    justify="flex-start"
                    alignItems="center">
                    <Card className="dateToggle">
                        <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="center"
                        >
                {orderHeader}
                
                <select onChange={this.setOrder}>
                    <option value="" disabled selected>Select an Order</option>
                    {this.state.orders.map((order) => {
                        return (<option value={order.id}>{order.order_name}</option>)
                    })}
                </select>

                {orderWriterContent}

                {currentWriter}
                        </Grid>
                        <Grid
                            container
                            style={{ padding: 20 }}
                            direction="column"
                            justify="space-between"
                            alignItems="space-between">
                           
                            
                    {this.state.orderProducts.map((product) => {
                    return (<UpdateOrdersProducts 
                    getProducts={this.getProducts} product={product}/>)
                    })}
                        </Grid>
                        
                {addOldProduct}
                {addNewProduct}
   
                </Card>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(UpdateOrders);