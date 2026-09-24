import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

import Products from "./pages/Products";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";

function App() {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <Link className="logo" to="/">
            EShop
          </Link>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Products />} />

            <Route
              path="/products/:id"
              element={
                <Product
                  setCheckoutProduct={setProduct}
                  quantity={quantity}
                  setQuantity={setQuantity}
                />
              }
            />

            <Route
              path="/checkout"
              element={
                <Checkout
                  product={product}
                  quantity={quantity}
                />
              }
            />

            <Route
              path="/confirmation"
              element={<Confirmation />}
            />
          </Routes>
        </main>

        <footer>EShop</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;