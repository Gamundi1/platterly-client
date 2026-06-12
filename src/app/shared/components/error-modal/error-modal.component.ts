import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { ErrorModalConfig } from '../../interfaces/error-modal-config.interface';
import { RouterLink } from '@angular/router';

@Component({
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.scss',
  imports: [FaIconComponent, RouterLink, MatDialogTitle, MatDialogContent],
})
export class ErrorModalComponent {
  protected readonly faTriangleExclamation = faTriangleExclamation;

  constructor(@Inject(MAT_DIALOG_DATA) public message: ErrorModalConfig) {}
}
