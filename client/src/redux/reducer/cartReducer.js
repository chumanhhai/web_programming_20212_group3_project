const cartReducer = (state = [], action) => {
    switch(action.type) {
        case "saveCart": return action.payload
        case "addItemToCart": {
            const newState = state.concat(action.payload)
            return newState
        }
        default: return state
    }
}

export default cartReducer