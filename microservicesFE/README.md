# MicroStore - Frontend Angular

Una aplicación frontend moderna desarrollada en Angular 19 para un sistema de microservicios de e-commerce, que incluye catálogo de productos y carrito de compras.

## 🚀 Características

- **Arquitectura Moderna**: Desarrollado con Angular 19 y standalone components
- **Gestión de Estado**: NgRx para manejo profesional del estado de la aplicación
- **UI/UX Atractiva**: Bootstrap 5 con componentes personalizados y responsive design
- **Microservicios**: Integración con servicios de catálogo y carrito de Spring Cloud
- **TypeScript**: Código completamente tipado para mayor robustez
- **Componentes Reutilizables**: Arquitectura modular y escalable

## 📁 Estructura del Proyecto

```
# MicroStore - Frontend Angular Profesional

Una aplicación frontend moderna y profesional desarrollada en Angular 19 para un sistema de microservicios de e-commerce, que incluye catálogo de productos y carrito de compras con integración completa al backend.

## 🚀 Características

- **Arquitectura Moderna**: Angular 19 con standalone components y TypeScript
- **Gestión de Estado**: NgRx 18 para manejo profesional del estado de la aplicación
- **UI/UX Atractiva**: Bootstrap 5 con componentes personalizados y responsive design
- **Integración Backend**: Comunicación con microservicios Spring Cloud Gateway
- **Datos Mock**: Fallback automático para desarrollo sin backend
- **Componentes Reutilizables**: Arquitectura modular y escalable

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/
│   ├── core/                    # Servicios y funcionalidades core
│   │   ├── services/           # Servicios principales (API, Loading, Notifications)
│   │   ├── interceptors/       # HTTP interceptors
│   │   └── guards/             # Route guards
│   ├── shared/                  # Componentes y modelos compartidos
│   │   ├── components/         # Componentes reutilizables
│   │   ├── services/          # MockDataService y otros utilitarios
│   │   └── models/            # Interfaces y tipos TypeScript
│   ├── features/               # Módulos de funcionalidades
│   │   ├── home/               # Página de inicio
│   │   ├── catalog/            # Catálogo de productos
│   │   │   ├── components/     # ProductCard, ProductFilter, ProductGrid
│   │   │   ├── pages/          # CatalogPage, ProductDetailPage
│   │   │   └── services/       # CatalogService
│   │   └── cart/               # Carrito de compras
│   │       ├── components/     # CartSidebar, CartItem, CartSummary
│   │       ├── pages/          # CartPage
│   │       └── services/       # CartService
│   ├── store/                   # NgRx Store
│   │   ├── catalog/            # Estado del catálogo
│   │   └── cart/               # Estado del carrito
│   └── layout/                 # Header, Footer y componentes de layout
├── assets/                     # Recursos estáticos
│   └── images/                 # Imágenes SVG placeholder
└── environments/              # Configuración de entornos
```

## 🛠️ Tecnologías y Stack

- **Angular 19**: Framework principal
- **NgRx 18**: Gestión de estado
- **Bootstrap 5**: Framework CSS
- **Bootstrap Icons**: Iconografía
- **TypeScript**: Lenguaje de programación
- **SCSS**: Preprocesador CSS
- **RxJS**: Programación reactiva

## 🔧 Configuración y Desarrollo

### Prerequisitos

- Node.js 18 o superior
- npm 9 o superior
- Angular CLI 19

### Instalación

1. **Clonar el repositorio**
   ```bash
   cd microservicesFE
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Editar `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api',
     gatewayUrl: 'http://localhost:8080',
     services: {
       catalog: 'http://localhost:8081',
       cart: 'http://localhost:8082',
       user: 'http://localhost:8083'
     }
   };
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   npm start
   ```

La aplicación estará disponible en `http://localhost:4200`

---

**Desarrollado con ❤️ usando Angular y las mejores prácticas de desarrollo frontend**
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
