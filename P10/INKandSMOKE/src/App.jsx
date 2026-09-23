import Products from "./pages/Products";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";

export default function App() {
  const path = window.location.pathname;
  const parts = path.split("/").filter(Boolean);

  let page = <Products />;

  if (parts[0] === "product" && parts[1]) {
    page = <Product productId={parts[1]} />;
  }

  if (parts[0] === "checkout") {
    page = <Checkout />;
  }

  if (parts[0] === "order" && parts[1]) {
    page = <Order orderId={parts[1]} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <a href="/" className="font-bold text-xl tracking-tight">
            INK and SMOKE
          </a>


        </div>
      </header>

      {page}
    </div>
  );
}