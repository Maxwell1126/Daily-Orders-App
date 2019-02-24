import React, { Component } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Card from '@material-ui/core/Card';
import './OrderSheetItem.css'
class OrderSheet extends Component {
    componentDidMount() {
        this.props.getProducts();
    }
    // this could also be written with destructuring parameters as:
    // const UserPage = ({ user }) => (
    // and then instead of `props.user.username` you could use `user.username`
    // this.render
    // 

    upCount = () => {
        this.props.upQuantity(this.props.i)
    }
    downCount = () => {
        this.props.downQuantity(this.props.i)
    }

    render() {

        let productContent;
        if (this.props.currentDate > this.props.date
            || (this.props.statusId >= 3 && this.props.manager == false)) {
            productContent = <Grid
                container
                style={{ padding: 20 }}
                direction="column"
                justify="space-between"
                alignItems="space-between">
                <TableRow><Grid
                    container
                    style={{ padding: 20 }}
                    direction="row"
                    justify="space-between"
                    alignItems="space-between">
                    <TableCell><h4 >{this.props.product.product_name}</h4></TableCell>
                    <TableCell><h4 >{this.props.product.quantity}</h4></TableCell>
                    </Grid>
                </TableRow>
            </Grid>

        } else {
            productContent = <Grid container

                direction="row"
                justify="space-evenly"
                alignItems="center"><h4 className="prodName">
                    {this.props.product.product_name}</h4>
                <div className="buttonQuantity">
                    <Grid container

                        direction="row"
                        justify="space-evenly"
                        alignItems="center">< Fab variant="outlined" size="small" onClick={this.downCount} >-</Fab >
                        <h4>{this.props.product.quantity}</h4>
                        < Fab variant="outlined" size="small" onClick={this.upCount} >+</Fab ></Grid> </div></Grid>
        }
        return (<Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            style={{ padding: 10 }}
        >
            {productContent}</Grid>)
    }
}
// Instead of taking everything from state, we just want the user info.
// if you wanted you could write this code like this:
// const mapStateToProps = ({user}) => ({ user });
const mapStateToProps = state => ({
    user: state.user,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(OrderSheet);