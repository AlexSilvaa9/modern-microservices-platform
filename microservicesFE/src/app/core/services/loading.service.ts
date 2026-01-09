import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading$ = new BehaviorSubject<boolean>(false);
  private loadingCount = 0;

  isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  setLoading(loading: boolean): void {
    if (loading) {
      this.loadingCount++;
    } else {
      this.loadingCount--;
      if (this.loadingCount < 0) {
        this.loadingCount = 0;
      }
    }
    
    this.loading$.next(this.loadingCount > 0);
  }

  reset(): void {
    this.loadingCount = 0;
    this.loading$.next(false);
  }
}
