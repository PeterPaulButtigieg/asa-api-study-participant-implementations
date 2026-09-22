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

// @ts-ignore - api.js is plain JavaScript
import { getOrder } from '../api.js';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  template: `
    <p *ngIf="loading">
      Loading order...
    </p>

    <p *ngIf="error" class="text-red-700">
      {{ error }}
    </p>

    <section *ngIf="order && !loading">
      <h1>Order successful</h1>

      <p>{{ order.message }}</p>

      <p>
        <strong>Order ID:</strong>
        {{ order.id }}
      </p>

      <p>
        <strong>Status:</strong>
        {{ order.status }}
      </p>

      <h2 class="mt-6">Order details</h2>

      <div
        *ngFor="let item of order.items"
        class="border p-4 mb-3"
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
      </div>

      <p>
        <strong>Total items:</strong>
        {{ order.item_count }}
      </p>

      <p>
        <strong>Order total:</strong>
        {{ order.total | number:'1.2-2' }}
        {{ order.currency }}
      </p>

      <p class="mt-6">
        <a routerLink="/">Back to products</a>
      </p>
    </section>
  `
})
export class OrderComponent implements OnInit {

  order: any = null;

  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
  }

  async ngOnInit() {
    const orderId =
      this.route.snapshot.paramMap.get('id');

    if (!orderId) {
      this.error = 'Invalid order.';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    try {
      const response = await getOrder(orderId);

      console.log('Order response:', response);

      this.order = response.data;
    } catch (err) {
      console.error(err);

      this.error = err instanceof Error
        ? err.message
        : 'Could not load the order.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}