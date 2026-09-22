import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

// @ts-ignore - api.js is plain JavaScript
import { getProduct } from '../api.js';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  template: `

    <p *ngIf="loading">Loading product...</p>

    <p *ngIf="error" class="text-red-700">
      {{ error }}
    </p>

    <div
      *ngIf="product && !loading"
      class="grid md:grid-cols-2 gap-6 mt-4"
    >
      <div>
        <img
          [src]="product.image_url"
          [alt]="product.name"
          class="w-full max-w-md"
        >
      </div>

      <section>
        <h1>{{ product.name }}</h1>

        <p>{{ product.description }}</p>

        <h2>
          {{ product.price | number:'1.2-2' }}
          {{ product.currency }}
        </h2>

        <h3>Features</h3>

        <ul>
          <li *ngFor="let feature of product.features">
            {{ feature }}
          </li>
        </ul>

        <p>
          Available: {{ product.available_quantity }}
        </p>

        <div class="mt-6">
          <label for="quantity">Quantity</label>

          <input
            id="quantity"
            type="number"
            [(ngModel)]="quantity"
            min="1"
            [max]="maxQuantity"
            [disabled]="maxQuantity === 0"
            class="border ml-3 w-20 p-1"
          >
        </div>

        <p *ngIf="maxQuantity === 0">
          This product is currently unavailable.
        </p>

        <p *ngIf="quantityError" class="text-red-700">
          {{ quantityError }}
        </p>

        <button
          type="button"
          (click)="buyNow()"
          [disabled]="maxQuantity === 0"
          class="mt-5 border px-5 py-2"
        >
          Buy Now
        </button>
      </section>
    </div>
  `
})
export class ProductComponent implements OnInit {
  product: any = null;
  quantity = 1;

  loading = true;
  error = '';
  quantityError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
  }

  get maxQuantity() {
    if (!this.product) {
      return 0;
    }

    return Math.min(5, this.product.available_quantity);
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
      const response = await getProduct(id);

      console.log('Product response:', response);

      this.product = response.data;

      if (this.maxQuantity === 0) {
        this.quantity = 0;
      }
    } catch (err) {
      console.error(err);

      this.error = err instanceof Error
        ? err.message
        : 'Could not load the product.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  buyNow() {
    this.quantityError = '';

    if (
      !Number.isInteger(this.quantity) ||
      this.quantity < 1 ||
      this.quantity > this.maxQuantity
    ) {
      this.quantityError =
        `Choose a quantity between 1 and ${this.maxQuantity}.`;

      return;
    }

    this.router.navigate(
      ['/checkout', this.product.id],
      {
        queryParams: {
          quantity: this.quantity
        }
      }
    );
  }
}