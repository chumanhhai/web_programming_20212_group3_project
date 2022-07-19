import Loading from "react-loading"
import { useState, useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import productAPI from "../src/network/product"
import imageAPI from "../src/network/image"
import { v4 as uuid } from "uuid"
import { saveAllProducts } from "../src/redux/action/allProductsAction"

const CreateAndUpdateProduct = () => {

    // only supplier can access this page
    const history = useHistory()
    useEffect(() => {
        const type = localStorage.getItem("type")
        if(type !== "supplier") {
            history.push("/gateway")
        }
    }, [])

    const dispatch = useDispatch()

    // get data from redux store
    const { index } = useParams()
    const allProducts = useSelector(state => state.allProducts)
    let product
    if(index != -1) {
        product = allProducts[index]
    }


    // state of IO
    const [submitPending, setsubmitPending] = useState(false)
    const [removePending, setremovePending] = useState(false)
    const [error, setError] = useState(false)

    // image
    const [imgChanged, setImageChanged] = useState(false)
    const [imgSrc, setImgSrc] = useState("/img/img_default.png")
    useEffect(() => {
        if(product) {
            setImgSrc("http://localhost:3000/image/" + product.product_id )
        }
    }, [product])
    const imgOnChangeHandler = (e) => {
        if(e.target.files) {
            setImgSrc(URL.createObjectURL(e.target.files[0]))
            setImageChanged(true)
        }
    }

    // submit form
    const formSubmitHandler = async (e) => {
        e.preventDefault()
        if (!product && !imgChanged) { // IF CREATE AND IMAGE IS NOT SET
            return alert("Please select an image")
        }

        setsubmitPending(true)
        setError(false)

        const info = {
            name: e.target.name.value,
            short_description: e.target.shortDescription.value,
            full_description: e.target.fullDescription.value,
            cost: parseInt(e.target.cost.value),
            category: e.target.category.value,
            createdAt: Date.now()
        }
        if(product) {
            info.product_id = product.product_id
        } else {
            info.product_id = uuid()
        }
        try {
            // info promise
            let infoPromise
            if(!product) { // IF CREATE
                infoPromise = new Promise(async (resolve) => {
                    const result = await productAPI.createProduct(info)
                    resolve(result)
                })
            }  else {
                infoPromise = new Promise(async (resolve) => {
                    const result = await productAPI.updateProduct(info)
                    resolve(result)
                })
            }
            // image promise
            const imagePromise = new Promise(async (resolve, reject) => {
                if(product && !imgChanged) { // IF UPDATE AND IMAGE IS NOT CHANGED
                    resolve({ success: true, error: null })
                } else { // IF IMAGE IS SET
                    const data = new FormData();
                    data.append("product_id", info.product_id);
                    data.append("image", e.target.image.files[0])
                    const result = await imageAPI.uploadProduct(data)
                    resolve(result)
                }
            })
            const [infoResult, imageResult] = await Promise.all([infoPromise, imagePromise])
            const { success: infoSuccess, error: infoError } = infoResult
            const { success: imageSuccess, error: imageError } = imageResult

            if(infoSuccess && imageSuccess) {
                // update to redux store
                let newAllProducts = [...allProducts]
                if(product) { // IF UPDATE
                    info.createdAt = product.createdAt
                    newAllProducts[index] = info
                } else { // IF CREATE
                    newAllProducts.unshift(info)
                }
                dispatch(saveAllProducts(newAllProducts))

                history.push("/supplier/home") // go to main page
            } else throw new Error({ infoError, imageError })
        } catch (e) {
            setError(true)
            console.log(e);
        } finally {
            setsubmitPending(false)
        }
    }

    // btn remove
    const btnRemoveHandler = async () => {
        setError(false)
        setremovePending(true)
        try {
            const { success, error } = await productAPI.deleteProduct(product.product_id)
            if(success) {
                // remove in redux store
                allProducts.splice(index, 1)
                const newAllProducts = [...allProducts]
                dispatch(saveAllProducts(newAllProducts))

                // go to main page
                history.push("/supplier/home")
            } else throw error
        } catch(e) {
            setError(true)
            console.log(e);
        } finally {
            setremovePending(false)
        }
    }

    return (
        <div className="CreateAndUpdateProduct">
            <form onSubmit={formSubmitHandler}>
                <div className="nameWrapper">
                    <div className="title">Name</div>
                    <input type="text" name="name" className="name field" placeholder="name"
                           required defaultValue={product ? product.name : ""} />
                </div>
                <div className="shortDescriptionWrapper">
                    <div className="title">Short Description</div>
                    <input type="text" name="shortDescription" placeholder="short description"
                           className="shortDescription field" defaultValue={product ? product.short_description : ""} required />
                </div>
                <div className="fullDescriptionWrapper">
                    <div className="title">Full Description</div>
                    <textarea name="fullDescription" className="fullDescription field"
                              placeholder="full description" defaultValue={product ? product.full_description : ""} required/>
                </div>
                <div className="imageWrapper">
                    <img src={imgSrc} alt="product" className="image" />
                    <input type="file" name="image" className="imageInput" accept=".png, .jpeg, .jpg" onChange={imgOnChangeHandler}/>
                </div>
                <div className="costAndCategoryWrapper">
                    <div className="costWrapper">
                        <div className="title">Cost</div>
                        <input type="number" name="cost" className="cost" placeholder="cost"
                               defaultValue={product ? product.cost : ""} required/>
                    </div>
                    <div className="categoryWrapper">
                        <div className="title">Category</div>
                        <select name="category" className="category" defaultValue={product ? product.category : "pant"}>
                            <option value="pant">Pant</option>
                            <option value="t-shirt">T-Shirt</option>
                            <option value="shirt">Shirt</option>
                            <option value="jacket">Jacket</option>
                            <option value="shoes">Shoes</option>
                            <option value="glasses">Glasses</option>
                            <option value="hat">Hat</option>
                        </select>
                    </div>
                </div>
                <div className={"buttonWrapper " + (product ? "buttonWrapperUpdate" : "buttonWrapperCreate") }>
                    <button className="btnCancel" type="button" onClick={() => history.go(-1)}>Cancel</button>
                    <div className="removeAndSubmitWrapper">
                        { product && <button className="btnRemove" type="button" onClick={btnRemoveHandler}>
                            <span>Remove</span>
                            { removePending && <Loading type="spin" height="18px" width="18px" color="#000" className="smallLoading" /> }
                        </button> }
                        <button className="btnSubmit iconicBtn">
                            <span>Submit</span>
                            { submitPending && <Loading type="spin" height="18px" width="18px" color="#000" className="smallLoading" /> }
                        </button>
                    </div>
                </div>
                { error && <div className="error">Something went wrong.</div> }
            </form>
        </div>
    );
}

export default CreateAndUpdateProduct;