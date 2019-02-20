import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import OrderSheetItem from './OrderSheetItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
const moment = require('moment');
const currentDate = moment().format('L')

class OrderSheet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            products: [],
            notes: [],
            note: '',
            date: moment().format('L'),
            orders:[],
        }
    }

    componentDidMount() {
        this.getProducts();
        this.getNotes();
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

    }
    getProducts = (event) => {
        console.log('in getproducts');
        let orderDetails = {
            id: this.props.match.params.id,
            date: this.state.date,
            person: this.props.reduxStore.user.id
        }
        axios({
            method: 'POST',
            url: '/api/ordersheet/',
            data: orderDetails,
        }).then((response) => {;
            this.setState({
                products: response.data,
            })
        })
    }

    getNotes = (event) => {
        console.log('in get notes');
        
        let note = {
            order: this.props.match.params.id,
            date: this.state.date,
        }
        axios({
            method: 'POST',
            url: '/api/notesGet',
            data: note,
        }).then((response) => {
            this.setState({
                notes: response.data
            })
        })
    }
    approveOrder = (event) => {
        let products = {
            products: this.state.products,
            id: this.props.match.params.id,
            date: this.state.date,
            button: 'approve',
        }
        axios({
            method: 'PUT',
            url: '/api/ordersheet',
            data: products,
        }).then((response) => {
            this.getProducts();
            alert('Order Approved.')
            this.props.history.push('/home')
        }).catch((error) => {
            console.log('error on client putting orders', error);

        })
    }

    saveOrder = (event) => {
        let products = {
            products: this.state.products,
            id: this.props.match.params.id,
            date: this.state.date,
            button: 'save',
        }
        axios({
            method: 'PUT',
            url: '/api/ordersheet',
            data: products,
        }).then((response) => {
            alert('Order Saved. Remember to Submit.')
            this.getProducts();
        }).catch((error) => {
            console.log('error on client putting orders', error);
        })
    }

    submitOrder = (event) => {
        let products = {
            products: this.state.products,
            id: this.props.match.params.id,
            date: this.state.date,
            button: 'submit',
        }
        axios({
            method: 'PUT',
            url: '/api/ordersheet',
            data: products,
        }).then((response) => {
            alert('Succesfully Submitted Order!')
            this.getProducts();
            this.props.history.push('/home')
        }).catch((error) => {
            console.log('error on client putting orders', error);

        })
    }

    setNote = (event) => {
        this.setState({
            note: {
                ...this.state.notes,
                note: event.target.value,
            }
        })
    }

    addNote = (event) => {
        let note = {
            id: this.props.match.params.id,
            note: this.state.note.note,
            date: this.state.date,
        }
        axios({
            method: 'POST',
            url: '/api/notesAdd',
            data: note,
        }).then((response) => {
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
        productsCopy[i].quantity++;
        this.setState({
            products: productsCopy
        })
    }

    downQuantity = (i) => {
        //Credit for this function belongs to Dereje1 from this link:
        //https://www.freecodecamp.org/forum/t/reactjs-using-setstate-to-update-a-single-property-on-an-object/146772
        if (this.state.products[i].quantity !== 0) {
            let productsCopy = JSON.parse(JSON.stringify(this.state.products))
            productsCopy[i].quantity--;
            this.setState({
                products: productsCopy
            })
        }
    }

    backDay = (event) => {
        this.setState({
            date: moment(this.state.date).subtract(1, 'days').format('L'),
        }, () => {
            this.getOrders()
            this.getProducts()
            this.getNotes()
        });
    }

    forwardDay = async (event) => {
        await this.setState({
            date: moment(this.state.date).add(1, 'days').format('L'),
        })
        await this.getOrders()
              this.getProducts()
              this.getNotes()
        };

    render() {
        let noteHeader;
        let noteContent;
        if (this.state.notes.length > 0) {
            noteHeader = <h3>Existing Notes:</h3>;
            noteContent = <List>
                {this.state.notes.map((note) => {
                    return <ListItem>{note.note_entry}</ListItem>
                })}
            </List>
        }

        let addNoteContent;
        let buttons;
        let statusId;
        (this.state.products.map((product) => {
                statusId=product.status_id
                return (product.status_id)
        }))
        if (currentDate <= this.state.date && statusId < 3
            && this.props.reduxStore.user.manager == false) {
                console.log('state date:',this.state.date);
                console.log('status ', statusId);
            console.log('manager', this.props.reduxStore.user.manager);
                
            addNoteContent = <div><h3>Add Notes:</h3>
                <textarea onChange={this.setNote}></textarea>
                <button onClick={this.addNote}>Add Note</button></div>
            buttons = <div><button id="save" onClick={this.saveOrder}>Save</button>
                <button id="submit" onClick={this.submitOrder}>Submit</button></div>
        } else if (currentDate <= this.state.date &&
            this.props.reduxStore.user.manager == true) {
            addNoteContent = <div><h3>Add Notes:</h3>
                <textarea onChange={this.setNote}></textarea>
                <button onClick={this.addNote}>Add Note</button></div>
            buttons = <div><button id="save" onClick={this.saveOrder}>Save</button>
                <button id="submit" onClick={this.approveOrder}>Approve</button></div>
        }

        return (
            <div>
                {this.state.orders.map((order) => {
                    if (order.id == this.props.match.params.id) {
                        return (<h1>{order.order_name}</h1>)
                    }
                })}
                <button onClick={this.backDay}>-</button><h2>{this.state.date}</h2><button onClick={this.forwardDay}>+</button>
                {noteHeader}
                {noteContent}
                {addNoteContent}
                <div>{this.state.products.map((product, i) => {
                    return (<OrderSheetItem
                        manager={this.props.reduxStore.user.manager}
                        statusId={statusId}
                        currentDate={currentDate}
                        date={this.state.date}
                        history={this.props.history}
                        product={product}
                        i={i}
                        upQuantity={this.upQuantity}
                        downQuantity={this.downQuantity}
                        getProducts={this.getProducts} />)
                })}</div>
                {buttons}
                <br></br>
                <br></br>
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