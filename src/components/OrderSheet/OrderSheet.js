import React, { Component } from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import axios from 'axios';

class OrderSheet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            products: [],
        }
    }

    componentDidMount() {
        this.getProducts();
    }
    getProducts = (event) => {
        axios.get(`api/ordersheet/${this.props.match.params.id}`).then(response => {
            this.setState({
                ...this.state,
                products: response.data,
            })
        })
    }
    // this could also be written with destructuring parameters as:
    // const UserPage = ({ user }) => (
    // and then instead of `props.user.username` you could use `user.username`
    // this.render
    // 
    render() {
        return (
            <div>

                <p>Order Sheet</p>
                {/* <p>{JSON.stringify(this.props)}</p> */}
                <ul>{this.state.products.map((product) => {
                    console.log('products', this.state.products);
                    
                    return (<li>{product.product_name}</li>)
                })}</ul>
                <LogOutButton className="log-in" />
            </div>
        )
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