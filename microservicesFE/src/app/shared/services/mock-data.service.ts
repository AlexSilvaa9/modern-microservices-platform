import { Injectable } from '@angular/core';
import { Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  getMockProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Smartphone Galaxy S24',
        description: 'Último modelo con cámara de 108MP, pantalla AMOLED de 6.8" y procesador Snapdragon 8 Gen 3.',
        price: 899.99,
        stock: 25,
        category: 'Electrónicos',
        imageUrl: '/assets/images/smartphone.svg',
        active: true,
        rating: 4.7,
        reviews: 128
      },
      {
        id: '2',
        name: 'Laptop Gaming ROG',
        description: 'Laptop gaming con RTX 4070, Intel i7-13700H, 32GB RAM y SSD 1TB.',
        price: 1499.99,
        stock: 15,
        category: 'Electrónicos',
        imageUrl: '/assets/images/laptop.svg',
        active: true,
        rating: 4.8,
        reviews: 89
      },
      {
        id: '3',
        name: 'Auriculares Sony WH-1000XM5',
        description: 'Auriculares inalámbricos con cancelación de ruido líder en la industria.',
        price: 349.99,
        stock: 40,
        category: 'Electrónicos',
        imageUrl: '/assets/images/auriculares.svg',
        active: true,
        rating: 4.9,
        reviews: 256
      },
      {
        id: '4',
        name: 'Tablet iPad Pro 12.9"',
        description: 'iPad Pro con chip M2, pantalla Liquid Retina XDR de 12.9" y compatibilidad con Apple Pencil.',
        price: 1099.99,
        stock: 20,
        category: 'Electrónicos',
        imageUrl: '/assets/images/tablet.svg',
        active: true,
        rating: 4.6,
        reviews: 112
      },
      {
        id: '5',
        name: 'Camiseta Premium Cotton',
        description: 'Camiseta de algodón 100% orgánico, corte moderno y diseño minimalista.',
        price: 29.99,
        stock: 100,
        category: 'Ropa',
        imageUrl: '/assets/images/camiseta.svg',
        active: true,
        rating: 4.3,
        reviews: 78
      },
      {
        id: '6',
        name: 'Jeans Denim Clásico',
        description: 'Jeans de mezclilla premium con corte recto clásico. Tela duradera y cómoda.',
        price: 79.99,
        stock: 60,
        category: 'Ropa',
        imageUrl: '/assets/images/jeans.svg',
        active: true,
        rating: 4.4,
        reviews: 145
      },
      {
        id: '7',
        name: 'Zapatillas Running Pro',
        description: 'Zapatillas deportivas con tecnología de amortiguación avanzada.',
        price: 129.99,
        stock: 45,
        category: 'Ropa',
        imageUrl: '/assets/images/zapatillas.svg',
        active: true,
        rating: 4.5,
        reviews: 167
      },
      {
        id: '8',
        name: 'Chaqueta Impermeable',
        description: 'Chaqueta resistente al agua con capucha ajustable. Ideal para actividades outdoor.',
        price: 159.99,
        stock: 30,
        category: 'Ropa',
        imageUrl: '/assets/images/chaqueta.svg',
        active: true,
        rating: 4.2,
        reviews: 94
      },
      {
        id: '9',
        name: 'Libro "Desarrollo Web Moderno"',
        description: 'Guía completa sobre desarrollo web con las últimas tecnologías. Incluye ejemplos prácticos.',
        price: 45.99,
        stock: 75,
        category: 'Hogar',
        imageUrl: '/assets/images/libro.svg',
        active: true,
        rating: 4.7,
        reviews: 67
      },
      {
        id: '10',
        name: 'Lámpara LED Inteligente',
        description: 'Lámpara conectada con control por app, regulable y con 16 millones de colores.',
        price: 89.99,
        stock: 35,
        category: 'Hogar',
        imageUrl: '/assets/images/lampara.svg',
        active: true,
        rating: 4.1,
        reviews: 88
      },
      {
        id: '11',
        name: 'Sofá Modular 3 Plazas',
        description: 'Sofá cómodo y elegante con tapizado en tela premium. Estructura de madera maciza.',
        price: 799.99,
        stock: 8,
        category: 'Hogar',
        imageUrl: '/assets/images/sofa.svg',
        active: true,
        rating: 4.6,
        reviews: 76
      },
      {
        id: '12',
        name: 'Mesa de Comedor Extensible',
        description: 'Mesa de madera maciza extensible para 4-8 personas. Acabado natural y diseño atemporal.',
        price: 449.99,
        stock: 12,
        category: 'Hogar',
        imageUrl: '/assets/images/mesa.svg',
        active: true,
        rating: 4.4,
        reviews: 134
      }
    ];
  }

  getMockCategories(): string[] {
    const products = this.getMockProducts();
    const categories = [...new Set(products.map(p => p.category))];
    return categories.sort();
  }
}
