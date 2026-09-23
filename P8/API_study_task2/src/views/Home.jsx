import { useEffect, useState } from "react";
import { getProducts } from "../api";

function Home({ onProduct }) {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState("");


  useEffect(() => {
    getProducts()
      .then((res) => {
        setItems(res.data);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, []);


  if (loading)
    return <p>Loading products...</p>;

  if (error) {
    return <p>Could not load products: {error}</p>;
  }


  return (
    <div>
      <h2 className="font-bold text-xl mt-4">Products</h2>

      {items.map((item) => (
        <div className="mt-7" key={item.id}>

          <img
            src={item.image_url}
            alt={item.name}
            width="180"
          />

          <h3 className="mt-2 font-bold">
            {item.name}
          </h3>

          <p>{item.price} {item.currency}</p>

          <p className="mt-2">Features</p>

          <ul className="ml-7 list-disc">
            {item.features.map((feature, index) => (
              <li key={index}>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={() => onProduct(item.id)}
            className="mt-3 px-2 border"
          >
            View product
          </button>

          <hr className="mt-5"/>
        </div>
      ))}
    </div>
  );
}

export default Home;