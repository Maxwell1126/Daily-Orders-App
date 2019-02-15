import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* getProducts(action) {
    try {
        let response = yield axios.get(`api/ordersheet/${this.props.match.params.id}`)
        const products = { type: 'SET_PRODUCTS', payload: response.data }
        yield put(products)
    } catch (error) {
        console.log('Error making GET request in getProducts', error);
        alert('there was a problem');
    }
}

function* productsSaga() {
    yield takeLatest('GET_PRODUCTS', getProducts);
}

export default productsSaga;