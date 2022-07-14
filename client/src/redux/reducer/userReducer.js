const userReducer = (state = null, action) => {
    switch(action.type) {
        case "saveUser": return action.payload
        
        default: return state
    }
}

export default userReducer