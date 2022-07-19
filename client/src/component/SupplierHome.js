import { useState, useRef, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import supplierAPI from "../network/supplier"
import imageAPI from "../network/image"
import Loading from "react-loading"
import Product from "./Product"
import { saveUser } from "../redux/action/userAction"

const SupplierHome = () => {

    // get data from redux store
    const user = useSelector(state => state.user)
    const products = useSelector(state => state.allProducts)

    const dispatch = useDispatch()

    // avatar
    const [imgSrc, setImgSrc] = useState()
    const [defaultImgSrc, setDefaultImageSrc] = useState()
    const avatarRef = useRef() 
    const history = useHistory()
    useEffect(() => {
        // only supplier can visit this route
        const type = localStorage.getItem("type")
        if(type === "supplier") {
            if(user) {
                const src = "http://localhost:3000/image/" + user.supplier_id + "?" + Date.now()
                setDefaultImageSrc(src)
                setImgSrc(src)
            }
        } else {
            history.push("/")
        }
    }, [user])
    

    // state of doing api
    const [updatePending, setUpdatePending] = useState(false)
    const [updateError, setUpdateError] = useState(false)

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
                await supplierAPI.updateProfile(update)
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

    // get statisic
    const [statistic, setStatistic] = useState()
    useEffect(() => {
        const _ = async () => {
            try {
                const { success, error } = await supplierAPI.getStatistic()
                if(success) {
                    setStatistic(success.data)
                } else throw error
            } catch(e) {
                console.log(e);
            }
        }
        _()
    })

    return (
        <div className="SupplierHome">
            { user && <div className="profileAndStatisticWrapper">
                <form className="profile" onSubmit={formSubmitHandler}>
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
                </form>
                <div className="statistic">
                    <div className="wrapper">
                        <span className="title">Number of products sold: </span>
                        <span className="data">{ statistic ? statistic.productsNum : "" }</span>
                    </div>
                    <div className="wrapper">
                        <span className="title">Total income: </span>
                        <span className="data">${ statistic ? statistic.income : "" }</span>
                    </div>
                </div>
            </div> }
            { products && <div className="productList">
                { products.map((product, index) => <Product key={index} index={index} product={product} />) }
                {[1,2,3,4,5].map(e => <div key={e} className="extra"></div>)}
            </div> }
        </div>
    );
}
 
export default SupplierHome;