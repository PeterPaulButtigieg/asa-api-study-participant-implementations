import { useEffect, useState } from "react";
import { createOrder, getProduct, getProducts } from "./api";

const money = (n, c) => { try { return new Intl.NumberFormat("en", { style: "currency", currency: c }).format(n); } catch { return `${n.toFixed(2)} ${c}`; } };

export default function App() {
  const [page, setPage] = useState("products"), [products, setProducts] = useState([]), [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1), [order, setOrder] = useState(null), [loading, setLoading] = useState(false), [error, setError] = useState("");

  useEffect(() => { (async () => { try { setLoading(true); setProducts((await getProducts()).data); } catch (e) { setError(e.message); } finally { setLoading(false); } })(); }, []);
  async function viewProduct(id) {
    try { setLoading(true); setError(""); setProduct((await getProduct(id)).data); setQuantity(1); setPage("product"); }
    catch (e) { setError(e.message); } finally { setLoading(false); }
  }

  function checkout() {
    const max = Math.min(5, product.available_quantity);
    if (quantity < 1 || quantity > max) return setError(`Quantity must be between 1 and ${max}.`);
    setError(""); setPage("checkout");
  }

  async function submit(e) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const data = {
      product_id: product.id, quantity,
      customer: { full_name: f.get("full_name"), email: f.get("email") },
      
      delivery_address: { address_line: f.get("address_line"), city: f.get("city"), postcode: f.get("postcode") },
      payment: { cardholder_name: f.get("cardholder_name"), card_number: f.get("card_number"), expiry_date: f.get("expiry_date"), security_code: f.get("security_code") }
    };
    try { setLoading(true); setError(""); setOrder((await createOrder(data)).data); setPage("confirmation"); }
    catch { setError("The order could not be completed. Check your details and try again."); } finally { setLoading(false); }
  }

  function home() { setPage("products"); setProduct(null); setOrder(null); setQuantity(1); setError(""); }

  return <div className="min-h-screen bg-gray-100 text-gray-900">
    <header className="bg-white border-b border-gray-200 shadow-sm"><div className="max-w-5xl mx-auto p-4 px-5 flex justify-between items-center">
      <button onClick={home} className="font-bold text-xl">Il-Hanut</button>
      {product && page !== "confirmation" && <span className="text-sm text-gray-600">Cart: {quantity}</span>}
    </div></header>

    <main className="max-w-5xl mx-auto p-6 px-5">
      {error && <p className="bg-red-100 text-red-700 border border-red-200 p-3 mb-5 rounded">{error}</p>}
      {loading ? <p className="py-4 text-gray-500">Loading...</p> :
        page === "products" ? <Products products={products} view={viewProduct} /> :
        page === "product" ? <Product product={product} quantity={quantity} setQuantity={setQuantity} checkout={checkout} back={() => setPage("products")} /> :
        page === "checkout" ? <Checkout product={product} quantity={quantity} submit={submit} back={() => setPage("product")} /> :
        <Confirmation order={order} home={home} />}
    </main>
  </div>;
}

function Products({ products, view }) {
  return <>
    <h1 className="text-3xl font-bold mb-1">Products</h1>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map((p, i) => <div key={p.id} className={`bg-white border border-gray-200 p-4 ${i % 2 === 0 ? "rounded shadow-sm" : ""}`}>
        <img src={p.image_url} alt={p.name} className="w-full h-52 object-cover rounded-sm" />
        <h2 className="text-xl font-bold mt-3 mb-1">{p.name}</h2>
        <p className="font-bold text-gray-800">{money(p.price, p.currency)}</p>

        <ul className="list-disc ml-5 my-3 text-sm">{p.features.map((f, i) => <li key={i} className="mb-1">{f}</li>)}</ul>

        <button onClick={() => view(p.id)} className="bg-black hover:bg-gray-800 text-white p-2 px-3 w-full mt-1">View Product</button>
      </div>)}
    </div>
  </>;

}



function Product({ product: p, quantity, setQuantity, checkout, back }) {
  const max = Math.min(5, p.available_quantity), unavailable = !p.available_quantity;

  return <>
    <button onClick={back} className="mb-5 text-gray-700 hover:underline">← Back to products</button>

    <div className="bg-white border border-gray-200 p-6 grid md:grid-cols-2 gap-8 shadow-sm">
      <img src={p.image_url} alt={p.name} className="w-full rounded" />

      <div className="px-1">
        <h1 className="text-3xl font-bold">{p.name}</h1>
        <p className="my-3 mt-4 text-gray-700">{p.description}</p>
        <p className="text-2xl font-bold mb-1">{money(p.price, p.currency)}</p>

        <h2 className="font-bold mt-5 mb-1">Features</h2>
        <ul className="list-disc ml-5 text-gray-700">{p.features.map((f, i) => <li key={i}>{f}</li>)}</ul>

        <p className="my-5 mt-6">Available: <b>{p.available_quantity}</b></p>

        {!unavailable && <div className="mb-2">
          <label className="mr-3 font-medium">Quantity</label>
          <select value={quantity} onChange={e => setQuantity(+e.target.value)} className="border border-gray-300 p-2 px-3 bg-white">
            {Array.from({ length: max }, (_, i) => i + 1).map(n => <option key={n}>{n}</option>)}
          </select>
        </div>}

        <p className="bg-gray-100 border border-gray-100 p-3 px-4 my-5 flex justify-between"><span>Total</span><b>{money(p.price * quantity, p.currency)}</b></p>

        <button disabled={unavailable} onClick={checkout} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 w-full rounded-sm">
          {unavailable ? "Out of Stock" : "Buy Now"}
        </button>
      </div>
    </div>
  </>;
}




function Checkout({ product: p, quantity, submit, back }) {
  return <>
    <button onClick={back} className="mb-4 text-gray-700">← Back to product</button>
    <h1 className="text-3xl font-bold mb-6 mt-1">Checkout</h1>

    <div className="grid lg:grid-cols-3 gap-6">
      <form onSubmit={submit} className="lg:col-span-2 bg-white border border-gray-200 p-6 rounded-sm">
        <h2 className="text-xl font-bold mb-3">Customer information</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Full name" name="full_name" />
          <Field label="Email" name="email" type="email" />
        </div>

        <h2 className="text-xl font-bold mt-7 mb-3">Delivery address</h2>
        <Field label="Address line" name="address_line" />
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          <Field label="Town or city" name="city" />
          <Field label="Postal code" name="postcode" />
        </div>

        <h2 className="text-xl font-bold mt-6 mb-1">Payment</h2>

        <Field label="Cardholder name" name="cardholder_name" />

        <div className="mt-3">
          <Field label="Card number" name="card_number" placeholder="4242 4242 4242 4242" minLength="12" maxLength="23" />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-3">
          <Field label="Expiry date" name="expiry_date" placeholder="MM/YY" pattern="\d{2}/\d{2}" />
          <Field label="CVV" name="security_code" placeholder="123" pattern="\d{3,4}" />
        </div>

        <button className="bg-blue-600 text-white p-3 px-4 w-full mt-7 hover:bg-blue-700">Place Order</button>
      </form>

      <aside className="bg-white border p-5 px-5 h-fit shadow-sm">
        <h2 className="text-xl font-bold mb-2">Order summary</h2>
        <img src={p.image_url} alt={p.name} className="w-24 h-24 object-cover my-4 rounded" />
        <p className="mb-1"><b>{p.name}</b></p>
        <p className="text-sm">Quantity: {quantity}</p>
        <p className="text-sm text-gray-600">{money(p.price, p.currency)} each</p>

        <hr className="my-5 border-gray-200" />
        <p className="flex justify-between text-lg"><b>Total</b><b>{money(p.price * quantity, p.currency)}</b></p>
      </aside>
    </div>
  </>;
}



function Field({ label, name, type = "text", ...props }) {
  return <label className="block text-sm">{label}<input name={name} type={type} required {...props} className="border border-gray-300 p-2 px-2 w-full mt-1 bg-white focus:border-blue-500 outline-none" /></label>;
}





function Confirmation({ order: o, home }) {
  return <div className="max-w-3xl mx-auto bg-white border border-gray-200 p-6 px-7 shadow-sm">
    <div className="bg-green-100 border border-green-200 p-4 mb-6 rounded">
      <h1 className="text-2xl font-bold mb-1">Order successful</h1>
      <p>{o.message}</p>
    </div>

    <p className="mb-1"><b>Order ID:</b> {o.id}</p>
    <p><b>Status:</b> {o.status}</p>

    <h2 className="text-xl font-bold mt-7 mb-3">Order details</h2>

    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead><tr className="border-b border-gray-300"><th className="py-2">Product</th><th>Qty</th><th>Unit price</th><th>Total</th></tr></thead>
        <tbody>{o.items.map(i => <tr key={i.product_id} className="border-b border-gray-200">
          <td className="py-3">{i.product_name}</td><td>{i.quantity}</td><td>{money(i.unit_price, i.currency)}</td><td>{money(i.line_total, i.currency)}</td>
        </tr>)}</tbody>
      </table>
    </div>

    <div className="bg-gray-100 p-4 px-5 mt-6 rounded-sm">
      <p>Items: {o.item_count}</p>
      <p className="font-bold mt-1">Total: {money(o.total, o.currency)}</p>
    </div>

    <button onClick={home} className="bg-black hover:bg-gray-900 text-white p-3 w-full mt-5 rounded-sm">Back to Products</button>
  </div>;
}

