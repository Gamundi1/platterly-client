import { NgTemplateOutlet } from '@angular/common';
import { Component, effect, inject, TemplateRef } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'overlay-container',
  templateUrl: './overlay-container.component.html',
  styleUrl: './overlay-container.component.scss',
  imports: [NgTemplateOutlet],
})
export class OverlayContainerComponent {
  private readonly modalService = inject(ModalService);
  protected modalContent: TemplateRef<unknown> | null | undefined = null;
  private readonly modalConfig = this.modalService.getModalConfiguration();

  constructor() {
    effect(() => {
      if (this.modalConfig().template) {
        this.modalContent = this.modalConfig().template;
      } else {
        this.modalContent = null;
      }
    });
  }
}
