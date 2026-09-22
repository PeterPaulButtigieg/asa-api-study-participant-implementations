import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

// @ts-ignore
import { getProduct } from '../api.js';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  template: `
    <p
      *ngIf="loading"
      role="status"
      aria-live="polite"
    >
      Loading product...
    </p>

    <p
      *ngIf="error"
      role="alert"
      aria-live="assertive"
      class="text-red-700"
    >
      {{ error }}
    </p>

    <article
      *ngIf="product && !loading"
      class="mt-4 grid gap-6 md:grid-cols-2"
    >
      <div>
        <img
          [src]="product.image_url"
          [alt]="product.name"
          class="max-w-md w-full"
        >
      </div>

      <section aria-labelledby="product-name">
        <h1 id="product-name">
          {{ product.name }}
        </h1>

        <p>{{ product.description }}</p>

        <p>
          <strong>
            {{ product.price | number:'1.2-2' }}
            {{ product.currency }}
          </strong>
        </p>

        <h2>Features</h2>

        <ul>
          <li *ngFor="let feature of product.features">
            {{ feature }}
          </li>
        </ul>

        <h2>Availability</h2>

        <p>
          {{ product.available_quantity }} available
        </p>

        <div class="mt-6">
          <label for="quantity">
            Quantity
          </label>

          <input
            id="quantity"
            name="quantity"
            type="number"
            [(ngModel)]="quantity"
            min="1"
            [max]="maxQuantity"
            [disabled]="maxQuantity === 0"
            aria-describedby="quantity-help"
            class="ml-3 border p-1 w-20"
          >

          <p id="quantity-help">
            Choose between 1 and {{ maxQuantity }}.
          </p>
        </div>

        <p
          *ngIf="maxQuantity === 0"
          role="status"
        >
          This product is currently unavailable.
        </p>

        <p
          *ngIf="quantityError"
          role="alert"
          class="text-red-700"
        >
          {{ quantityError }}
        </p>

        <button
          type="button"
          (click)="buyNow()"
          [disabled]="maxQuantity === 0"
          class="border mt-5 px-5 py-2"
        >
          Buy Now
        </button>
      </section>
    </article>
  `
})
export class ProductComponent implements OnInit {
  product: any;

  quantity = 1;
  loading = true;

  error = '';
  quantityError = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  get maxQuantity() {
    if (!this.product)
      return 0;

    return Math.min(
      this.product.available_quantity,
      5
    );
  }


  async ngOnInit() {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!Number.isInteger(id)) {
      this.error = 'Invalid product.';
      this.loading = false;
      this.cdr.detectChanges();

      return;
    }

    try {
      const result = await getProduct(id);
      this.product = result.data;

      if (this.maxQuantity < 1) {
        this.quantity = 0;
      }
    } catch (err) {
      console.error(err);

      this.error = err instanceof Error
        ? err.message
        : 'Could not load this product.';
    }

    this.loading = false;
    this.cdr.detectChanges();
  }


  buyNow() {
    this.quantityError = '';

    if (
      !Number.isInteger(this.quantity) ||
      this.quantity < 1 ||
      this.quantity > this.maxQuantity
    ) {
      this.quantityError =
        `Quantity must be between 1 and ${this.maxQuantity}.`;

      return;
    }

    this.router.navigate(
      ['/checkout', this.product.id],
      {
        queryParams: { quantity: this.quantity }
      }
    );
  }
}