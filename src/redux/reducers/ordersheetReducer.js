const ordersheet = (state = [], action) => {
    switch (action.type) {
        case 'SET_ORDERSHEET':
            return action.payload;
        default:
            return state;
    }
}


export default ordersheet;