import { useSelector, useDispatch  } from "react-redux"
import Loading from "react-loading"
import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { saveCart } from "../src/redux/action/cartAction"
import cartAPI from "../src/network/cart"

const Cart = () => {

    // get user from redux
    const cart = useSelector(state => state.cart)

    const [totalCost, setTotalCost] = useState(0)
    const [deletingItemId, setDeletingItemId] = useState(null)

    const dispatch = useDispatch()
    const history = useHistory()

    // qty array
    const qtyArray = []
    for(let i = 0; i < 10; i++)
        qtyArray[i] = i+1

    useEffect(() => {
        const type = localStorage.getItem("type")
        if(type === "customer") {
            let sum = 0
            cart.forEach(item => {
                sum += item.cost*item.amount
            })
            setTotalCost(sum)

        } else if(type === "supplier") {
            history.push("/supplier/home")
        } else {
            history.push("/gateway")
        }
    }, [cart])

    // qty on change
    const qtyOnChange = (index, value) => {
        cart[index].amount = parseInt(value)
        dispatch(saveCart([...cart]))
    }

    // btn delete
    const btnDeleteHandler = async (product_id) => {
        // set pending state
        setDeletingItemId(product_id)

        try {
            const { success, error } = await cartAPI.deleteItem({ product_id }) // delete item in database
            if(success) {
                setDeletingItemId(null)
                const newCart = cart.filter(item => item.product_id !== product_id)
                dispatch(saveCart(newCart)) // save cart in redux store
            } else throw error

        } catch(e) {
            console.log(e);
        }
    }

    // btn proceed to payment
    const btnProceedToPaymentHandler = () => {
        if(cart.length > 0)
            history.push("/checkout")
    }

    return (
        <div className="Cart">
            <div className="items">
                <div className="header">CART</div>
                {cart.map((item, index) => <div className="itemWrapper" key={item.product_id}>
                    <img src={"http://localhost:3000/image/"+item.product_id} alt="img" />
                    <div className="itemInfoWrapper">
                        <div className="name">{item.name}</div>
                        <div className="itemInfoWrapperBottom">
                            <select name="qty" value={item.amount} onChange={(e) => qtyOnChange(index, e.target.value)}>
                                {qtyArray.map((i) => <option key={i} value={i}>{i}</option>)}
                            </select>
                            <div className="cost">{item.cost*item.amount} $</div>
                        </div>
                    </div>
                    <button className="btnDelete iconicBtn" onClick={() => btnDeleteHandler(item.product_id)}>
                        <span>Delete</span>
                        { deletingItemId===item.product_id &&  <Loading type="spin" height="18px" width="18px" className="smallLoading" color="#000000"/> }
                    </button>
                </div> )}
            </div>
            <div className="payment">
                <div className="numberOfItems">Number of items: <span>{cart.length}</span></div>
                <div className="totalCost">Total cost: <span>{totalCost + " $"}</span></div>
                <button className="btnPayment iconicBtn" onClick={btnProceedToPaymentHandler}>Proceed to payment</button>
            </div>
        </div>
    );
}

export default Cart;