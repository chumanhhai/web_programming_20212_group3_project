const allProductsReducer = (state = [], action) => {
    switch(action.type) {
        case "saveAllProducts": return action.payload

        default: return state
    }
}

export default allProductsReducer