import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router";

import {
  ApiError,
  createOrder,
} from "../api";

import type {
  Cart,
  CheckoutPayload,
} from "../types";


type FormValues = {
  fullName: string;
  email: string;

  address: string;
  city: string;
  postcode: string;

  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  securityCode: string;
};


type FormField = keyof FormValues;


type Problem = {
  field?: FormField;
  message: string;
  suggestion?: string;
};


const fieldNames: Record<string, FormField> = {
  full_name: "fullName",
  email: "email",

  address_line: "address",
  city: "city",
  postcode: "postcode",

  cardholder_name: "cardholderName",
  card_number: "cardNumber",
  expiry_date: "expiryDate",
  security_code: "securityCode",
};


function objectValue(
  value: unknown
): Record<string, unknown> | null {
  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  ) {
    return value as Record<string, unknown>;
  }

  return null;
}


function getProblems(
  body: unknown
): Problem[] {
  const response =
    objectValue(body);

  if (!response) {
    if (typeof body === "string" && body) {
      return [{ message: body }];
    }

    return [];
  }


  if (typeof response.detail === "string") {
    return [
      {
        message: response.detail,
      },
    ];
  }


  if (!Array.isArray(response.detail)) {
    return [];
  }


  return response.detail.map((entry) => {
    const issue =
      objectValue(entry);

    if (!issue) {
      return {
        message:
          "There was a problem with the order.",
      };
    }


    let field: FormField | undefined;

    if (Array.isArray(issue.loc)) {
      const lastPart =
        issue.loc[issue.loc.length - 1];

      if (
        typeof lastPart === "string" &&
        fieldNames[lastPart]
      ) {
        field =
          fieldNames[lastPart];
      }
    }


    let suggestion: string | undefined;

    if (
      typeof issue.suggestion ===
      "string"
    ) {
      suggestion =
        issue.suggestion;
    } else {
      const context =
        objectValue(issue.ctx);

      if (
        context &&
        typeof context.suggestion ===
          "string"
      ) {
        suggestion =
          context.suggestion;
      }
    }


    return {
      field,
      message:
        typeof issue.msg === "string"
          ? issue.msg
          : "Invalid value.",
      suggestion,
    };
  });
}


function FieldProblem({
  problem,
  id,
}: {
  problem?: Problem;
  id: string;
}) {
  if (!problem) {
    return null;
  }

  return (
    <div
      id={id}
      className="bg-red-100 border-2 border-red-700 p-1 mt-1 text-sm"
    >
      <div>
        {problem.message}
      </div>

      {problem.suggestion && (
        <div className="font-bold">
          Try: {problem.suggestion}
        </div>
      )}
    </div>
  );
}


export default function CheckoutPage() {
  const location =
    useLocation();

  const navigate =
    useNavigate();


  const heading =
    useRef<HTMLHeadingElement>(null);


  const cart = (
    location.state as {
      cart?: Cart;
    } | null
  )?.cart;


  const [values, setValues] =
    useState<FormValues>({
      fullName: "",
      email: "",

      address: "",
      city: "",
      postcode: "",

      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      securityCode: "",
    });


  const [sending, setSending] =
    useState(false);

  const [apiError, setApiError] =
    useState<ApiError | null>(null);

  const [problems, setProblems] =
    useState<Problem[]>([]);


  useEffect(() => {
    document.title =
      "Checkout | Study Shop";

    heading.current?.focus();
  }, []);


  if (!cart) {
    return (
      <Navigate
        replace
        to="/products"
      />
    );
  }


  const product =
    cart.product;

  const quantity =
    cart.quantity;

  const total =
    product.price * quantity;


  function change(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const name =
      event.target.name as FormField;


    setValues({
      ...values,
      [name]: event.target.value,
    });


    if (
      problems.some(
        (problem) =>
          problem.field === name
      )
    ) {
      setProblems(
        problems.filter(
          (problem) =>
            problem.field !== name
        )
      );
    }
  }


  function problemFor(
    field: FormField
  ) {
    return problems.find(
      (problem) =>
        problem.field === field
    );
  }


  async function placeOrder(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSending(true);
    setApiError(null);
    setProblems([]);


    const payload: CheckoutPayload = {
      product_id: product.id,
      quantity,

      customer: {
        full_name:
          values.fullName,

        email:
          values.email,
      },

      delivery_address: {
        address_line:
          values.address,

        city:
          values.city,

        postcode:
          values.postcode,
      },

      payment: {
        cardholder_name:
          values.cardholderName,

        card_number:
          values.cardNumber,

        expiry_date:
          values.expiryDate,

        security_code:
          values.securityCode,
      },
    };


    try {
      const result =
        await createOrder(payload);


      navigate(
        "/confirmation",
        {
          state: {
            order: result.data,
          },
        }
      );

    } catch (error) {

      if (error instanceof ApiError) {
        setApiError(error);
        setProblems(
          getProblems(error.body)
        );
      } else {
        setProblems([
          {
            message:
              "The order could not be submitted.",
          },
        ]);
      }

    } finally {
      setSending(false);
    }
  }


  const inputClass =
    "w-full border-2 border-black bg-white p-2";


  const fullNameProblem =
    problemFor("fullName");

  const emailProblem =
    problemFor("email");

  const addressProblem =
    problemFor("address");

  const cityProblem =
    problemFor("city");

  const postcodeProblem =
    problemFor("postcode");

  const cardholderProblem =
    problemFor("cardholderName");

  const numberProblem =
    problemFor("cardNumber");

  const expiryProblem =
    problemFor("expiryDate");

  const codeProblem =
    problemFor("securityCode");


  return (
    <div>

      <Link
        to={`/products/${product.id}`}
        className="inline-block bg-white border-2 border-black p-2 font-bold mb-3"
      >
        Back to product
      </Link>


      <div className="lg:grid lg:grid-cols-[2fr_1fr] gap-4">

        <form
          onSubmit={placeOrder}
          className="border-4 border-black bg-orange-300 p-3"
          noValidate={false}
        >

          <h1
            ref={heading}
            tabIndex={-1}
            className="text-4xl font-bold"
          >
            Checkout
          </h1>


          {problems.length > 0 && (
            <div
              role="alert"
              aria-live="assertive"
              className="bg-red-600 text-white border-4 border-black p-3 my-3"
            >

              <h2 className="text-xl font-bold">
                There is a problem with your order
              </h2>


              <ul className="list-disc ml-5">

                {problems.map(
                  (problem, index) => (
                    <li key={index}>

                      {problem.message}

                      {problem.suggestion && (
                        <span>
                          {" "}
                          Suggested fix:{" "}
                          {problem.suggestion}
                        </span>
                      )}

                    </li>
                  )
                )}

              </ul>

            </div>
          )}


          {apiError && (
            <details className="bg-white border-2 border-black p-2 mb-3">

              <summary className="font-bold cursor-pointer">
                Full API error response
              </summary>

              <p>
                HTTP status:{" "}
                {apiError.status}
              </p>

              <pre className="overflow-auto whitespace-pre-wrap text-xs bg-gray-100 p-2 mt-2">
                {typeof apiError.body ===
                "string"
                  ? apiError.body
                  : JSON.stringify(
                      apiError.body,
                      null,
                      2
                    )}
              </pre>

            </details>
          )}


          <fieldset className="border-2 border-black p-2 mb-3">

            <legend className="font-bold text-xl px-1">
              Customer information
            </legend>


            <div className="md:grid md:grid-cols-2 gap-3">

              <div>

                <label
                  htmlFor="fullName"
                  className="block font-bold"
                >
                  Full name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={values.fullName}
                  onChange={change}
                  aria-invalid={
                    Boolean(
                      fullNameProblem
                    )
                  }
                  aria-describedby={
                    fullNameProblem
                      ? "fullName-problem"
                      : undefined
                  }
                  className={inputClass}
                />

                <FieldProblem
                  id="fullName-problem"
                  problem={fullNameProblem}
                />

              </div>


              <div>

                <label
                  htmlFor="email"
                  className="block font-bold"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={values.email}
                  onChange={change}
                  aria-invalid={
                    Boolean(emailProblem)
                  }
                  aria-describedby={
                    emailProblem
                      ? "email-problem"
                      : undefined
                  }
                  className={inputClass}
                />

                <FieldProblem
                  id="email-problem"
                  problem={emailProblem}
                />

              </div>

            </div>

          </fieldset>


          <fieldset className="border-2 border-black p-2 mb-3">

            <legend className="font-bold text-xl px-1">
              Delivery address
            </legend>


            <div>

              <label
                htmlFor="address"
                className="block font-bold"
              >
                Address line
              </label>

              <input
                id="address"
                name="address"
                autoComplete="street-address"
                required
                maxLength={200}
                value={values.address}
                onChange={change}
                aria-invalid={
                  Boolean(addressProblem)
                }
                aria-describedby={
                  addressProblem
                    ? "address-problem"
                    : undefined
                }
                className={inputClass}
              />

              <FieldProblem
                id="address-problem"
                problem={addressProblem}
              />

            </div>


            <div className="md:grid md:grid-cols-2 gap-3 mt-3">

              <div>

                <label
                  htmlFor="city"
                  className="block font-bold"
                >
                  Town or city
                </label>

                <input
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  required
                  maxLength={100}
                  value={values.city}
                  onChange={change}
                  aria-invalid={
                    Boolean(cityProblem)
                  }
                  aria-describedby={
                    cityProblem
                      ? "city-problem"
                      : undefined
                  }
                  className={inputClass}
                />

                <FieldProblem
                  id="city-problem"
                  problem={cityProblem}
                />

              </div>


              <div>

                <label
                  htmlFor="postcode"
                  className="block font-bold"
                >
                  Postal code
                </label>

                <input
                  id="postcode"
                  name="postcode"
                  autoComplete="postal-code"
                  required
                  maxLength={20}
                  value={values.postcode}
                  onChange={change}
                  aria-invalid={
                    Boolean(
                      postcodeProblem
                    )
                  }
                  aria-describedby={
                    postcodeProblem
                      ? "postcode-problem"
                      : undefined
                  }
                  className={inputClass}
                />

                <FieldProblem
                  id="postcode-problem"
                  problem={
                    postcodeProblem
                  }
                />

              </div>

            </div>

          </fieldset>


          <fieldset className="border-2 border-black p-2">

            <legend className="font-bold text-xl px-1">
              Payment information
            </legend>



            <div>

              <label
                htmlFor="cardholderName"
                className="block font-bold"
              >
                Cardholder name
              </label>

              <input
                id="cardholderName"
                name="cardholderName"
                autoComplete="cc-name"
                required
                maxLength={100}
                value={
                  values.cardholderName
                }
                onChange={change}
                aria-invalid={
                  Boolean(
                    cardholderProblem
                  )
                }
                aria-describedby={
                  cardholderProblem
                    ? "cardholder-problem"
                    : undefined
                }
                className={inputClass}
              />

              <FieldProblem
                id="cardholder-problem"
                problem={
                  cardholderProblem
                }
              />

            </div>


            <div className="mt-3">

              <label
                htmlFor="cardNumber"
                className="block font-bold"
              >
                Card number
              </label>

              <input
                id="cardNumber"
                name="cardNumber"
                inputMode="numeric"
                autoComplete="cc-number"
                required
                minLength={12}
                maxLength={23}
                value={
                  values.cardNumber
                }
                onChange={change}
                aria-invalid={
                  Boolean(numberProblem)
                }
                aria-describedby={
                  numberProblem
                    ? "cardNumber-problem test-card-info"
                    : "test-card-info"
                }
                className={inputClass}
              />

              <FieldProblem
                id="cardNumber-problem"
                problem={numberProblem}
              />

            </div>


            <div className="grid grid-cols-2 gap-3 mt-3">

              <div>

                <label
                  htmlFor="expiryDate"
                  className="block font-bold"
                >
                  Expiry date
                </label>

                <input
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/YY"
                  autoComplete="cc-exp"
                  inputMode="numeric"
                  required
                  pattern="[0-9]{2}/[0-9]{2}"
                  value={
                    values.expiryDate
                  }
                  onChange={change}
                  aria-invalid={
                    Boolean(expiryProblem)
                  }
                  aria-describedby={
                    expiryProblem
                      ? "expiry-problem"
                      : undefined
                  }
                  className={inputClass}
                />

                <FieldProblem
                  id="expiry-problem"
                  problem={expiryProblem}
                />

              </div>


              <div>

                <label
                  htmlFor="securityCode"
                  className="block font-bold"
                >
                  CVV
                </label>

                <input
                  id="securityCode"
                  name="securityCode"
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  required
                  maxLength={4}
                  pattern="[0-9]{3,4}"
                  value={
                    values.securityCode
                  }
                  onChange={change}
                  aria-invalid={
                    Boolean(codeProblem)
                  }
                  aria-describedby={
                    codeProblem
                      ? "code-problem"
                      : undefined
                  }
                  className={inputClass}
                />

                <FieldProblem
                  id="code-problem"
                  problem={codeProblem}
                />

              </div>

            </div>

          </fieldset>


          <button
            type="submit"
            disabled={sending}
            className="bg-green-500 border-4 border-black p-3 mt-4 text-xl font-bold disabled:bg-gray-400"
          >
            {sending
              ? "Submitting order..."
              : `Pay ${total.toFixed(2)} ${product.currency}`}
          </button>


          <div
            role="status"
            aria-live="polite"
            className="sr-only"
          >
            {sending
              ? "Order is being submitted."
              : ""}
          </div>

        </form>


        <aside
          aria-labelledby="cart-heading"
          className="border-4 border-black bg-cyan-300 p-3 h-fit mt-3 lg:mt-0"
        >

          <h2
            id="cart-heading"
            className="text-2xl font-bold"
          >
            Your cart
          </h2>


          <img
            src={product.image_url}
            alt=""
            className="w-28 h-28 object-cover border-2 border-black my-2"
          />


          <p className="font-bold">
            {product.name}
          </p>

          <p>
            Quantity: {quantity}
          </p>

          <p>
            Unit price:{" "}
            {product.price.toFixed(2)}{" "}
            {product.currency}
          </p>


          <p className="bg-yellow-300 border-2 border-black p-2 font-bold text-xl mt-3">
            Total:{" "}
            {total.toFixed(2)}{" "}
            {product.currency}
          </p>

        </aside>

      </div>

    </div>
  );
}