import { inject, Injectable, signal, TemplateRef } from '@angular/core';
import { ModalConfig } from '../interfaces/modal-config.interface';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalConfiguration = signal<ModalConfig>({});
  private readonly router = inject(Router);

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.closeModal();
      }
    });
  }

  public getModalConfiguration() {
    return this.modalConfiguration.asReadonly();
  }

  public showModal(content: TemplateRef<unknown>) {
    if (!content) return;
    this.modalConfiguration.set({ template: content });
  }

  public closeModal() {
    this.modalConfiguration.set({});
  }
}
