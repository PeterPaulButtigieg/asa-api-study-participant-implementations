import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

import Products from "./pages/Products";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <Link to="/" className="logo">
            Shop
          </Link>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Products />} />

            <Route
              path="/products/:id"
              element={
                <Product
                  setSelectedProduct={setSelectedProduct}
                  quantity={quantity}
                  setQuantity={setQuantity}
                />
              }
            />

            <Route
              path="/checkout"
              element={
                <Checkout
                  product={selectedProduct}
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

      </div>
    </BrowserRouter>
  );
}

export default App;