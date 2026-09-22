import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { RouterLink } from '@angular/router';

// @ts-ignore
import { getProducts } from '../api.js';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h1>Products</h1>

    <p *ngIf="loading" role="status" aria-live="polite">
      Loading products...
    </p>

    <p
      *ngIf="error"
      role="alert"
      class="text-red-700"
    >
      {{ error }}
    </p>

    <ul
      *ngIf="!loading"
      class="grid md:grid-cols-2 gap-6 mt-5 list-none p-0"
    >
      <li
        *ngFor="let product of products"
        class="bg-white border p-4"
      >
        <article>
          <img
            [src]="product.image_url"
            [alt]="product.name"
            class="w-full max-w-xs mb-3"
          >

          <h2>{{ product.name }}</h2>

          <p>
            {{ product.price | number:'1.2-2' }}
            {{ product.currency }}
          </p>

          <h3>Features</h3>

          <ul>
            <li *ngFor="let feature of product.features">
              {{ feature }}
            </li>
          </ul>

          <p class="mt-4">
            <a
              [routerLink]="['/product', product.id]"
              [attr.aria-label]="'View Product: ' + product.name"
            >
              View Product
            </a>
          </p>
        </article>
      </li>
    </ul>
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

      this.products = response.data;
    }
    catch (err) {
      console.error(err);

      this.error = err instanceof Error
        ? err.message
        : 'There was a problem loading the products.';
    }
    finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}