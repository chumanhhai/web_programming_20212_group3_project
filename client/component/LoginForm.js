import {useState} from "react"
import customerAPI from "../src/network/customer"
import supplierAPI from "../src/network/supplier"
import {useHistory} from "react-router-dom"
import {useDispatch} from "react-redux"
import {saveUser} from "../src/redux/action/userAction"
import {saveCart} from "../src/redux/action/cartAction"
import {saveAllProducts} from "../src/redux/action/allProductsAction"

const LoginForm = (props) => {
    const {isCustomer, signUpOptionHandler, joinAsWhatHandler} = props

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorPwd, setErrorPwd] = useState(false)
    const [isIncorrectInfo, setInCorrectInfo] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()

    const formSubmitHandler = async (e) => {
        e.preventDefault()
        setErrorPwd(false)
        setInCorrectInfo(false)

        if (password.length < 6) // pwd length >0 6
            setErrorPwd(true)
        else { // sign in
            try {
                if (isCustomer) { // if customer
                    const account = {email, password}
                    const {success, error} = await customerAPI.logIn(account)
                    if (success) {
                        const {customer, cart, token} = success
                        if (customer) {
                            // dispatch to save user
                            dispatch(saveUser(customer))
                            // dispatch to save cart
                            dispatch(saveCart(cart))

                            // save token to local storage
                            localStorage.setItem("token", token)

                            // store in localstorage
                            if (isCustomer) localStorage.setItem("type", "customer")

                            // redirect
                            if (props.from === "productDetail") {
                                history.go(-1)
                            } else {
                                history.push("/")
                            }
                        } else {
                            setInCorrectInfo(true)
                        }
                    } else throw error
                } else { // if supplier
                    const account = {email, password}
                    const {success, error} = await supplierAPI.logIn(account)
                    if (success) {
                        const {supplier, products, token} = success
                        if (supplier) {
                            // dispatch to save user
                            dispatch(saveUser(supplier))

                            //dispatch to save all products
                            dispatch(saveAllProducts(products))

                            // save token to local storage
                            localStorage.setItem("token", token)

                            // store in localstorage
                            localStorage.setItem("type", "supplier")

                            // redirect
                            history.push("/supplier/home")
                        } else {
                            setInCorrectInfo(true)
                        }
                    } else throw error
                }
            } catch (e) {
                alert("Something went wrong. Please try again!")
                console.log(e);
            }
        }
    }

    return (
        <div className="LoginForm">
            <form onSubmit={formSubmitHandler}>
                <div className="header">Sign in as {isCustomer ? "customer" : "supplier"}</div>
                <div className="fieldWrapper">
                    <div className="fieldTitle title">Email</div>
                    <input type="email" className="email" required value={email} onChange={(e) => {
                        setEmail(e.target.value)
                    }}/>
                </div>
                <div className="fieldWrapper">
                    <div className="fieldTitle title">Password</div>
                    <input type="password" className="password" required value={password} onChange={(e) => {
                        setPassword(e.target.value)
                    }}/>
                    {errorPwd && <div className="error">{"password length must be >= 6"}</div>}
                </div>
                <button className="btnContinue btn">Continue</button>
                {isIncorrectInfo && <div className="error">Email or password is incorrect.</div>}
                <div className="signWhat">
                    <span className="question">Are you new?</span>
                    <span className="signWhatOption" onClick={signUpOptionHandler}>Sign up</span>
                </div>
                <div className="break"/>
                <button className="btnAsWhat btn" onClick={joinAsWhatHandler} type="button">Join
                    as {isCustomer ? "supplier" : "customer"}</button>
            </form>
        </div>
    );
}

export default LoginForm;
