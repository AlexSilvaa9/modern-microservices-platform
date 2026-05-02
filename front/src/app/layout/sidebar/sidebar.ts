import { Component, inject, Input, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SIDEBAR_MENU } from '../../core/models/sidearMenu.const';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { IsAdminDirective } from '../../shared/directives/isAdminDirective';
import { Role } from '../../core/models/user.model';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, NgFor, NgForOf, NgIf, IsAdminDirective, TranslatePipe],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  Role = Role;
  menu = SIDEBAR_MENU
  activeRoute = signal<string>('');

  openGroup = signal<string | null>(null);

  constructor(private router: Router) {
    this.activeRoute.set(this.router.url);
  }

  toggleGroup(label: string) {
    this.openGroup.update(current =>
      current === label ? null : label
    );
  }

  navigate(route: string) {
    this.router.navigateByUrl(route);
    this.activeRoute.set(route);
  }

  isActive(route?: string): boolean {
    return route ? this.activeRoute() === route : false;
  }
}