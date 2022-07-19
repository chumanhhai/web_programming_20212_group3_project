import { useEffect, useState } from "react"
import { useParams, useHistory } from "react-router-dom"
import orderAPI from "../network/order"
import Loading from "react-loading"
import ErrorFetching from "./ErrorFetching"

const OrderDetail = () => {
    const [items, setItems] = useState([])
    const [fetchItemsPending, setFetchItemsPending] = useState(true)
    const [fetchItemsError, setFetchItemsError] = useState(false)
    const [fetchItemsSuccess, setFetchItemsSuccess] = useState(false)

    const history = useHistory()

    // get id of order
    const { id: order_id } = useParams()

    // get items from db
    useEffect(() => {
        const type = localStorage.getItem("type")
        if(type === "customer") {
            const fetchItem = async () => {
                setFetchItemsPending(true)
                setFetchItemsError(false)
                setFetchItemsSuccess(false)
    
                try {
                    const { success, error } = await orderAPI.getAllItems({ order_id })
                    setFetchItemsPending(false)
                    if(success) {
                        setFetchItemsSuccess(true)
                        setItems(success.data)
                    } else throw error
                } catch(e) {
                    console.log(e);
                    setFetchItemsError(true)
                }
            }
            fetchItem()
        } else if(type === "supplier") {
            history.push("/supplier/home")
        } else if(!type) {
            history.push("/gateway")
        }
    }, [])

    // get total cost
    const [totalCost, setTotalCost] = useState(0)
    useEffect(() => {
        if(items) {
            let sum = 0
            items.forEach(item => sum += item.cost*item.amount)
            setTotalCost(sum)
        }
    }, [items])

    return (
        <div className="OrderDetail">
            { fetchItemsPending &&  <Loading type="spin" height="28px" width="28px" color="#000"
                className="bigLoading" />}
            { fetchItemsError && <ErrorFetching />}
            { fetchItemsSuccess && <div className="main">
                <div className="items">
                    {items.map(item => <div className="item" key={item.product_id}>
                        <img src={"http://localhost:3000/image/"+item.product_id}
                            alt="product" className="image" />
                        <div className="infoWrapper">
                            <div className="name">{item.name}</div>
                            <div className="nonName">
                                <span className="fieldText">Quantity: </span>
                                <span className="qty fieldValue">{item.amount}</span>
                                <span className="fieldText">Cost: </span>
                                <span className="cost fieldValue">${item.cost}</span>
                            </div>
                        </div>
                        <div className="totalCost">${item.amount*item.cost}</div>
                    </div>)}
                </div>
                <div className="summary">
                    <div className="header element">Summary</div>
                    <div className="num element">
                        <span className="fieldText">Number of item: </span>
                        <span className="fieldValue">{items.length}</span>
                    </div>
                    <div className="cost element">
                        <span className="fieldText">Total cost: </span>
                        <span className="fieldValue">${totalCost}</span>
                    </div>
                    <button className="btnBack iconicBtn element"
                        onClick={() => history.go(-1)}>BACK TO PROFILE</button>
                </div>
            </div> }
        </div>
    );
}
 
export default OrderDetail;