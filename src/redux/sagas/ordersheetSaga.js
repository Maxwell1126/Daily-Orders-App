import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* postOrderSheet(action) {
    try {
        let response = yield axios.post('/api/dashboard', action.payload)
        const ordersheet = { type: 'SET_ORDERSHEET', payload: response.data }
        yield put(ordersheet)
    } catch (error) {
        console.log('Error making POST request in postOrderSheet', error);
        alert('there was a problem');
    }
}

function* ordersheetSaga() {
    yield takeLatest('POST_ORDERSHEET', postOrderSheet);
}

export default ordersheetSaga;