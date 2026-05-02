# Angular Folder Architecture

This folder structure is organized following the LIFT principle and domain-driven design structure for Angular Applications.

## 1. Core (`/core`)
The `core` module is designed for components, services, models, guards, and interceptors that are central to the application and **should only be instantiated once** (singletons). 

- **/interceptors**: Intercept HTTP requests (e.g., attaching Auth Bearer tokens, Error tracking).
- **/guards**: Route guards to protect paths (e.g., AuthGuard).
- **/services/api**: Centralized location for all core backend API calls. 
- **/services/global-state**: If using RxJS `BehaviorSubject` for basic state management.
- **/models**: Core interfaces and domain mapping.

## 2. Shared (`/shared`)
The `shared` module handles reusable components, directives, and pipes that are shared across different features of the application. **Do not** add singleton services here.

- **/components**: Dumb/Presentational components like custom buttons, cards, dialogs.
- **/pipes**: Custom pipes.
- **/directives**: Custom attributes or structural directives.
- **/ui**: Third-party wrapper modules (e.g., abstracting Material UI or complex Tailwind components).

## 3. Features (`/features`)
Contains specific functionality or a domain of the application (e.g., Auth, Dashboard, UserProfile). Group functionally related components, services, and models together here.
Features should be **lazy loaded** via the main routing file to optimize application loading time.

## 4. Layout (`/layout`)
Contains the outer framing of the application. Components such as `header`, `footer`, and `sidebar` that wrap around the `<router-outlet>` belong here.

## Generalizations to follow
- **Dependency Rule**: `core` and `shared` modules should not import anything from `features`. `features` can import from `core` and `shared`.
- Define backend call services in the appropriate domain folder: If an API call is cross-domain, place it in `core/services/api`. If an API call is strictly used by a single feature, place it completely within `features/<feature-name>/services`.
