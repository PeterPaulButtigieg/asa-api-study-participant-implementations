import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Link } from "react-router";

import {
  ApiError,
  getProducts,
} from "../api";

import type { Product } from "../types";


export default function ProductsPage() {
  const [items, setItems] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [problem, setProblem] =
    useState("");


  const titleRef =
    useRef<HTMLHeadingElement>(null);


  useEffect(() => {
    document.title =
      "Products | Study Shop";

    titleRef.current?.focus();


    getProducts()
      .then((result) => {
        setItems(result.data);
      })
      .catch((error) => {

        if (error instanceof ApiError) {
          setProblem(
            `Products could not be loaded. Server returned ${error.status}.`
          );
        } else {
          setProblem(
            "Products could not be loaded."
          );
        }

      })
      .finally(() => {
        setLoading(false);
      });

  }, []);


  return (
    <div>

      <h1
        ref={titleRef}
        tabIndex={-1}
        className="text-4xl font-bold mb-2"
      >
        Products
      </h1>


      {loading && (
        <p
          role="status"
          aria-live="polite"
          className="bg-white border-2 border-black p-3 font-bold"
        >
          Loading products...
        </p>
      )}


      {problem && (
        <div
          role="alert"
          className="bg-red-600 text-white border-4 border-black p-3 font-bold"
        >
          {problem}
        </div>
      )}


      {!loading && !problem && (
        <div className="grid gap-3 md:grid-cols-3">

          {items.map((product) => (
            <article
              key={product.id}
              className="bg-cyan-300 border-4 border-black p-2"
            >

              <img
                src={product.image_url}
                alt={product.name}
                className="h-48 w-full border-2 border-black object-cover"
              />


              <h2 className="text-2xl font-bold mt-2">
                {product.name}
              </h2>


              <p className="text-red-700 font-bold text-xl">
                {product.price.toFixed(2)}{" "}
                {product.currency}
              </p>


              <h3 className="font-bold mt-3">
                Features
              </h3>

              <ul className="list-disc ml-6 mb-3">
                {product.features.map(
                  (feature, index) => (
                    <li key={index}>
                      {feature}
                    </li>
                  )
                )}
              </ul>


              <Link
                to={`/products/${product.id}`}
                className="inline-block border-4 border-black bg-red-500 text-white font-bold p-2"
              >
                View {product.name}
              </Link>

            </article>
          ))}

        </div>
      )}

    </div>
  );
}