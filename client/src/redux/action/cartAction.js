export const saveCart = (cart) => {
    return {
        type: "saveCart",
        payload: cart
    }
}

export const addItemToCart = (item) => {
    return {
        type: "addItemToCart",
        payload: item
    }
}