import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
} from "react-router";

import {
  ApiError,
  getProducts,
} from "../api";

import type {
  Product,
} from "../types";


function ProductsPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const headingRef =
    useRef<HTMLHeadingElement>(null);


  useEffect(() => {
    document.title =
      "Products - Study Shop";

    headingRef.current?.focus();


    getProducts()
      .then((response) => {
        setProducts(response.data);
      })

      .catch((err) => {
        if (err instanceof ApiError) {
          setError(
            `Could not load products (${err.status})`
          );
        } else {
          setError(
            "Could not load products"
          );
        }
      })

      .finally(() => {
        setLoading(false);
      });

  }, []);


  if (loading) {
    return (
      <div className="bg-white border-4 border-black p-5">
        LOADING PRODUCTS...
      </div>
    );
  }


  if (error) {
    return (
      <div className="bg-red-500 text-white border-4 border-black p-4 font-bold">
        ERROR!!! {error}
      </div>
    );
  }


  return (
    <div>

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-4xl font-bold mb-1"
      >
        PRODUCTS
      </h1>


      <p className="font-bold mb-4">
        Look at our amazing products!!!
      </p>


      <div className="grid md:grid-cols-3 gap-3">

        {products.map((product) => (
          <div
            key={product.id}
            className="bg-cyan-300 border-4 border-black p-2"
          >

            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover border-2 border-black"
            />


            <h2 className="text-xl font-bold mt-2">
              {product.name}
            </h2>


            <p className="text-xl font-bold text-red-600">
              {product.price.toFixed(2)}{" "}
              {product.currency}
            </p>


            <div className="my-3">

              {product.features.map(
                (feature, index) => (
                  <div key={index}>
                    - {feature}
                  </div>
                )
              )}

            </div>


            <Link
              to={`/products/${product.id}`}
              className="inline-block bg-red-500 text-white border-2 border-black p-2 font-bold"
            >
              VIEW PRODUCT
            </Link>

          </div>
        ))}

      </div>

    </div>
  );
}


export default ProductsPage;