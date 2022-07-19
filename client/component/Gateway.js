import {useState} from "react"
import {useLocation} from "react-router-dom"
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const Gateway = () => {

    // get data from last path
    const {state} = useLocation()
    let from = null
    if (state) from = state.from

    const [isCustomer, setCustomer] = useState(true)
    const [isSignIn, setSignIn] = useState(true)

    const changeSignInState = () => {
        if (isSignIn) setSignIn(false)
        else setSignIn(true)
    }

    const changeCustomerState = () => {
        if (isCustomer) setCustomer(false)
        else setCustomer(true)
    }

    return (
        <div className="Gateway">
            <div className="wrapper">
                {isSignIn && <LoginForm className="form" isCustomer={isCustomer} from={from}
                                        signUpOptionHandler={changeSignInState}
                                        joinAsWhatHandler={changeCustomerState}/>}
                {!isSignIn && <SignUpForm className="form" isCustomer={isCustomer}
                                          loginOptionHandler={changeSignInState}
                                          joinAsWhatHandler={changeCustomerState}/>}
            </div>
        </div>
    );
}

export default Gateway;
