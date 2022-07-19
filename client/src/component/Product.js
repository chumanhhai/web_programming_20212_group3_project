import { Link } from "react-router-dom"

const Product = (props) => {

    const { product, index } = props

    const isSupplier = localStorage.getItem("type") === "supplier"

    return (
        <div className="Product">
            <Link to={(isSupplier ? "/updateProduct/" : "/product/") + index}>
                <div className="card">
                    <img src={"http://localhost:3000/image/" + product.product_id} alt={product.short_description} />
                    <div className="cardBody">
                        <div className="name">{product.name}</div>
                        <div className="price">${product.cost}</div>
                        <div className="supplierName">{product.supplier_name}</div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
 
export default Product;