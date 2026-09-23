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
    <div className="min-h-screen text-slate-900 bg-slate-50">
      <header className="border-b bg-white border-slate-200">
        <div className="max-w-6xl h-16 mx-auto flex items-center px-6">
          <a
            href="/"
            className="font-bold tracking-tight text-xl focus:outline-none focus:ring-2 focus:ring-slate-700 rounded-sm"
            aria-label="WRITE and FLAME home"
          >
            WRITE and FLAME
          </a>
        </div>
      </header>

      {page}
    </div>
  );
}