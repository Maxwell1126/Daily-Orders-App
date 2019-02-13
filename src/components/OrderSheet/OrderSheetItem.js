import React, { Component } from 'react';
import { connect } from 'react-redux';

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
        return (<div>{this.props.product.product_name}
            <button onClick={this.upCount}>+</button>
            {this.props.product.quantity}
            <button onClick={this.downCount}>-</button></div>)
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