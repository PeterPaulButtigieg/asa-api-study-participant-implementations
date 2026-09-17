import { useEffect, useState } from "react";
import { createOrder, getProduct, getProducts } from "./api";

const money = (n, c) => { try { return new Intl.NumberFormat("en", { style: "currency", currency: c }).format(n); } catch { return `${n.toFixed(2)} ${c}`; } };

export default function App() {
  const [page, setPage] = useState("products"), [products, setProducts] = useState([]), [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1), [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false), [error, setError] = useState("");

  useEffect(() => { (async () => {
    try { setLoading(true); setProducts((await getProducts()).data); }
    catch (e) { setError(e.message || "Products could not be loaded."); }
    finally { setLoading(false); }
  })(); }, []);

  async function viewProduct(id) {
    try {
      setLoading(true); setError("");
      const result = await getProduct(id);
      setProduct(result.data); setQuantity(1); setPage("product");
    } catch (e) { setError(e.message || "The product could not be found."); }
    finally { setLoading(false); }
  }

  function checkout() {
    const max = Math.min(5, product.available_quantity);
    if (quantity < 1 || quantity > max) return setError(`Choose a quantity between 1 and ${max}.`);
    setError(""); setPage("checkout");
  }

  async function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);

    const data = {
      product_id: product.id, quantity,
      customer: { full_name: f.get("full_name"), email: f.get("email") },
      delivery_address: { address_line: f.get("address_line"), city: f.get("city"), postcode: f.get("postcode") },
      payment: { cardholder_name: f.get("cardholder_name"), card_number: f.get("card_number"), expiry_date: f.get("expiry_date"), security_code: f.get("security_code") }
    };

    try {
      setLoading(true); setError("");
      const result = await createOrder(data);
      setOrder(result.data); setPage("confirmation");
    } catch (e) {
      setError(e.message || "The order could not be completed. Check the information entered and try again.");
    } finally { setLoading(false); }
  }

  function home() {
    setPage("products"); setProduct(null); setOrder(null);
    setQuantity(1); setError("");
  }


  return <div className="min-h-screen bg-gray-100 text-gray-900">
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto max-w-5xl flex p-4 px-5 justify-between items-center">
        <button onClick={home} className="text-xl font-bold">Il-Hanut</button>
        {product && page !== "confirmation" && <span className="text-gray-600 text-sm" aria-label={`${quantity} items in cart`}>Cart: {quantity}</span>}
      </div>
    </header>

    <main className="max-w-5xl p-6 px-5 mx-auto">
      {error && <div role="alert" aria-live="assertive" className="text-red-800 bg-red-100 border-red-200 border p-3 mb-5 rounded">{error}</div>}
      {loading ? <p role="status" aria-live="polite" className="text-gray-500 py-4">Loading...</p> :
        page === "products" ? <Products products={products} view={viewProduct} /> :
        page === "product" ? <Product product={product} quantity={quantity} setQuantity={setQuantity} checkout={checkout} back={() => setPage("products")} /> :
        page === "checkout" ? <Checkout product={product} quantity={quantity} submit={submit} back={() => setPage("product")} /> :
        <Confirmation order={order} home={home} />}
    </main>
  </div>;
}


function Products({ products, view }) {
  return <section aria-labelledby="products-heading">
    <h1 id="products-heading" className="font-bold text-3xl mb-3">Products</h1>

    {products.length === 0 ? <p role="status">No products are currently available.</p> :
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => <article key={p.id} className={`border bg-white p-4 border-gray-200 ${i % 2 ? "" : "rounded shadow-sm"}`}>
          <img src={p.image_url} alt={p.name} className="h-52 object-cover w-full rounded-sm" />

          <h2 className="font-bold text-xl mt-3 mb-1">{p.name}</h2>
          <p className="font-bold text-gray-800">{money(p.price, p.currency)}</p>

          <h3 className="font-semibold text-sm mt-4">Features</h3>
          <ul className="list-disc my-2 ml-5 text-sm">{p.features.map((f, i) => <li key={i} className={i === 0 ? "mb-1" : ""}>{f}</li>)}</ul>

          <button onClick={() => view(p.id)} aria-label={`View product ${p.name}`} className="text-white bg-black w-full px-3 p-2 mt-2 hover:bg-gray-800">View Product</button>
        </article>)}
      </div>}
  </section>;
}



function Product({ product: p, quantity, setQuantity, checkout, back }) {
  const max = Math.min(5, p.available_quantity), unavailable = p.available_quantity === 0;

  return <section aria-labelledby="product-name">
    <button onClick={back} className="text-gray-700 mb-5 hover:underline">← Back to products</button>

    <div className="grid bg-white md:grid-cols-2 border border-gray-200 shadow-sm p-6 gap-8">
      <img src={p.image_url} alt={p.name} className="w-full rounded" />

      <div className="px-1">
        <h1 id="product-name" className="font-bold text-3xl">{p.name}</h1>
        <p className="text-gray-700 mt-4 mb-3">{p.description}</p>
        <p className="font-bold text-2xl mb-1">{money(p.price, p.currency)}</p>

        <h2 className="font-bold mt-5 mb-1">Features</h2>
        <ul className="ml-5 list-disc text-gray-700">{p.features.map((f, i) => <li key={i}>{f}</li>)}</ul>

        <p className="mt-6 mb-5">Available quantity: <strong>{p.available_quantity}</strong></p>

        {!unavailable && <div className="mb-2">
          <label htmlFor="quantity" className="font-medium mr-3">Quantity</label>
          <select id="quantity" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="p-2 bg-white border border-gray-300 px-3">
            {Array.from({ length: max }, (_, i) => i + 1).map(n => <option value={n} key={n}>{n}</option>)}
          </select>
        </div>}

        <div className="my-5 p-3 px-4 border border-gray-100 bg-gray-100 flex justify-between">
          <span>Order total</span><strong>{money(p.price * quantity, p.currency)}</strong>
        </div>

        <button disabled={unavailable} onClick={checkout} className="w-full bg-blue-600 p-3 text-white rounded-sm hover:bg-blue-700 disabled:bg-gray-400">
          {unavailable ? "Out of stock" : "Buy now"}
        </button>
      </div>
    </div>
  </section>;
}


function Checkout({ product: p, quantity, submit, back }) {
  return <>
    <button onClick={back} className="mb-4 text-gray-700 hover:underline">← Back to product</button>
    <h1 className="font-bold text-3xl mt-1 mb-6">Checkout</h1>

    <div className="grid lg:grid-cols-3 gap-6">
      <form onSubmit={submit} className="bg-white lg:col-span-2 border border-gray-200 p-6 rounded-sm">
        <section aria-labelledby="customer-title">
          <h2 id="customer-title" className="text-xl font-bold mb-3">Customer information</h2>

          <div className="grid md:grid-cols-2 gap-3">
            <label htmlFor="full_name" className="block text-sm">Full name
              <input id="full_name" name="full_name" autoComplete="name" required className="border p-2 w-full mt-1 border-gray-300" />
            </label>

            <label htmlFor="email" className="text-sm block">Email address
              <input id="email" name="email" type="email" autoComplete="email" required className="w-full p-2 mt-1 bg-white border border-gray-300" />
            </label>
          </div>
        </section>

        <section aria-labelledby="delivery-title">
          <h2 id="delivery-title" className="font-bold mt-7 text-xl mb-3">Delivery address</h2>

          <label htmlFor="address_line" className="block text-sm">Address line
            <input id="address_line" name="address_line" autoComplete="street-address" required className="w-full border border-gray-300 px-2 p-2 mt-1" />
          </label>

          <div className="grid md:grid-cols-2 mt-3 gap-3">
            <label htmlFor="city" className="block text-sm">Town or city
              <input id="city" name="city" autoComplete="address-level2" required className="p-2 w-full mt-1 border" />
            </label>

            <label htmlFor="postcode" className="block text-sm">Postal code
              <input id="postcode" name="postcode" autoComplete="postal-code" required className="border-gray-300 border mt-1 p-2 w-full" />
            </label>
          </div>
        </section>

        <section aria-labelledby="payment-title">
          <h2 id="payment-title" className="text-xl mt-6 mb-1 font-bold">Payment</h2>

          <label htmlFor="cardholder_name" className="text-sm block">Cardholder name
            <input id="cardholder_name" name="cardholder_name" autoComplete="cc-name" required aria-describedby="payment-help" className="border p-2 px-2 w-full mt-1 bg-white" />
          </label>

          <div className="mt-3">
            <label htmlFor="card_number" className="block text-sm">Card number
              <input id="card_number" name="card_number" autoComplete="cc-number" placeholder="4242 4242 4242 4242" minLength="12" maxLength="23" required aria-describedby="payment-help" className="border border-gray-300 p-2 mt-1 w-full" />
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-3">
            <label htmlFor="expiry_date" className="block text-sm">Expiry date
              <input id="expiry_date" name="expiry_date" autoComplete="cc-exp" placeholder="MM/YY" pattern="\d{2}/\d{2}" title="Enter expiry as MM/YY, for example 12/30" required className="w-full border p-2 mt-1 bg-white" />
            </label>

            <label htmlFor="security_code" className="text-sm block">CVV
              <input id="security_code" name="security_code" autoComplete="cc-csc" placeholder="123" pattern="\d{3,4}" title="Enter a 3 or 4 digit security code" required className="border-gray-300 border px-2 p-2 w-full mt-1" />
            </label>
          </div>
        </section>

        <button type="submit" className="bg-blue-600 text-white px-4 p-3 mt-7 w-full hover:bg-blue-700">Place Order</button>
      </form>


      <aside aria-labelledby="summary-title" className="border bg-white p-5 px-5 h-fit shadow-sm">
        <h2 id="summary-title" className="font-bold text-xl mb-2">Order summary</h2>

        <img src={p.image_url} alt={p.name} className="w-24 h-24 my-4 object-cover rounded" />
        <p className="mb-1"><strong>{p.name}</strong></p>
        <p className="text-sm">Quantity: {quantity}</p>
        <p className="text-gray-600 text-sm">{money(p.price, p.currency)} each</p>

        <hr className="my-5 border-gray-200" />
        <p className="flex text-lg justify-between"><strong>Total</strong><strong>{money(p.price * quantity, p.currency)}</strong></p>
      </aside>
    </div>
  </>;
}



function Confirmation({ order: o, home }) {
  return <section aria-labelledby="confirmation-title" className="mx-auto max-w-3xl bg-white border border-gray-200 p-6 px-7 shadow-sm">
    <div role="status" aria-live="polite" className="border-green-200 bg-green-100 border p-4 rounded mb-6">
      <h1 id="confirmation-title" className="font-bold text-2xl mb-1">Order successful</h1>
      <p>{o.message}</p>
    </div>

    <p className="mb-1"><strong>Order ID:</strong> {o.id}</p>
    <p><strong>Status:</strong> {o.status}</p>

    <h2 className="font-bold text-xl mt-7 mb-3">Order details</h2>

    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <caption className="sr-only">Products included in order {o.id}</caption>
        <thead>
          <tr className="border-gray-300 border-b">
            <th scope="col" className="py-2">Product</th>
            <th scope="col">Quantity</th>
            <th scope="col">Unit price</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {o.items.map(i => <tr key={i.product_id} className="border-b border-gray-200">
            <td className="py-3">{i.product_name}</td>
            <td>{i.quantity}</td>
            <td>{money(i.unit_price, i.currency)}</td>
            <td>{money(i.line_total, i.currency)}</td>
          </tr>)}
        </tbody>
      </table>
    </div>

    <div className="p-4 bg-gray-100 px-5 mt-6 rounded-sm">
      <p>Total items: {o.item_count}</p>
      <p className="mt-1 font-bold">Order total: {money(o.total, o.currency)}</p>
    </div>

    <button onClick={home} className="text-white bg-black p-3 mt-5 rounded-sm w-full hover:bg-gray-900">Back to Products</button>
  </section>;
}
