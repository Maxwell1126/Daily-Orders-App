const orders = (state = [], action) => {
    switch (action.type) {
        case 'SET_ORDERS':
            return action.payload;
        default:
            return state;
    }
}


export default orders;