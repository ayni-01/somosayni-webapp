import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly storageKey = 'auth_token';

  get(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  set(token: string): void {
    localStorage.setItem(this.storageKey, token);
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }
}
