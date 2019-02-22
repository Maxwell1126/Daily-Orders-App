import React, { Component } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
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
            || (this.props.statusId>=3 && this.props.manager==false)) {
            productContent = <Grid container
                direction="row"
                justify="space-evenly"
                alignItems="center"><h4>{this.props.product.product_name}</h4>
                <h4>{this.props.product.quantity}</h4></Grid>
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
                    alignItems="center">< button onClick = { this.upCount } > +</button >
                <h4>{this.props.product.quantity}</h4>
                        < button onClick={this.downCount} > -</button ></Grid> </div></Grid>
        }
        return (<div>
            {productContent}</div>)
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