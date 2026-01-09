import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ProductFilter } from '../../../shared/models';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="filterForm" class="filter-container">
      <div class="row">
        <div class="col-md-3">
          <div class="mb-3">
            <label for="searchInput" class="form-label">Buscar</label>
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                id="searchInput"
                placeholder="Buscar productos..."
                formControlName="search">
              <button class="btn btn-outline-secondary" type="button" (click)="clearSearch()">
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="col-md-2">
          <div class="mb-3">
            <label for="categorySelect" class="form-label">Categoría</label>
            <select class="form-select" id="categorySelect" formControlName="category">
              <option value="">Todas las categorías</option>
              <option *ngFor="let category of categories" [value]="category">
                {{ category | titlecase }}
              </option>
            </select>
          </div>
        </div>

        <div class="col-md-2">
          <div class="mb-3">
            <label for="minPrice" class="form-label">Precio mínimo</label>
            <input
              type="number"
              class="form-control"
              id="minPrice"
              placeholder="0"
              min="0"
              formControlName="minPrice">
          </div>
        </div>

        <div class="col-md-2">
          <div class="mb-3">
            <label for="maxPrice" class="form-label">Precio máximo</label>
            <input
              type="number"
              class="form-control"
              id="maxPrice"
              placeholder="999999"
              min="0"
              formControlName="maxPrice">
          </div>
        </div>

        <div class="col-md-2">
          <div class="mb-3">
            <label for="sortBy" class="form-label">Ordenar por</label>
            <select class="form-select" id="sortBy" formControlName="sortBy">
              <option value="">Sin orden específico</option>
              <option value="name">Nombre</option>
              <option value="price">Precio</option>
              <option value="rating">Valoración</option>
            </select>
          </div>
        </div>

        <div class="col-md-1">
          <div class="mb-3">
            <label for="sortOrder" class="form-label">Orden</label>
            <select class="form-select" id="sortOrder" formControlName="sortOrder">
              <option value="asc">
                <i class="bi bi-sort-up"></i> Asc
              </option>
              <option value="desc">
                <i class="bi bi-sort-down"></i> Desc
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="d-flex gap-2 flex-wrap">
            <button class="btn btn-primary btn-sm" (click)="applyFilters()">
              <i class="bi bi-search me-1"></i>
              Aplicar filtros
            </button>
            <button class="btn btn-outline-secondary btn-sm" (click)="clearAllFilters()">
              <i class="bi bi-x-circle me-1"></i>
              Limpiar filtros
            </button>
            <div class="ms-auto d-flex align-items-center">
              <small class="text-muted">
                {{ totalProducts }} producto{{ totalProducts !== 1 ? 's' : '' }} encontrado{{ totalProducts !== 1 ? 's' : '' }}
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div class="row mt-3" *ngIf="hasActiveFilters()">
        <div class="col-12">
          <div class="active-filters">
            <span class="badge bg-light text-dark me-2">Filtros activos:</span>
            <span *ngIf="currentFilter.search" class="badge bg-primary me-1">
              Búsqueda: "{{ currentFilter.search }}"
              <i class="bi bi-x ms-1" (click)="removeFilter('search')" style="cursor: pointer;"></i>
            </span>
            <span *ngIf="currentFilter.category" class="badge bg-info me-1">
              Categoría: {{ currentFilter.category | titlecase }}
              <i class="bi bi-x ms-1" (click)="removeFilter('category')" style="cursor: pointer;"></i>
            </span>
            <span *ngIf="currentFilter.minPrice" class="badge bg-success me-1">
              Precio mín: {{ currentFilter.minPrice | currency:'USD':'symbol':'1.0-0' }}
              <i class="bi bi-x ms-1" (click)="removeFilter('minPrice')" style="cursor: pointer;"></i>
            </span>
            <span *ngIf="currentFilter.maxPrice" class="badge bg-warning me-1">
              Precio máx: {{ currentFilter.maxPrice | currency:'USD':'symbol':'1.0-0' }}
              <i class="bi bi-x ms-1" (click)="removeFilter('maxPrice')" style="cursor: pointer;"></i>
            </span>
            <span *ngIf="currentFilter.sortBy" class="badge bg-secondary me-1">
              Orden: {{ currentFilter.sortBy | titlecase }} ({{ currentFilter.sortOrder === 'asc' ? 'Ascendente' : 'Descendente' }})
              <i class="bi bi-x ms-1" (click)="removeFilter('sortBy')" style="cursor: pointer;"></i>
            </span>
          </div>
        </div>
      </div>
    </form>
  `,
  styles: [`
    .filter-container {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-label {
      font-weight: 600;
      color: #495057;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .form-control, .form-select {
      font-size: 0.9rem;
    }

    .active-filters {
      padding: 0.75rem;
      background-color: #fff;
      border-radius: 6px;
      border: 1px solid #dee2e6;
    }

    .badge {
      font-size: 0.75rem;
    }

    .badge i {
      font-size: 0.7rem;
    }

    .badge i:hover {
      opacity: 0.7;
    }
  `]
})
export class ProductFilterComponent implements OnInit {
  @Input() categories: string[] = [];
  @Input() currentFilter: ProductFilter = {};
  @Input() totalProducts = 0;
  @Output() filterChange = new EventEmitter<ProductFilter>();
  @Output() clearFilter = new EventEmitter<void>();

  filterForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();
    this.setupFormSubscription();
  }

  createForm() {
    this.filterForm = this.fb.group({
      search: [this.currentFilter.search || ''],
      category: [this.currentFilter.category || ''],
      minPrice: [this.currentFilter.minPrice || null],
      maxPrice: [this.currentFilter.maxPrice || null],
      sortBy: [this.currentFilter.sortBy || ''],
      sortOrder: [this.currentFilter.sortOrder || 'asc']
    });
  }

  setupFormSubscription() {
    // Auto-apply filters on certain form changes
    this.filterForm.get('category')?.valueChanges.subscribe(() => {
      this.applyFilters();
    });

    this.filterForm.get('sortBy')?.valueChanges.subscribe(() => {
      this.applyFilters();
    });

    this.filterForm.get('sortOrder')?.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters() {
    const formValue = this.filterForm.value;
    const filter: ProductFilter = {
      search: formValue.search || undefined,
      category: formValue.category || undefined,
      minPrice: formValue.minPrice || undefined,
      maxPrice: formValue.maxPrice || undefined,
      sortBy: formValue.sortBy || undefined,
      sortOrder: formValue.sortOrder || 'asc'
    };

    // Remove undefined values
    Object.keys(filter).forEach(key => {
      if (filter[key as keyof ProductFilter] === undefined) {
        delete filter[key as keyof ProductFilter];
      }
    });

    this.filterChange.emit(filter);
  }

  clearSearch() {
    this.filterForm.patchValue({ search: '' });
    this.applyFilters();
  }

  clearAllFilters() {
    this.filterForm.reset({
      search: '',
      category: '',
      minPrice: null,
      maxPrice: null,
      sortBy: '',
      sortOrder: 'asc'
    });
    this.clearFilter.emit();
  }

  removeFilter(filterKey: string) {
    const updates: any = {};
    updates[filterKey] = filterKey === 'sortOrder' ? 'asc' : (filterKey.includes('Price') ? null : '');
    this.filterForm.patchValue(updates);
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    const formValue = this.filterForm.value;
    return !!(formValue.search || formValue.category || formValue.minPrice || 
             formValue.maxPrice || formValue.sortBy);
  }
}
