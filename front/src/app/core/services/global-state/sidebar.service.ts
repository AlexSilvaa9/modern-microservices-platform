import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SidebarService {
    private _visible = signal<boolean>(false);

    visible = this._visible.asReadonly();

    open() { this._visible.set(true); }
    close() { this._visible.set(false); }
    toggle() { this._visible.update(v => !v); }
}