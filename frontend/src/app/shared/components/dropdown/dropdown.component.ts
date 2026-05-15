import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DropdownOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {

  // Accept either DropdownOption[] or primitive array (string|number[])
  @Input() options: DropdownOption[] | any[] = [];
  @Input() selected: any;
  @Input() placeholder: string = 'Select...';
  @Input() disabled: boolean = false;

  @Output() selectedChange = new EventEmitter<any>();

  open = false;

  // internal normalized options
  get normalizedOptions(): DropdownOption[] {
    if (!this.options) return [];
    // if option has label/value shape, keep it
    if ((this.options as any[]).every(o => o && typeof o === 'object' && ('label' in o || 'value' in o))) {
      return (this.options as DropdownOption[]).map(o => ({ label: (o as any).label ?? String((o as any).value), value: (o as any).value ?? (o as any).label }));
    }
    // otherwise treat as primitives
    return (this.options as any[]).map(o => ({ label: String(o), value: o }));
  }

  constructor(private host: ElementRef) {}

  toggle(evt?: Event) {
    if (this.disabled) return;
    if (evt) evt.stopPropagation();
    this.open = !this.open;
  }

  select(option: DropdownOption) {
    this.selected = option.value;
    this.selectedChange.emit(option.value);
    this.open = false;
  }

  get selectedLabel(): string {
    const found = this.normalizedOptions.find(o => o.value === this.selected);
    return found?.label ?? this.placeholder;
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    if (!this.open) return;
    const target = event.target as HTMLElement;
    if (!this.host.nativeElement.contains(target)) {
      this.open = false;
    }
  }
}