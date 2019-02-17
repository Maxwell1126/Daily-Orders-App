import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* getNotes(action) {
    try {
        console.log('in getNotes: ', action.payload);

        let response = yield axios.post('/api/notesGet/')
        const notes = { type: 'SET_NOTES', payload: response.data }
        yield put(notes)
    } catch (error) {
        console.log('Error making GET request in getNotes', error);
        alert('there was a problem');
    }
}

function* notesSaga() {
    yield takeLatest('GET_NOTES', getNotes);
}

export default notesSaga;