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


export default function App() {
  return (
    <div className="min-h-screen bg-yellow-300 text-black">

      <header className="border-b-4 border-black bg-purple-500 p-3">

        <Link
          to="/products"
          className="text-2xl font-bold underline"
        >
          STUDY SHOP
        </Link>

      </header>


      <main className="p-3">

        <Routes>

          <Route
            path="/"
            element={
              <Navigate
                replace
                to="/products"
              />
            }
          />

          <Route
            path="/products"
            element={<ProductsPage />}
          />

          <Route
            path="/products/:id"
            element={<ProductPage />}
          />

          <Route
            path="/checkout"
            element={<CheckoutPage />}
          />

          <Route
            path="/confirmation"
            element={<ConfirmationPage />}
          />

          <Route
            path="*"
            element={
              <Navigate
                replace
                to="/products"
              />
            }
          />

        </Routes>

      </main>
    </div>
  );
}