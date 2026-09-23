import { useState } from "react";
import Home from "./views/Home";
import ProductView from "./views/ProductView";
import CheckoutView from "./views/CheckoutView";
import SuccessView from "./views/SuccessView";

function App() {
  const [page, setPage] = useState("home");
  const [productId, setProductId] = useState(null);
  const [cart, setCart] = useState(null);
  const [order, setOrder] = useState(null);

  function viewProduct(id) {
    setProductId(id);
    setPage("product");
  }

  function checkout(product, quantity) {
    setCart({ product, quantity });
    setPage("checkout");
  }

  function orderDone(order) {
    setOrder(order);
    setCart(null);
    setPage("success");
  }

  function home() {
    setPage("home");
    setProductId(null);
    setCart(null);
    setOrder(null);
  }

  return (
    <div className="p-3">
      <h1 onClick={home} className="text-2xl font-bold cursor-pointer">
        Peters Shop
      </h1>


      {cart && <p>Cart items: {cart.quantity}</p>}

      {page === "home" && (
        <Home onViewProduct={viewProduct} />
      )}

      {page === "product" && (
        <ProductView
          productId={productId}
          onBuy={checkout}
          onBack={home}
        />
      )}

      {page === "checkout" && cart && (
        <CheckoutView
          cart={cart}
          onBack={() => setPage("product")}
          onSuccess={orderDone}
        />
      )}

      {page === "success" && order && (
        <SuccessView order={order} onHome={home} />
      )}
    </div>
  );
}

export default App;