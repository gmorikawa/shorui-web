import { inject, Service, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { APIService } from "@services";

@Service()
export class CacheService extends APIService {
  private isBrowser: boolean;

  constructor() {
    super();
    // Safely determine if the code is executing in the browser
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  }

  setItem<T>(key: string, value: T): void {
    if (this.isBrowser) {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.isBrowser) return null;

    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  removeItem(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }
}
