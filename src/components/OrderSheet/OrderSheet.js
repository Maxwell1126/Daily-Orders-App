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
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import './OrderSheet.css';
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
            orders: [],
        }
    }

    componentDidMount() {
        this.getProducts();
        this.getNotes();
        this.getOrders();
    }

    getOrders = () => {
        console.log('in get orders');

        let userInfo = {
            id: this.props.reduxStore.user.id,
            orderId: this.props.match.params.id,
            date: this.state.date,
        }
        axios({
            method: 'POST',
            url: '/api/dashboardGet',
            data: userInfo,
        }).then((response) => {
            this.setState({
                orders: response.data
            })
        })

    }
    getProducts = (event) => {
        console.log('in getproducts');
        let personId;
        for (let i = 0; i<this.state.orders.length;i++){
            if(i.order_id==this.props.match.params.id){
                personId=i.person_id
            }
        }
        let orderDetails = {
            id: this.props.match.params.id,
            date: this.state.date,
            person: personId
        }
        axios({
            method: 'POST',
            url: '/api/ordersheet/',
            data: orderDetails,
        }).then((response) => {
            console.log('response.data', response.data);
            
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

    backDay = async (event) => {
        await this.setState({
            date: moment(this.state.date).subtract(1, 'days').format('L'),
        })
        await this.componentDidMount()
        };

    forwardDay = async (event) => {
        await this.setState({
            date: moment(this.state.date).add(1, 'days').format('L'),
        });
        await this.componentDidMount()
    };

    render() {
        let noteContent;
        if (this.state.notes.length > 0) {
            noteContent = <Card><List style={{padding:10}}><h3>Existing Notes:</h3>
                {this.state.notes.map((note) => {
                    return <ListItem>{note.note_entry}</ListItem>
                })}
            </List></Card>
        }

        let addNoteContent;
        let buttons;
        let statusId;
        (this.state.products.map((product) => {
            statusId = product.status_id
            return (product.status_id)
        }))
        if (currentDate <= this.state.date && statusId < 3
            && this.props.reduxStore.user.manager == false) {
            console.log('state date:', this.state.date);
            console.log('status ', statusId);
            console.log('manager', this.props.reduxStore.user.manager);

            addNoteContent =
                <Grid container
                    style={{ padding: 10 }}
                    direction="column"
                    justify="flex-end">
                    <h3>Add Notes:</h3>
                    <TextField variant="outlined" fullWidth onChange={this.setNote} />
                    <Grid container
                    style={{ paddingTop: 10 }}
                    justify="flex-end"
                    direction="row">
                <Button className="addNoteButton" color="default" variant="outlined" 
                    onClick={this.addNote}>Add Note</Button>
                </Grid>
                </Grid>
            buttons = <div><Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"><Button variant="outlined" onClick={this.saveOrder}>Save</Button>
                <Button variant="outlined"  onClick={this.submitOrder}>Submit</Button></Grid></div>
        } else if (currentDate <= this.state.date &&
            this.props.reduxStore.user.manager == true) {
            addNoteContent =
                <Grid container
                    style={{ padding: 10 }}
                    direction="column"
                    justify="flex-end">
                    <h3>Add Notes:</h3>
                    <TextField variant="outlined" fullWidth onChange={this.setNote} />
                    <Grid container
                        style={{ paddingTop: 10 }}
                        justify="flex-end"
                        direction="row">
                        <Button className="addNoteButton" color="default" variant="outlined"
                            onClick={this.addNote}>Add Note</Button>
                    </Grid>
                </Grid>
            buttons = <div><Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"><Button variant="outlined" onClick={this.saveOrder}>Save</Button>
                <Button variant="outlined" onClick={this.approveOrder}>Approve</Button></Grid></div>
        }

        return (
            <div className="main">
            {JSON.stringify(this.state.products)}
            <Grid contianer 
            direction="column"
                justify="flex-start"
                alignItems="center"
                
                >
                    <Card className="dateToggle">
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                >
                        
                    {this.state.orders.map((order) => {
                        
                        if (order.order_id == this.props.match.params.id) {
                            return (<h1>{order.order_name}</h1>)
                        }
                    })}
                </Grid>
                    
                <Grid
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="center">
                    
                            <Fab size="small" onClick={this.backDay}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg></Fab>
                    <h2>{this.state.date}</h2>

                            <Fab size="small" onClick={this.forwardDay}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" /></svg></Fab>
                </Grid>
                </Card >
                    <Card className="dateToggle">
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
                    </Card>
            </Grid>
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