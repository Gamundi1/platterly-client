import { Injectable, signal, TemplateRef } from '@angular/core';
import { ModalConfig } from '../interfaces/modal-config.interface';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalConfiguration = signal<ModalConfig>({});

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
