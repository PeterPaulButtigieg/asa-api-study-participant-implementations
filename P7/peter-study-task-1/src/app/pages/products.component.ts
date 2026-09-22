import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

// @ts-ignore
import { getProducts } from '../api.js';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  template: `
    <h1>Products</h1>

    <p *ngIf="loading">Loading products...</p>

    <p *ngIf="error" class="text-red-700">
      {{ error }}
    </p>

    <div class="grid gap-6 md:grid-cols-2 mt-5" *ngIf="!loading">
      <article
        *ngFor="let product of products"
        class="border p-4 bg-white"
      >
        <img
          [src]="product.image_url"
          [alt]="product.name"
          class="max-w-xs w-full mb-3"
        >

        <h2>{{ product.name }}</h2>

        <p>
          {{ product.price | number:'1.2-2' }}
          {{ product.currency }}
        </p>

        <ul>
          <li *ngFor="let feature of product.features">
            {{ feature }}
          </li>
        </ul>

        <p class="mt-4">
          <a [routerLink]="['/product', product.id]">
            View Product
          </a>
        </p>
      </article>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  loading = true;
  error = '';

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    try {
      const response = await getProducts();

      console.log('API response:', response);

      this.products = response.data;
    } catch (err) {
      console.error(err);

      this.error = err instanceof Error
        ? err.message
        : 'Could not load products.';
    } finally {
      this.loading = false;

      this.cdr.detectChanges();
    }
  }
}