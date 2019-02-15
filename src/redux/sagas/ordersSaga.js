import { put, takeEvery,takeLatest } from 'redux-saga/effects';
import axios from 'axios';
function* getOrders(action) {
    try {
        let response =yield axios.get('/api/dashboard')
        const orders = { type: 'SET_ORDERS', payload: response.data }
        yield put(orders)
    } catch (error) {
        console.log('Error making Get request in getOrders', error);
        alert('there was a problem');
    }
}

function* ordersSaga() {
    yield takeLatest('GET_ORDERS', getOrders);
}

export default ordersSaga;