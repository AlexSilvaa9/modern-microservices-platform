import { Routes } from '@angular/router';
import { Component } from '@angular/core';

// Componente temporal para home
@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div style="text-align: center; padding: 40px;">
      <h2>🏠 Página de Inicio</h2>
      <p>Bienvenido a MicroStore</p>
      <p><strong>Funcionalidades disponibles:</strong></p>
      <div style="margin: 20px 0;">
        <a href="/catalog" style="margin: 0 10px; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">📦 Catálogo</a>
        <a href="/cart" style="margin: 0 10px; padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 5px;">🛒 Carrito</a>
      </div>
    </div>
  `
})
export class HomeComponent {}

// Componente temporal para catálogo
@Component({
  selector: 'app-catalog',
  standalone: true,
  template: `
    <div style="padding: 20px;">
      <h2>📦 Catálogo de Productos</h2>
      <p>Esta sección mostrará el catálogo de productos.</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px;">
        <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
          <h4>📱 Smartphone</h4>
          <p>Precio: $899.99</p>
          <button style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px;">Agregar al carrito</button>
        </div>
        <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
          <h4>💻 Laptop</h4>
          <p>Precio: $1499.99</p>
          <button style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px;">Agregar al carrito</button>
        </div>
        <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
          <h4>🎧 Auriculares</h4>
          <p>Precio: $349.99</p>
          <button style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px;">Agregar al carrito</button>
        </div>
      </div>
      <p style="margin-top: 30px;"><a href="/">← Volver al inicio</a></p>
    </div>
  `
})
export class CatalogComponent {}

// Componente temporal para carrito
@Component({
  selector: 'app-cart',
  standalone: true,
  template: `
    <div style="padding: 20px;">
      <h2>🛒 Carrito de Compras</h2>
      <p>Esta sección mostrará el carrito de compras.</p>
      <div style="border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4>Tu carrito está vacío</h4>
        <p>Agrega algunos productos desde el <a href="/catalog">catálogo</a></p>
      </div>
      <p><a href="/">← Volver al inicio</a></p>
    </div>
  `
})
export class CartComponent {}

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '' }
];
