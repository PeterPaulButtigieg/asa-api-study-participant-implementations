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

// @ts-ignore - api.js is plain JavaScript
import { createOrder, getProduct } from '../api.js';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  template: `
    <h1>Checkout</h1>

    <p *ngIf="loading">Loading...</p>

    <p *ngIf="loadError" class="text-red-700">
      {{ loadError }}
    </p>

    <div *ngIf="product && !loading">

      <section class="border p-4 mb-8">
        <h2>Cart</h2>

        <p>
          <strong>{{ product.name }}</strong>
        </p>

        <p>Quantity: {{ quantity }}</p>

        <p>
          Total:
          {{ total | number:'1.2-2' }}
          {{ product.currency }}
        </p>

        <a [routerLink]="['/product', product.id]">
          Change quantity
        </a>

        <p *ngIf="!quantityValid" class="text-red-700">
          The selected quantity is not available. Please go back and
          choose another quantity.
        </p>
      </section>

      <form
        #checkoutForm="ngForm"
        (ngSubmit)="submit(checkoutForm)"
      >
        <h2>Customer information</h2>

        <div class="mb-3">
          <label for="fullName">Full name</label><br>

          <input
            id="fullName"
            name="fullName"
            type="text"
            [(ngModel)]="customer.full_name"
            required
            maxlength="100"
            class="border p-1 w-full max-w-md"
          >
        </div>

        <div>
          <label for="email">Email address</label><br>

          <input
            id="email"
            name="email"
            type="email"
            [(ngModel)]="customer.email"
            required
            class="border w-full max-w-md p-1"
          >
        </div>


        <h2 class="mt-7">Delivery address</h2>

        <div>
          <label for="address">Address line</label><br>

          <input
            id="address"
            name="address"
            type="text"
            [(ngModel)]="delivery.address_line"
            required
            maxlength="200"
            class="border p-1 w-full max-w-md"
          >
        </div>

        <div class="mt-3">
          <label for="city">Town or city</label><br>

          <input
            id="city"
            name="city"
            type="text"
            [(ngModel)]="delivery.city"
            required
            maxlength="100"
            class="border p-1 max-w-md w-full"
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
            class="w-full border max-w-md p-1"
          >
        </div>


        <h2 class="mt-7">Payment information</h2>

        
        <div>
          <label for="cardName">Cardholder name</label><br>

          <input
            id="cardName"
            name="cardName"
            type="text"
            [(ngModel)]="payment.cardholder_name"
            required
            maxlength="100"
            class="border max-w-md w-full p-1"
          >
        </div>

        <div class="mt-3">
          <label for="cardNumber">Card number</label><br>

          <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            [(ngModel)]="payment.card_number"
            required
            minlength="12"
            maxlength="23"
            class="border p-1 max-w-md w-full"
          >
        </div>

        <div class="mt-3">
          <label for="expiry">Expiry date (MM/YY)</label><br>

          <input
            id="expiry"
            name="expiry"
            type="text"
            [(ngModel)]="payment.expiry_date"
            required
            pattern="[0-9]{2}/[0-9]{2}"
            placeholder="12/30"
            class="border p-1"
          >
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
            class="p-1 border"
          >
        </div>

        <p *ngIf="error" class="text-red-700 mt-4">
          {{ error }}
        </p>

        <button
          type="submit"
          [disabled]="submitting || !quantityValid"
          class="border px-5 py-2 mt-6"
        >
          {{ submitting ? 'Submitting...' : 'Place Order' }}
        </button>
      </form>
    </div>
  `
})
export class CheckoutComponent implements OnInit {

  product: any = null;
  quantity = 0;

  loading = true;
  submitting = false;

  loadError = '';
  error = '';

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
  ) {
  }

  get quantityValid() {
    if (!this.product) {
      return false;
    }

    const maximum = Math.min(
      5,
      this.product.available_quantity
    );

    return (
      Number.isInteger(this.quantity) &&
      this.quantity >= 1 &&
      this.quantity <= maximum
    );
  }

  get total() {
    if (!this.product) {
      return 0;
    }

    return this.product.price * this.quantity;
  }

  async ngOnInit() {
    const productId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.quantity = Number(
      this.route.snapshot.queryParamMap.get('quantity')
    );

    if (!Number.isInteger(productId)) {
      this.loadError = 'Invalid product.';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    try {
      const response = await getProduct(productId);

      console.log('Checkout product:', response);

      this.product = response.data;
    } catch (err) {
      console.error(err);

      this.loadError = err instanceof Error
        ? err.message
        : 'Could not load checkout.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async submit(form: NgForm) {
    this.error = '';

    if (form.invalid) {
      form.control.markAllAsTouched();

      this.error =
        'Please fill in all fields correctly.';

      return;
    }

    if (!this.quantityValid) {
      this.error =
        'The selected quantity is no longer available.';

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

    try {
      const response = await createOrder(order);

      console.log('Order created:', response);

      await this.router.navigate([
        '/order',
        response.data.id
      ]);
    } catch (err) {
      console.error(err);

      this.error = err instanceof Error
        ? err.message
        : 'The order could not be completed.';
    } finally {
      this.submitting = false;
      this.cdr.detectChanges();
    }
  }
}