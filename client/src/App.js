import Footer from "./component/Footer";
import Navbar from "./component/Navbar";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux"
import Main from "./component/Main";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import store from "./redux/store"
import ErrorFetching from "./component/ErrorFetching";
import ProductDetail from "./component/ProductDetail";
import Gateway from "./component/Gateway";
import Cart from "./component/Cart";
import Checkout from "./component/Checkout";
import Profile from "./component/Profile";
import OrderDetail from "./component/OrderDetail"
import SupplierHome from "./component/SupplierHome";
import CreateAndUpdateProduct from "./component/CreateAndUpdateProduct";

library.add(fas)

function App() {
  return (
  <Provider store={store}>
    <BrowserRouter>
      <div className="App">
        <Navbar/>
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <Route exact path="/gateway">
            <Gateway/>
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/product/:index">
            <ProductDetail/>
          </Route>
          <Route exact path="/checkout">
            <Checkout />
          </Route>
          <Route exact path="/order/:id">
            <OrderDetail />
          </Route>
          <Route exact path="/cart">
            <Cart />
          </Route>
          <Route exact path="/supplier/home">
            <SupplierHome />
          </Route>
          <Route exact path="/updateProduct/:index">
            <CreateAndUpdateProduct />
          </Route>
          <Route exact path="/createProduct">
            <CreateAndUpdateProduct />
          </Route>
          <Route exact path="/*">
            <ErrorFetching/>
          </Route>
        </Switch>
        <Footer />
      </div>
    </BrowserRouter>
  </Provider>
    
  );
}

export default App;
