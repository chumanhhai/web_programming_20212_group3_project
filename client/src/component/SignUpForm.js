import { useState } from "react"
import customerAPI from "../network/customer"
import supplierAPI from "../network/supplier"
import { v4 as uuid } from "uuid"

const SignUpForm = (props) => {

    const { isCustomer, loginOptionHandler, joinAsWhatHandler } = props
    const [name, setName] = useState("")
    const [email, setEmail ] = useState("")
    const [password, setPassword] = useState("")
    const [rePassword, setRePassword] = useState("")
    const [errorPwd, setErrorPwd] = useState(false)
    const [errorRePwd, setErrorRePwd] = useState(false)
    const [isPending, setPending] = useState(false)

    const formSubmitHandler = async (e) => {
        e.preventDefault()
        setErrorPwd(false)
        setErrorRePwd(false)

        if(password.length < 6) // pwd length >0 6
            setErrorPwd(true)
        else if(password !== rePassword) // re-pwd and pwd must be the same
            setErrorRePwd(true)
        else { // sign up
            try {
                if(isCustomer) { // if customer
                    const customer = {
                        customer_id: uuid(),
                        name: name,
                        email: email,
                        password: password,
                        address: "",
                        phone_number: ""
                    }
                    setPending(true)
                    const { success, error } = await customerAPI.signUp(customer)
                    setPending(false)
                    if(success) {
                        loginOptionHandler()
                    } else {
                        alert("Something when wrong. Please sign up again!")
                        throw error
                    }
                } else { // if supplier
                    const supplier = {
                        supplier_id: uuid(),
                        name: name,
                        email: email,
                        password: password,
                        address: "",
                        phone_number: ""
                    }
                    setPending(true)
                    const { success, error } = await supplierAPI.signUp(supplier)
                    setPending(false)
                    if(success) {
                        loginOptionHandler()
                    } else {
                        alert("Something when wrong. Please sign up again!")
                        throw error
                    }
                }
            } catch(e) {
                console.log(e);
            }
        }
    }

    return (
        <div className="SignUpForm">
            <form onSubmit={formSubmitHandler}>
                <div className="header">Sign up as { isCustomer ? "customer" : "supplier"}</div>
                <div className="fieldWrapper">
                    <div className="fieldTitle title">Your name</div>
                    <input type="text" className="name" value={name} onChange={(e) => {setName(e.target.value)}} required/>
                </div>
                <div className="fieldWrapper">
                    <div className="fieldTitle title">Email</div>
                    <input type="email" className="email" required value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                </div>
                <div className="fieldWrapper">
                    <div className="fieldTitle title">Password</div>
                    <input type="password" className="password" required value={password} onChange={(e) => {setPassword(e.target.value)}}/>
                    { errorPwd && <div className="error">{"password length must be >= 6"}</div> }
                </div>
                <div className="fieldWrapper">
                    <div className="fieldTitle title">Re-enter Password</div>
                    <input type="password" className="rePassword" required value={rePassword} onChange={(e) => {setRePassword(e.target.value)}}/>
                    { errorRePwd && <div className="error">{"re-entered password is not correct"}</div> }
                </div>
                <button className="btnContinue btn" disabled={isPending}>Continue</button>
                <div className="signWhat">
                    <span className="question ">Already have account?</span>
                    <span className="signWhatOption" onClick={loginOptionHandler}>Sign in</span>
                </div>
                <div className="break"/>
                <button className="btnAsWhat btn" onClick={joinAsWhatHandler} type="button">Join as { isCustomer ? "supplier" : "customer" }</button>
            </form>
        </div>
    );
}
 
export default SignUpForm;