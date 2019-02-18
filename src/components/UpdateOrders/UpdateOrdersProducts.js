import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
class UpdateOrdersProducts extends Component {

    getProjects = () => {
        const action = { type: 'FETCH_PROJECTS' };
        this.props.dispatch(action);
    }

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
                {this.props.product.product_name}
                {<button onClick={this.deleteProduct}>Delete</button>}
            </li>)
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore,
})

export default connect(mapStateToProps)(UpdateOrdersProducts);