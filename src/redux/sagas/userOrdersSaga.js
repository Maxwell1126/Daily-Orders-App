import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
function* getUserOrders(action) {
    try {
        let response =yield axios.post('/api/dashboardGet',action.payload)
        console.log('order saga:', action.payload);
        const orders = { type: 'SET_USER_ORDERS', payload: response.data }
        yield put(orders)
    } catch (error) {
        console.log('Error making Get request in getOrders', error);
        alert('there was a problem');
    }
}

function* userOrdersSaga() {
    yield takeLatest('GET_USER_ORDERS', getUserOrders);
}

export default userOrdersSaga;