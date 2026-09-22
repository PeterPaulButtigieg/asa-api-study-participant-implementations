import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { FormsModule, NgForm } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

// @ts-ignore
import { createOrder, getProduct } from '../api.js';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h1>Checkout</h1>

    <p
      *ngIf="loading"
      role="status"
      aria-live="polite"
    >
      Loading checkout...
    </p>

    <div
      *ngIf="loadError"
      role="alert"
      aria-live="assertive"
      class="text-red-700"
    >
      {{ loadError }}
    </div>


    <div *ngIf="product && !loading">
      <section
        class="p-4 border mb-8"
        aria-labelledby="cart-heading"
      >
        <h2 id="cart-heading">Your cart</h2>

        <p>
          <strong>{{ product.name }}</strong>
        </p>

        <p>Quantity: {{ quantity }}</p>

        <p>
          Total:
          <strong>
            {{ total | number:'1.2-2' }}
            {{ product.currency }}
          </strong>
        </p>

        <a [routerLink]="['/product', product.id]">
          Change quantity
        </a>

        <p
          *ngIf="!quantityValid"
          role="alert"
          class="text-red-700"
        >
          This quantity is not available. Go back and choose a valid quantity.
        </p>
      </section>


      <form
        #checkoutForm="ngForm"
        (ngSubmit)="submit(checkoutForm)"
      >
        <fieldset>
          <legend>Customer information</legend>

          <div class="mb-3">
            <label for="fullName">Full name</label><br>

            <input
              id="fullName"
              name="fullName"
              [(ngModel)]="customer.full_name"
              type="text"
              required
              maxlength="100"
              autocomplete="name"
              class="p-1 border w-full max-w-md"
            >
          </div>

          <div>
            <label for="email">Email address</label><br>

            <input
              id="email"
              name="email"
              [(ngModel)]="customer.email"
              type="email"
              required
              autocomplete="email"
              class="border max-w-md p-1 w-full"
            >
          </div>
        </fieldset>


        <fieldset class="mt-7">
          <legend>Delivery address</legend>

          <div>
            <label for="address">Address line</label><br>

            <input
              id="address"
              name="address"
              type="text"
              [(ngModel)]="delivery.address_line"
              required
              maxlength="200"
              autocomplete="street-address"
              class="w-full p-1 max-w-md border"
            >
          </div>

          <div class="mt-3">
            <label for="city">Town or city</label><br>

            <input
              id="city"
              name="city"
              [(ngModel)]="delivery.city"
              required
              maxlength="100"
              autocomplete="address-level2"
              class="border w-full max-w-md p-1"
            >
          </div>

          <div class="mt-3">
            <label for="postcode">Postal code</label><br>

            <input
              id="postcode"
              name="postcode"
              type="text"
              [(ngModel)]="delivery.postcode"
              required
              maxlength="20"
              autocomplete="postal-code"
              class="border p-1 w-full max-w-md"
            >
          </div>
        </fieldset>


        <fieldset class="mt-7">
          <legend>Payment information</legend>

          <div>
            <label for="cardName">
              Cardholder name
            </label><br>

            <input
              id="cardName"
              name="cardName"
              [(ngModel)]="payment.cardholder_name"
              required
              maxlength="100"
              autocomplete="cc-name"
              class="w-full border p-1 max-w-md"
            >
          </div>

          <div class="mt-3">
            <label for="cardNumber">
              Card number
            </label><br>

            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              [(ngModel)]="payment.card_number"
              required
              minlength="12"
              maxlength="23"
              autocomplete="cc-number"
              inputmode="numeric"
              aria-describedby="payment-help"
              class="border p-1 max-w-md w-full"
            >
          </div>

          <div class="mt-3">
            <label for="expiry">
              Expiry date (MM/YY)
            </label><br>

            <input
              id="expiry"
              name="expiry"
              [(ngModel)]="payment.expiry_date"
              required
              type="text"
              pattern="[0-9]{2}/[0-9]{2}"
              placeholder="12/30"
              autocomplete="cc-exp"
              aria-describedby="expiry-help"
              class="p-1 border"
            >

            <p id="expiry-help">
              Enter the expiry as MM/YY, for example 12/30.
            </p>
          </div>

          <div class="mt-3">
            <label for="securityCode">CVV</label><br>

            <input
              id="securityCode"
              name="securityCode"
              type="password"
              [(ngModel)]="payment.security_code"
              required
              pattern="[0-9]{3,4}"
              maxlength="4"
              inputmode="numeric"
              autocomplete="cc-csc"
              aria-describedby="cvv-help"
              class="border p-1"
            >

            <p id="cvv-help">
              Enter three or four digits.
            </p>
          </div>
        </fieldset>


        <div
          *ngIf="error"
          role="alert"
          aria-live="assertive"
          class="text-red-700 mt-5"
        >
          <p>{{ error }}</p>

          <ul *ngIf="suggestions.length">
            <li *ngFor="let suggestion of suggestions">
              {{ suggestion }}
            </li>
          </ul>
        </div>

        <button
          type="submit"
          [disabled]="submitting || !quantityValid"
          class="mt-6 px-5 border py-2"
        >
          {{ submitting ? 'Submitting...' : 'Place Order' }}
        </button>

        <p
          *ngIf="submitting"
          role="status"
          aria-live="polite"
        >
          Submitting your order...
        </p>
      </form>
    </div>
  `
})
export class CheckoutComponent implements OnInit {

  product: any = null;
  quantity = 0;

  loading = true;
  submitting = false;

  error = '';
  loadError = '';
  suggestions: string[] = [];


  customer = {
    full_name: '',
    email: ''
  };

  delivery = {
    address_line: '',
    city: '',
    postcode: ''
  };

  payment = {
    cardholder_name: '',
    card_number: '',
    expiry_date: '',
    security_code: ''
  };


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  get total() {
    if (!this.product) return 0;

    return this.product.price * this.quantity;
  }

  get quantityValid() {
    if (!this.product)
      return false;

    const max = Math.min(
      this.product.available_quantity,
      5
    );

    return Number.isInteger(this.quantity)
      && this.quantity >= 1
      && this.quantity <= max;
  }


  async ngOnInit() {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.quantity = Number(
      this.route.snapshot.queryParamMap.get('quantity')
    );

    if (!Number.isInteger(id)) {
      this.loadError = 'Invalid product.';
      this.loading = false;

      this.cdr.detectChanges();
      return;
    }

    try {
      const response = await getProduct(id);

      this.product = response.data;
    }
    catch (err) {
      console.error(err);

      this.loadError = err instanceof Error
        ? err.message
        : 'Checkout could not be loaded.';
    }
    finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }


  async submit(form: NgForm) {
    this.error = '';
    this.suggestions = [];

    if (form.invalid) {
      form.control.markAllAsTouched();

      this.error =
        'Some of the information entered is missing or invalid. Check the form and try again.';

      return;
    }

    if (!this.quantityValid) {
      this.error =
        'The selected quantity is no longer available. Choose another quantity.';

      return;
    }


    const order = {
      product_id: this.product.id,
      quantity: this.quantity,

      customer: {
        full_name: this.customer.full_name,
        email: this.customer.email
      },

      delivery_address: {
        address_line: this.delivery.address_line,
        city: this.delivery.city,
        postcode: this.delivery.postcode
      },

      payment: {
        cardholder_name: this.payment.cardholder_name,
        card_number: this.payment.card_number,
        expiry_date: this.payment.expiry_date,
        security_code: this.payment.security_code
      }
    };


    this.submitting = true;
    this.cdr.detectChanges();

    try {
      const response = await createOrder(order);

      this.submitting = false;
      this.cdr.detectChanges();

      await this.router.navigate([
        '/order',
        response.data.id
      ]);
    }
    catch (err: any) {
      console.error(err);

      this.error = err instanceof Error
        ? err.message
        : 'There was a problem completing the order.';

      const nudges = err?.accessibility?.nudges || [];

      this.suggestions = nudges
        .filter((nudge: any) =>
          nudge.success_criterion === '3.3.3'
        )
        .flatMap((nudge: any) =>
          Array.isArray(nudge.values)
            ? nudge.values
            : []
        );

      this.submitting = false;
      this.cdr.detectChanges();
    }
  }
}