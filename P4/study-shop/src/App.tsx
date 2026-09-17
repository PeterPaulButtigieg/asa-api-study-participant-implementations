import {
  Link,
  Navigate,
  Route,
  Routes,
} from "react-router";

import ProductsPage from "./pages/ProductsPage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";


function App() {
  return (
    <div className="min-h-screen bg-yellow-300">

      <header className="bg-fuchsia-500 border-b-4 border-black p-3">

        <Link
          to="/products"
          className="font-bold text-2xl text-black"
        >
          STUDY SHOP!!!
        </Link>

      </header>


      <main className="p-4">

        <Routes>

          <Route
            path="/"
            element={
              <Navigate
                to="/products"
                replace
              />
            }
          />


          <Route
            path="/products"
            element={
              <ProductsPage />
            }
          />


          <Route
            path="/products/:id"
            element={
              <ProductPage />
            }
          />


          <Route
            path="/checkout"
            element={
              <CheckoutPage />
            }
          />


          <Route
            path="/confirmation"
            element={
              <ConfirmationPage />
            }
          />


          <Route
            path="*"
            element={
              <Navigate
                to="/products"
                replace
              />
            }
          />

        </Routes>

      </main>

    </div>
  );
}


export default App;