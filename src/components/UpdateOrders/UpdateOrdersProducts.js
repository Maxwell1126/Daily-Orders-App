import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
class UpdateOrdersProducts extends Component {

    deleteProduct = () => {
        axios({
            method: 'DELETE',
            url: `/api/updateorders/${this.props.product.id}`
        }).then((response) => {
            this.props.getProducts();
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {

        return (
            <li>
                {JSON.stringify(this.props.product.id)}
                {this.props.product.product_name}
                {<button onClick={this.deleteProduct}>Delete</button>}
            </li>)
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore,
})

export default connect(mapStateToProps)(UpdateOrdersProducts);