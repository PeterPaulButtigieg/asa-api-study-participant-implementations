import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="border-b p-4 bg-white">
        <div class="max-w-5xl mx-auto">
          <a routerLink="/" class="font-bold">
            Stazzjonarju
          </a>
        </div>
      </header>

      <main class="max-w-5xl p-6 mx-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {}