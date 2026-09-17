import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router";

import {
  ApiError,
  getProduct,
} from "../api";

import type {
  Product,
} from "../types";


function ProductPage() {
  const { id } = useParams();

  const productId =
    Number(id);


  const [product, setProduct] =
    useState<Product | null>(null);

  const [quantity, setQuantity] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const headingRef =
    useRef<HTMLHeadingElement>(null);


  useEffect(() => {

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      setError("Invalid product");
      setLoading(false);

      return;
    }


    getProduct(productId)
      .then((response) => {
        setProduct(response.data);
      })

      .catch((err) => {

        if (err instanceof ApiError) {
          setError(
            `Could not load product (${err.status})`
          );
        } else {
          setError(
            "Could not load product"
          );
        }

      })

      .finally(() => {
        setLoading(false);
      });

  }, [productId]);


  useEffect(() => {

    if (!product) {
      return;
    }

    document.title =
      `${product.name} - Study Shop`;

    headingRef.current?.focus();

  }, [product]);


  if (loading) {
    return (
      <div className="bg-white border-4 border-black p-5">
        LOADING PRODUCT...
      </div>
    );
  }


  if (error || !product) {
    return (
      <div>

        <div className="bg-red-500 text-white border-4 border-black p-3 font-bold">
          ERROR!!!{" "}
          {error || "Product unavailable"}
        </div>


        <Link
          to="/products"
          className="inline-block bg-white border-2 border-black p-2 mt-3 font-bold"
        >
          BACK TO PRODUCTS
        </Link>

      </div>
    );
  }


  const maximumQuantity =
    Math.min(
      product.available_quantity,
      5
    );


  const cart = {
    product,
    quantity,
  };


  return (
    <div>

      <Link
        to="/products"
        className="inline-block bg-white border-2 border-black p-2 mb-3 font-bold"
      >
        BACK TO PRODUCTS
      </Link>


      <div className="bg-lime-300 border-4 border-black p-4 grid md:grid-cols-2 gap-4">

        <img
          src={product.image_url}
          alt={product.name}
          className="w-full border-4 border-red-500"
        />


        <div>

          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-4xl font-bold"
          >
            {product.name}
          </h1>


          <p className="text-3xl font-bold text-red-600 my-3">
            {product.price.toFixed(2)}{" "}
            {product.currency}
          </p>


          <p className="mb-4">
            {product.description}
          </p>


          <h2 className="font-bold text-xl">
            FEATURES!!!
          </h2>


          <div className="mb-3">

            {product.features.map(
              (feature, index) => (
                <div key={index}>
                  • {feature}
                </div>
              )
            )}

          </div>


          <p className="font-bold my-4">
            STOCK:{" "}
            {product.available_quantity}
          </p>


          {maximumQuantity > 0 && (
            <div className="mb-4">

              <label
                htmlFor="quantity"
                className="font-bold mr-2"
              >
                QUANTITY:
              </label>


              <select
                id="quantity"
                value={quantity}
                onChange={(event) =>
                  setQuantity(
                    Number(
                      event.target.value
                    )
                  )
                }
                className="border-2 border-black p-2 bg-white"
              >

                {Array.from(
                  {
                    length:
                      maximumQuantity,
                  },
                  (_, index) =>
                    index + 1
                ).map((amount) => (
                  <option
                    key={amount}
                    value={amount}
                  >
                    {amount}
                  </option>
                ))}

              </select>

            </div>
          )}


          {maximumQuantity > 0 ? (

            <Link
              to="/checkout"
              state={{ cart }}
              className="inline-block bg-fuchsia-500 border-4 border-black p-4 text-xl font-bold text-black"
            >
              BUY NOW!!!
            </Link>

          ) : (

            <button
              disabled
              className="bg-gray-400 border-4 border-black p-4 text-xl font-bold"
            >
              OUT OF STOCK
            </button>

          )}

        </div>

      </div>

    </div>
  );
}


export default ProductPage;