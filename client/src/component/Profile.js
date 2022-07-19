import { useState, useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import customerAPI from "../network/customer"
import imageAPI from "../network/image"
import Loading from "react-loading"
import orderAPI from "../network/order"
import ErrorFetching from "./ErrorFetching"
import moment from  "moment"
import { Link, useHistory } from "react-router-dom"
import { saveUser } from "../redux/action/userAction"

const Profile = () => {

    // get data from redux store
    const user = useSelector(state => state.user)

    // avatar
    const [defaultImgSrc, setDefaultImgSrc] = useState() 
    const [imgSrc, setImgSrc] = useState()
    const avatarRef = useRef() 
    const history = useHistory()
    // only customer can visit this route
    useEffect(() => {
        const type = localStorage.getItem("type")
        if(type === "customer") {
            if(user) {
                const src = "http://localhost:3000/image/" + user.customer_id + "?" + Date.now()
                setDefaultImgSrc(src)
                setImgSrc(src)
            }
        }
        else if(type === "supplier") {
            history.push("/supplier/home")
        } else if(!type) {
            history.push("/gateway")
        }
    }, [user])

    // state of doing api
    const [updatePending, setUpdatePending] = useState(false)
    const [updateError, setUpdateError] = useState(false)

    const dispatch = useDispatch()

    // image pick handler
    const imagePickHandler = (e) => {
        if(e.target.files) {
            setImgSrc(URL.createObjectURL(e.target.files[0]))
        }
    }

    // update profile handler
    const formSubmitHandler = async(e) => {
        e.preventDefault()
        // set state
        setUpdatePending(true)
        setUpdateError(false)

        const update = {
            name: e.target.name.value,
            phone_number: e.target.phoneNumber.value,
            address: e.target.address.value
        }
        
        try {
            const infoPromise = new Promise(async (resolve) => {
                await customerAPI.updateProfile(update)
                resolve()
            })
            const avatarPromise = new Promise(async (resolve) => {
                if(defaultImgSrc !== imgSrc) {
                    const formData = new FormData()
                    formData.append("image", e.target.avatar.files[0])
                    await imageAPI.uploadAvatar(formData)
                    resolve()
                }
                resolve()
            })
            await Promise.all([infoPromise, avatarPromise]) // save to db

            const newUser = {
                ...user,
                ...update
            }
            dispatch(saveUser(newUser)) // save to redux store
            window.location.reload()
        } catch(e) {
            console.log(e);
            setUpdateError(true)
        } finally {
            setUpdatePending(false)
        }
    }

    // --------------order history -----------------
    const [fetchOrderPending, setFetchOrderPending] = useState(true)
    const [fetchOrderError, setFetchOrderError] = useState(false)
    const [fetchOrderSuccess, setFetchOrderSuccess] = useState(false)
    let offset = 0
    let limit=15
    const [orders, setOrders] = useState([])
    useEffect(() => {
        const fetchOrderHistory = async () => {
            setFetchOrderPending(true)
            setFetchOrderError(false)
            setFetchOrderSuccess(false)
            try {
                const { success, error } = await orderAPI.getAllOrders({ offset, limit })
                setFetchOrderPending(false)
                if(success) {
                    setOrders(success.data)
                    setFetchOrderSuccess(true)
                } else throw error
            } catch(e) {
                console.log(e);
                setFetchOrderError(true)
            }
        }
        fetchOrderHistory()
    }, [])    

    // format date
    const getDate = (timestamp) => {
        return moment(timestamp).format("DD/MM/YYYY HH:mm:ss")
    }

    return (
        <div className="Profile">
            { user && <form className="profile" onSubmit={formSubmitHandler}>
                <div className="avatarWrapper">
                    <img src={imgSrc} alt="avatar" className="avatar" onClick={() => avatarRef.current.click()} />
                    <input type="file" name="avatar" accept=".jpg, .png, .jpeg" ref={avatarRef}
                        onChange={imagePickHandler} className="avatarInput"/>
                    <div className="hint">Click to change the avatar</div>
                </div>
                <div className="wrapper">
                    <div className="title">name</div>
                    <input type="text" name="name" className="fieldInput"
                        defaultValue={user.name} required/>
                </div>
                <div className="wrapper">
                    <div className="title">phone number</div>
                    <input type="text" name="phoneNumber" className="fieldInput"
                    defaultValue={user.phone_number}/>
                </div>
                <div className="wrapper">
                    <div className="title">address</div>
                    <input type="text" name="address" className="fieldInput" 
                        defaultValue={user.address}/>
                </div>
                <button className="iconicBtn btnUpdate">
                    <span>Update</span>
                    { updatePending && <Loading type="spin" height="18px" width="18px"
                        color="#000000" className="smallLoading"/> }
                </button>
                { updateError && <div className="error">Something went wrong.</div> }
            </form> }
            { orders && <div className="orderHistory">
                { fetchOrderPending && <Loading type="spin" height="28px" width="28px"
                color="#000" className="bigLoading" /> }
                { fetchOrderError &&  <ErrorFetching />}
                { fetchOrderSuccess && <table><tbody>
                    <tr className="title">
                        <td>DATE</td>
                        <td>TOTAL COST</td>
                        <td></td>
                    </tr>
                    { orders.map(order => <tr className="order" key={order.order_id}>
                        <td className="date">{getDate(order.createdAt)}</td>
                        <td className="cost">${order.total_cost}</td>
                        <td className="action">
                            <Link className="btnDetail" to={"/order/"+order.order_id}>Detail</Link>
                        </td>
                    </tr>) }
                </tbody></table>}
            </div> }
        </div>
    )
}
 
export default Profile;