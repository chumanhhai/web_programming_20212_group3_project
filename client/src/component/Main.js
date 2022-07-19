import Product from "./Product"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState, useRef } from "react"
import { useHistory } from "react-router-dom"
import productAPI from "../network/product"
import { saveAllProducts } from "../redux/action/allProductsAction"
import Carousel from "react-elastic-carousel"
import InfiniteScroll from 'react-infinite-scroll-component'

const Main = () => {
    const [offset, setOffset] = useState(0)
    const [isMore, setMore] = useState(true)
    const limit = 20

    const dispatch = useDispatch()
    const history = useHistory()

    // get all products from redux store
    const allProducts = useSelector((state) => state.allProducts)

    // fetchData
    const fetchProducts = async (loadMore) => {
        setMore(true)
        try {
            if(loadMore) {
                const { success, error } = await productAPI.getAllProducts({ offset, limit, select: selectProductType, orderBy })
                if(success) {
                    const newAllProducts = [...allProducts, ...success.data]
                    dispatch(saveAllProducts(newAllProducts))
                    setOffset(offset + limit)
                    if(success.data.length < limit)
                        setMore(false)
                } else throw error
            } else {
                const { success, error } = await productAPI.getAllProducts({ offset: 0, limit, select: selectProductType, orderBy })
                if(success) {
                    dispatch(saveAllProducts(success.data))
                    setOffset(limit)
                    if(success.data.length < limit)
                        setMore(false)
                } else throw error
            }
        } catch(e) {
            console.log(e);
        }
    }

    // ------------- filter -------------
    const [selectProductType, setselectProductType] = useState("all")
    const [orderBy, setOrderBy] = useState("new")
    const [title, setTitle] = useState(null)
    const btnSearchHandler = async () => { // search btn handler
        try {
            if(title === "") {
                await fetchProducts(false)
            } else {
                setMore(false)
                const { success, error } = await productAPI.search(title)
                if(success) {
                    dispatch(saveAllProducts(success.data))
                } else throw error
            }
        } catch(e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if(localStorage.getItem("type") === "supplier") { // if current user is supplier
            history.push("/supplier/home")
        } else { // if current user is not a supplier
            fetchProducts(false)
        }
    }, [selectProductType, orderBy])
    
    // ------------- carousel -------------
    const carouselRef = useRef()
    const carouselOnChangeHandler = (_, index) => {
        if(index === 4) {
            carouselRef.current.goTo(0)
        }
    }

    return (
        <div className="Main">
            <Carousel className="carousel"
                itemsToShow={1}
                showArrows={false}
                enableAutoPlay={true}
                autoPlaySpeed={3000}
                ref={carouselRef}
                onChange={carouselOnChangeHandler}>
                <img src="/img/shop1.jpg" alt="shoping" className="carouselItem" />
                <img src="/img/shop2.jpg" alt="shoping" className="carouselItem" />
                <img src="/img/shop3.jpg" alt="shoping" className="carouselItem" />
                <img src="/img/shop4.jpg" alt="shoping" className="carouselItem" />
                <img src="/img/shop5.jpg" alt="shoping" className="carouselItem" />
            </Carousel>
            <div className="filter">
                    <div className="search">
                        <input type="text" className="inputSearch" placeholder="Enter product name..."
                            onChange={(e) => setTitle(e.target.value.toLowerCase())} />
                        <button className="btnSearch iconicBtn" onClick={btnSearchHandler}>Search</button>
                    </div>
                    <div className="selectWrapper">
                        <select value={selectProductType} className="productType"
                            onChange={(e) => setselectProductType(e.target.value)}>
                            <option value="all">All</option>
                            <option value="pant">Pant</option>
                            <option value="t-shirt">T-Shirt</option>
                            <option value="shirt">Shirt</option>
                            <option value="jacket">Jacket</option>
                            <option value="shoes">Shoes</option>
                            <option value="glasses">Glasses</option>
                            <option value="hat">Hat</option>
                        </select>
                        <select value={orderBy} className="orderBy"
                            onChange={(e) => setOrderBy(e.target.value)}>
                            <option value="new">Newest</option>
                            <option value="lowCost">Low to High cost</option>
                            <option value="highCost">High to Low cost</option>
                        </select>
                    </div>
                </div>
                <InfiniteScroll className="container"
                    dataLength={allProducts.length}
                    hasMore={isMore}
                    next={() => fetchProducts(true)}
                    loader={<div className="message">LOADING...</div>}
                    endMessage={<div className="message">NOTHING MORE TO SEE</div>}>
                    {allProducts.map((product, index) => <Product key={product.product_id} index={index} product={product} />)}
                    {[1,2,3,4,5].map(e => <div key={e} className="extra"></div>)}
                </InfiniteScroll>
        </div>
    );
}
 
export default Main;