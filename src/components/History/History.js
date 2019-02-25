import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import { Menu } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
const moment = require('moment');
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
        date: moment().format('L'),
    }
}

    componentDidMount() {
        this.getOrders();
    }

    getOrders = () => {
        console.log('in get orders');

        let userId = { id: this.props.reduxStore.user.id,
                       date: this.state.date, }
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
                <h1>History</h1>
                </Grid>
                <h3>Date</h3>
                <TextField type="date" variant="outlined" fullWidth onChange={this.setDate}/>
                <h3>Order</h3>
                        <FormControl fullWidth>
                            {/* <InputLabel >Order Name</InputLabel> */}
                            <select onChange={this.setOrder}>
                            {/* // input={ */}
                            {/* //     <OutlinedInput */}
                            {/* //         labelWidth={85}
                            //         name="Order Name"
                            //     />}   */}
                                
                                <option value='' disable selected> Select an Order</option>
                    {this.state.orders.map((order) => {
                        return (<option value={order.order_id}>{order.order_name}</option>)
                    })}
                </select>
                        </FormControl>
                        <Grid container
                            style={{ paddingTop: 10 }}
                            justify="flex-end"
                            direction="row">
                <Button variant="outlined"onClick={this.getHistory}>Show history</Button>
                        </Grid>
                        <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="center"
                        >
                {orderHeader} {dateHeader}
                        </Grid>  
                {noteHeader}
                <List>
                    {this.state.notes.map((note) => {
                        return <ListItem>{note.note_entry}</ListItem>
                    })}
                </List>
                        
                            
                        
                    <Grid
                        container
                        style={{ padding: 20 }}
                        direction="column"
                        justify="space-between"
                        alignItems="space-between">{this.props.reduxStore.products.map((product)=>{
                            return <TableRow><Grid
                                container
                                style={{ padding: 20 }}
                                direction="row"
                                justify="space-between"
                                alignItems="space-between">
                                <TableCell><h4 >{product.product_name}</h4></TableCell>
                                <TableCell><h4 >{product.quantity}</h4></TableCell>
                            </Grid>
                            </TableRow>
                        })}</Grid>
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
export default connect(mapStateToProps)(History);