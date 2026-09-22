import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

// @ts-ignore
import { getOrder } from '../api.js';


@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <p
      *ngIf="loading"
      role="status"
      aria-live="polite"
    >
      Loading order...
    </p>

    <p
      *ngIf="error"
      role="alert"
      aria-live="assertive"
      class="text-red-700"
    >
      {{ error }}
    </p>


    <main *ngIf="order && !loading">
      <h1>Order successful</h1>

      <p
        role="status"
        aria-live="polite"
      >
        {{ order.message }}
      </p>

      <section aria-labelledby="confirmation-heading">
        <h2 id="confirmation-heading">
          Confirmation
        </h2>

        <p>
          <strong>Order ID:</strong>
          {{ order.id }}
        </p>

        <p>
          <strong>Status:</strong>
          {{ order.status }}
        </p>
      </section>


      <section
        aria-labelledby="items-heading"
        class="mt-6"
      >
        <h2 id="items-heading">
          Order details
        </h2>

        <ul class="list-none p-0">
          <li
            *ngFor="let item of order.items"
            class="p-4 border mb-3"
          >
            <h3>{{ item.product_name }}</h3>

            <p>
              Quantity: {{ item.quantity }}
            </p>

            <p>
              Unit price:
              {{ item.unit_price | number:'1.2-2' }}
              {{ item.currency }}
            </p>

            <p>
              Line total:
              {{ item.line_total | number:'1.2-2' }}
              {{ item.currency }}
            </p>
          </li>
        </ul>
      </section>


      <section aria-labelledby="total-heading">
        <h2 id="total-heading">Order total</h2>

        <p>
          Total items:
          <strong>{{ order.item_count }}</strong>
        </p>

        <p>
          Total:
          <strong>
            {{ order.total | number:'1.2-2' }}
            {{ order.currency }}
          </strong>
        </p>
      </section>

      <p class="mt-6">
        <a routerLink="/">
          Back to products
        </a>
      </p>
    </main>
  `
})
export class OrderComponent implements OnInit {

  order: any = null;

  error = '';
  loading = true;


  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}


  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'Invalid order.';
      this.loading = false;
      this.cdr.detectChanges();

      return;
    }


    try {
      const response = await getOrder(id);

      this.order = response.data;
    } catch (err) {
      console.error(err);

      this.error = err instanceof Error
        ? err.message
        : 'The order could not be loaded.';
    }
    finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}