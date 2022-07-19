import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Loading from "react-loading"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import { v4 as uuid } from "uuid"
import orderAPI from "../src/network/order"
import { saveCart } from "../src/redux/action/cartAction"

const Checkout = () => {

    // get from redux store
    const cart = useSelector(state => state.cart)
    const user = useSelector(state => state.user)

    // only customer can visit this route
    useEffect(() => {
        const type = localStorage.getItem("type")
        if(type === "supplier") {
            history.push("/supplier/home")
        } else if(!type) {
            history.push("/gateway")
        }
    }, [])

    // state
    const [paymentPending, setPaymentPending] = useState(false)
    const [payment, setPayment] = useState(true)
    const [success, setSuccess] = useState(false)
    const [failure, steFailure] = useState(false)

    const history = useHistory()
    const dispatch = useDispatch()


    // get total cost
    let totalCost = 0
    cart.forEach(item => totalCost += item.cost*item.amount)

    // form submit
    const formSubmitHandler = async (e) => {
        e.preventDefault()
        const phoneNumber = e.target.phoneNumber.value
        const address = e.target.address.value
        setPaymentPending(true)

        const items = cart.filter(item => {
            return {
                product_id: item.product_id,
                amount: item.amount
            }
        })
        const order = {
            order_id: uuid(),
            customer_id: user.customer_id,
            createdAt: Date.now(),
            ship_address: address,
            ship_phone_number: phoneNumber,
            total_cost: totalCost,
            items
        }

        // create order
        try {
            const { success, error } = await orderAPI.createOrder(order)
            setPaymentPending(false)
            setPayment(false)
            if(success) {
                setSuccess(true)
                dispatch(saveCart([])) // remove cart from redux store
            } else throw error
        } catch(e) {
            steFailure(true)
            console.log(e);
        }
    }

    // btn back button
    const btnBackHandler = () => {
        history.go(-1)
    }

    // payment component
    const paymentComponent = (
        <div>
            <div className="orderSummary title element">Order Summary</div>
            { cart.map((item) => <div className="item element" key={item.product_id}>
                <div className="itemName">{item.name}</div>
                <div className="itemBottom">
                    <div className="qty">Quantity: {item.amount}</div>
                    <div className="cost">${item.cost*item.amount}</div>
                </div>
            </div>) }
            <div className="totalCostWrapper element">
                <div className="total">Total</div>
                <div className="totalCost">${totalCost}</div>
            </div>
            <div className="paymentBreak element"></div>
            <div className="payment title element">Payment details</div>
            <form onSubmit={formSubmitHandler} className="element">
                <div className="phoneNumberText">Phone number</div>
                <input type="text" name="phoneNumber" defaultValue={user.phone_number}
                       className="phoneNumber" required />
                <div className="addressText">Address</div>
                <input type="text" name="address" defaultValue={user.address} className="address" required/>
                <div className="buttonWrapper element">
                    <button className="backButton" type="button" onClick={btnBackHandler}>BACK</button>
                    <button className="order iconicBtn">
                        <span>ORDER</span>
                        { paymentPending && <Loading type="spin" className="smallLoading" height="18px" width="18px" color="#000000" /> }
                    </button>
                </div>
            </form>
        </div>
    )

    // result component
    const resultComponent = (
        <div>
            { success && <div className="resultText successText element">Thank you for your purchase, {user.name}.</div> }
            { failure && <div className="resultText failureText element">Some thing went wrong, please try again later.</div> }
            <button className="element backButton" onClick={() => history.push("/")}>BACK TO HOME</button>
        </div>
    )

    return (
        <div className="Checkout">
            <div className="container">
                <div className="header element">Checkout</div>
                <div className="processWrapper">
                    <div className="checkIcon element"><FontAwesomeIcon icon="check" color="#ffffff" size="1x" /></div>
                    <div className="checkCart element">Check cart</div>
                    <div className="processBreak element"></div>
                    <div className={"element " + (success ? "checkIcon" : "twoIcon")}>
                        { !success ? "2" : <FontAwesomeIcon icon="check" color="#ffffff" size="1x" /> }
                    </div>
                    <div className="payment element">Payment Details</div>
                </div>
                { payment && paymentComponent }
                { !payment && resultComponent }
            </div>
        </div>
    );
}

export default Checkout;