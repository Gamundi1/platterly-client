import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  templateUrl: './complete-account-modal.component.html',
  styleUrl: './complete-account-modal.component.scss',
  imports: [RouterLink, MatIcon],
})
export class CompleteAccountModalComponent {}
