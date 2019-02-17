import React, { Component } from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import axios from 'axios';
import OrderSheetItem from './OrderSheetItem';
const moment = require('moment');
// moment().format();
let myDate = moment().format('L');
class OrderSheet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            products: [],
            notes: [],
            note:'',
            date: moment().format('L'),
        }
    }

    componentDidMount() {
        this.getProducts();
        this.getNotes();
        this.getOrders();
    }
    
    // getProducts = () => {
    //     const action = { type: 'GET_PRODUCTS' };
    //     this.props.dispatch(action);
    // }
    getOrders = () => {
        const action = { type: 'GET_ORDERS' };
        this.props.dispatch(action);
    }
    getProducts = (event) => {
        axios.get(`api/ordersheet/${this.props.match.params.id}`).then(response => {
            this.setState({
                
                ...this.state.products,
                products: response.data,
            })
        })
    }
    getNotes = (event) => {
        let note = {
            order: this.props.match.params.id,
            date: this.state.date,
        }
        axios({
            method: 'POST',
            url: '/api/notesGet',
            data: note,
        }).then((response) => {
            console.log('response.data', response.data);
            this.setState({ 
                notes:response.data
            })
        })
    }

    saveOrder = (event) => {
        let products = {
            products: this.state.products,
            id: this.props.match.params.id,
            button: 'save',
        }
        axios({
            method: 'PUT',
            url: '/api/ordersheet',
            data: products,
        }).then((response) => {
            this.getProducts();
        }).catch((error) => {
            console.log('error on client putting orders', error);

        })
    }

    submitOrder = (event) =>{
        let products={
            products:this.state.products,
            id:this.props.match.params.id,
            button: 'submit',
        }
        axios({
            method:'PUT',
            url: '/api/ordersheet',
            data:products,
        }).then((response) =>{
            this.getProducts();
        }).catch((error)=>{
            console.log('error on client putting orders', error);
            
        })
    }

    setNote = (event) => {
        console.log('note:',this.state.note.note);
        
        this.setState({
            note: {
                ...this.state.notes,
                note: event.target.value,
            }
        })
    }

    addNote = (event) =>{
        let note={
            id: this.props.match.params.id,
            note: this.state.note.note,
            date: this.state.date,}
        axios({
            method:'POST',
            url:'/api/notesAdd',
            data: note,
        }).then((response)=>{
            this.getNotes()
        })
    }
    // this could also be written with destructuring parameters as:
    // const UserPage = ({ user }) => (
    // and then instead of `props.user.username` you could use `user.username`
    // this.render
    // 
    upQuantity = i => {
        //Credit for this function belongs to Dereje1 from this link:
        //https://www.freecodecamp.org/forum/t/reactjs-using-setstate-to-update-a-single-property-on-an-object/146772
        let productsCopy = JSON.parse(JSON.stringify(this.state.products))
        productsCopy[i].quantity ++;
            this.setState({
                products: productsCopy
            })
        }

    downQuantity = (i) => {
        //Credit for this function belongs to Dereje1 from this link:
        //https://www.freecodecamp.org/forum/t/reactjs-using-setstate-to-update-a-single-property-on-an-object/146772
        if(this.state.products[i].quantity!==0){
        let productsCopy = JSON.parse(JSON.stringify(this.state.products))
        productsCopy[i].quantity--;
        this.setState({
            products: productsCopy
        })
    }
    }
  
    backDay = (event)=>{
        console.log('in backDay', myDate);
        this.setState({
            date: moment(this.state.date).subtract(1, 'days').format('L'),
        });
        // myDate.subtract(1, 'days').format('L');
    }

    forwardDay = (event) => {
        console.log('in forwardDay', myDate);
        this.setState({
            date: moment(this.state.date).add(1, 'days').format('L'),
        });
        // myDate.subtract(1, 'days').format('L');
    }

    render() {
        let noteHeader;
        if (this.state.notes.length > 0) {
            noteHeader = <h3>Existing Notes:</h3>;
        }
        return (
            <div>
                
                {/* <p>{JSON.stringify(this.props)}</p> */}
                {/* {<p>{JSON.stringify(this.props.reduxStore.orders)}</p>} */}
                {/* <p>{JSON.stringify(this.state.notes)}</p> */}
                {/* <h1>{JSON.stringify(this.props.reduxStore.orders)}</h1> */}
                {this.props.reduxStore.orders.map((order) => {
                    if (order.id == this.props.match.params.id) {
                        return (<h1>{order.order_name}</h1>)
                    }
                })}
                <button onClick={this.backDay}>-</button><h2>{this.state.date}</h2><button onClick={this.forwardDay}>+</button>
                {/* <p>{JSON.stringify(this.props)}</p> */}
                {noteHeader}
                <ul>
                    {this.state.notes.map((note)=>{
                        return <li>{note.note_entry}</li>
                    })}
                </ul>
                <h3>Add Notes:</h3>
                <textarea onChange={this.setNote}></textarea>
                <button onClick={this.addNote}>Add Note</button>
                <div>{this.state.products.map((product, i) => {
                    //console.log('product',product);
                    return (<OrderSheetItem
                        history={this.props.history}
                        product={product}
                        i={i}
                        upQuantity={this.upQuantity}
                        downQuantity={this.downQuantity}
                        getProducts={this.getProducts}/>)
                })}</div>
                <button id="save" onClick={this.saveOrder}>Save</button>
                <button id="submit" onClick={this.submitOrder}>Submit</button>
                <br></br>
                <br></br>
                <LogOutButton className="log-in" />
            </div>
        )
    }
}
// Instead of taking everything from state, we just want the user info.
// if you wanted you could write this code like this:
// const mapStateToProps = ({user}) => ({ user });
const mapStateToProps = reduxStore => ({
    reduxStore,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(OrderSheet);