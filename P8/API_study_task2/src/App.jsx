import { useState } from "react";
import Home from "./views/Home";
import ProductView from "./views/ProductView";
import CheckoutView from "./views/CheckoutView";
import SuccessView from "./views/SuccessView";

function App() {
  const [view, setView] = useState("home");
  const [selectedId, setSelectedId] = useState(null);

  const [cart, setCart] = useState(null);
  const [finishedOrder, setFinishedOrder] = useState(null);


  function openProduct(id) {
    setSelectedId(id);
    setView("product");
  }

  function buyProduct(product, qty) {
    setCart({
      product: product,
      quantity: qty
    });

    setView("checkout");
  }


  function completed(order) {
    setFinishedOrder(order);
    setCart(null);
    setView("success");
  }

  function backHome() {
    setSelectedId(null);
    setCart(null);
    setFinishedOrder(null);
    setView("home");
  }


  return (
    <main className="p-3">
      <header>
        <button
          onClick={backHome}
          className="font-bold text-2xl"
        >
          Peters Shop
        </button>

        {cart && (
          <p className="mt-1">
            Cart: {cart.quantity} item{cart.quantity !== 1 ? "s" : ""}
          </p>
        )}

      
      </header>

      {view === "home" &&
        <Home onProduct={openProduct}/>
      }

      {view === "product" && (
        <ProductView
          productId={selectedId}
          goBack={backHome}
          onBuy={buyProduct}
        />
      )}

      {view === "checkout" && cart && (
        <CheckoutView
          cart={cart}
          back={() => setView("product")}
          orderFinished={completed}
        />
      )}

      {view === "success" && finishedOrder && (
        <SuccessView
          order={finishedOrder}
          goHome={backHome}
        />
      )}
    </main>
  );
}

export default App;