import { Link, useHistory } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import customerAPI from "../network/customer"
import supplierAPI from "../network/supplier"
import { saveUser } from "../redux/action/userAction"
import { saveCart } from "../redux/action/cartAction"
import { saveAllProducts } from "../redux/action/allProductsAction"

const Navbar = () => {

    const dispatch = useDispatch()
    const history = useHistory()

    // get user from store redux
    const user = useSelector((state) => state.user)
    const cart = useSelector(state => state.cart)

    const type = localStorage.getItem("type")

    // on component did mount
    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem("token")
            if(token) { // if user is already logined before
                try {
                    if(type === "customer") {
                        const { success, error } = await customerAPI.getMyProfile(token)
                        if(success) {
                            const { customer, cart } = success
                            if(customer) {
                                dispatch(saveUser(customer))
                                dispatch(saveCart(cart))
                            } else throw new Error("Can not get user profile by token.")
                        } else throw error
                    } else {
                        const { success, error } = await supplierAPI.getMyProfile(token)
                        if(success) {
                            const { supplier, products } = success
                            if(supplier) {
                                dispatch(saveUser(supplier))
                                dispatch(saveAllProducts(products))
                                history.push("/supplier/home")
                            } else throw new Error("Can not get user profile by token.")
                        } else throw error
                    }
                } catch(e) {
                    console.log(e);
                } 
            }
        }
        init()
    }, [])

    // logout
    const logOutHandler = () => {
        localStorage.removeItem("token") // remove token
        localStorage.removeItem("type") // remove type of user
        dispatch(saveUser(null)) // delete user in redux store
        dispatch(saveCart([])) // delete cart in redux store
        history.push("/")
    }

    return (
        <div className="Navbar">
            <div className="headerWrapper">
                <FontAwesomeIcon icon="bars" size="2x" color="#ffffff" className="icon"/>
                <Link className="header" to={ type==="supplier" ? "/supplier/home" : "/"}>amazom</Link>
            </div>
            <div className="navItemWrapper">
                { (!user || user.customer_id) && <Link className="cart navItem" to="/cart" >
                        <FontAwesomeIcon icon="shopping-cart" style={{fontSize: "22px" }}/>
                        { cart && <div className="notify">{cart.length}</div> }
                    </Link> }
                { !user && <Link className="signin navItem" to="/gateway">Sign In</Link> }
                { user && <div className="userMenu">
                    <div className="imageWrapper">
                        <img src={"http://localhost:3000/image/" + (user.customer_id || user.supplier_id)} alt="avatar" />
                        <FontAwesomeIcon icon="sort-down" className="dropIcon"/>
                    </div>
                    <div className="content">
                        { user.customer_id &&
                            <Link className="menuItem" to="/profile">Profile</Link> }
                        { user.supplier_id && <div className="menuItem"
                            onClick={() => history.push("/createProduct")}>Create product</div> }
                        <div className="menuItem" onClick={logOutHandler}>Log out</div>
                    </div>
                </div> }
            </div>
        </div>
    );
}
 
export default Navbar;