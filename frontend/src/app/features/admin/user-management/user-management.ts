import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { UserService } from '../../../core/services/api/user.service';
import { UserDTO } from '../../../core/models/user.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SkeletonModule,
    TooltipModule,
    TranslatePipe
  ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
})
export class UserManagement implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  // Estado reactivo
  users = signal<UserDTO[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  rows = signal(10);
  currentPage = signal(0);

  ngOnInit() {
    this.loadUsers();
  }

  /**
   * Carga usuarios desde el backend con paginación
   */
  loadUsers(page: number = 0, pageSize: number = this.rows(), sort: string = 'id,desc') {
    this.loading.set(true);
    this.currentPage.set(page);

    this.userService.getAllUsers(page, pageSize, sort).subscribe({
      next: (response) => {
        this.users.set(response.data.content);
        this.totalRecords.set(response.data.totalElements);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading.set(false);
      }
    });
  }

  /**
   * Manejador de cambio de página en la tabla
   */
  onPageChange(event: any) {
    const page = Math.floor((event.first || 0) / (event.rows || this.rows()));
    const pageSize = event.rows || this.rows();
    const sortField = event.sortField || 'id';
    const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';

    this.loadUsers(page, pageSize, `${sortField},${sortOrder}`);
  }

  viewUserDetail(user: UserDTO): void {
    this.router.navigate(['/userdetail'], { state: { user } });
  }
}
