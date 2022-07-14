import { createStore, combineReducers } from "redux"
import allProductsReducer from "./reducer/allProductsReducer"
import userReducer from "./reducer/userReducer"
import cartReducer from "./reducer/cartReducer"

const store = createStore(combineReducers({
    allProducts: allProductsReducer,
    user: userReducer,
    cart: cartReducer
}))

// store.subscribe(() => console.log("Store is created."))

export default store