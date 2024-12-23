import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export abstract class StorageService {
  abstract getItem(key: string): string | null;
  abstract setItem(key: string, value: string): void;
  abstract removeItem(key: string): void;
}

@Injectable({
  providedIn: 'root',
})
export class BrowserStorageService implements StorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  setItem(key: string, tokenObj: any): void {
    if (isPlatformBrowser(this.platformId)) {
      const tokenString = JSON.stringify(tokenObj);
      localStorage.setItem(key, tokenString);
    }
  }

  removeItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }
}
