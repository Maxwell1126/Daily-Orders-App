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

    upCount = ()=>{
        console.log('this',this);
        
    }

    render() {
        return (
            <div>
                <p>{JSON.stringify(this.state.products)}</p>
                <p>Order Sheet</p>
                {/* <p>{JSON.stringify(this.props)}</p> */}
                <div>{this.state.products.map((product) => {
                    return (<div>{product.product_name} 
                            <button onClick={this.upCount}>+</button>{product.quantity}<button>-</button></div>)
                })}</div>
                <button>Submit</button>
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
const mapStateToProps = state => ({
    user: state.user,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(OrderSheet);