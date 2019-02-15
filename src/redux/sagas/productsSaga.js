import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* postHistory(action) {
    try {
        console.log('in postHistory: ');
        
       let response= yield axios.post('/api/history', action.payload)
        const products = {type: 'SET_PRODUCTS', payload: response.data }
        yield put(products)
    } catch (error) {
        console.log('Error making POST request in postHistory', error);
        alert('there was a problem');
    }
}

function* productsSaga() {
    yield takeLatest('POST_HISTORY', postHistory);
}

export default productsSaga;