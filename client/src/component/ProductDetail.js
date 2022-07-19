import { useSelector, useDispatch } from "react-redux"
import { useParams, useHistory } from "react-router-dom"
import { useState, useEffect } from "react"
import cartAPI from "../network/cart"
import { saveCart, addItemToCart } from "../redux/action/cartAction"
import Loading from "react-loading"

const ProductDetail = () => {

    const { index } = useParams()
    const history = useHistory()
    const dispatch = useDispatch()

    // supplier can not visit this route
    useEffect(() => {
        const type = localStorage.getItem("type")
         if(type === "supplier") {
            history.push("/supplier/home")
        }
    }, [])

    // set quantity array
    const qtyArray = []
    for(let i = 1; i < 10; i++)
        qtyArray[i-1] = i


    // get data from redux store
    const product = useSelector((state) => state.allProducts[index])
    const customer = useSelector(state => state.user)
    const cart = useSelector(state => state.cart)

    // set image array
    const images = ["http://localhost:3000/image/"+product.product_id]
    const [currentImageIndex, setImageIndex] = useState(0)
    const [qty, setQty] = useState(1)
    const [addToCartPending, setAddToCartPending] = useState(false)
    const [addToCartError, setAddToCartError] = useState(false)
    const [addToCartSuccess, setAddToCartSuccess] = useState(false)

    // image on change
    const imageSelectHandler = (index) => {
        setImageIndex(index)
    }

    // btn add cart
    const btnAddCartHandler = async () => {
        if(!customer) { // if user has not been login
            history.push({
                pathname: "/gateway",
                state: {
                    from: "productDetail"
                }
            })
        } else {
            // set state of pending
            setAddToCartPending(true)
            setAddToCartSuccess(false)
            setAddToCartError(false)

            let index = -1
            for(let i = 0; i < cart.length; i++)
                if(cart[i].product_id === product.product_id ) { 
                    index = i
                    break
                }
            try {
                if(index === -1) { // item is not in cart
                    const itemToDB = {
                        product_id: product.product_id,
                        amount: qty
                    }
                    const { success, error } = await cartAPI.addItem(itemToDB) // save new item to db

                    setAddToCartPending(false) // set state of pending

                    if(success) {
                        setAddToCartSuccess(true)
                        const itemToStore = {
                            ...product,
                            amount: qty
                        }
                        dispatch(addItemToCart(itemToStore)) // add new item to redux store
                    } else throw error
                } else { // item is already in cart
                    const item = {
                        product_id: product.product_id,
                        amount: qty + cart[index].amount
                    }
                    const { success, error } = await cartAPI.updateItem(item) // save update to db

                    setAddToCartPending(false) // set state of pending
                    
                    if(success) {
                        setAddToCartSuccess(true)
                        cart[index].amount += qty
                        dispatch(saveCart(cart)) // save cart to redux store
                    } else throw error
                }
            } catch(e) {
                console.log(e);
                setAddToCartError(true)
            }
        }
    }

    return (
        <div className="ProductDetail">
            <img src={images[currentImageIndex]}
                alt={product.short_description} className="mainImage" />
            <div className="info">
                <div className="name">{product.name}</div>
                <div className="descriptionWrapper">
                    <span className="descriptionText">Description: </span>
                    <span className="descriptionContent">{ product.full_description }</span>
                    </div>
                <div className="supplierNameWrapper">
                    <span className="supplierNameText">Shop: </span>
                    <span className="supplierNameContent">{ product.supplier_name }</span>
                </div>
                <div className="thumbnailwrapper">
                    <div className="thumbnailText">Images: </div>
                    <div className="thumbnailContentWrapper">
                        {images.map((image, index) => <img key={index} src={image} alt="img"
                            className={currentImageIndex===index ? "imageSelected" : ""} onClick={() => imageSelectHandler(index)} />)}
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="priceWrapper">
                    <span className="priceText">Price</span>
                    <span className="priceContent">{ product.cost } $</span>
                </div>
                <div className="statusWrapper">
                    <span className="statusText">Status</span>
                    <span className="statusContent">Available</span>
                </div>
                <div className="qtyWrapper">
                    <span className="qtyText">Quantity</span>
                    <select className="qtyContent" value={qty} onChange={(e) => setQty(parseInt(e.target.value))} >
                        { qtyArray.map((num) => <option key={num} value={num}>{num}</option>) }
                    </select>
                </div>
                <button className="btnAddToCart" onClick={btnAddCartHandler}>
                    <span>Add to cart</span>
                    { addToCartPending && <Loading className="smallLoading" color="#000000" height="22px" width="22px" type="spin"/> }
                </button>
                { addToCartError && <div className="error">Something went wrong.</div> }
                { addToCartSuccess && <div className="success">Item added successfully!</div> }
            </div>
        </div>
    );
}
 
export default ProductDetail;