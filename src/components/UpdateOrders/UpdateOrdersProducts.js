import React, { Component } from 'react';
import { connect } from 'react-redux';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
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
            <TableRow><Grid
                container
                style={{ padding: 20 }}
                direction="row"
                justify="space-between"
                alignItems="space-between">
            <TableCell>
                {this.props.product.product_name}
            </TableCell>
                <TableCell>
                {<Button variant="outlined"onClick={this.deleteProduct}
                        >Delete</Button>}
            </TableCell>
            </Grid>
            </TableRow>)
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore,
})

export default connect(mapStateToProps)(UpdateOrdersProducts);