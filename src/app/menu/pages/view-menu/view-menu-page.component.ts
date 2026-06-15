import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MenuDisplayComponent } from '../../../shared/components/menu-display/menu-display.component';

@Component({
  imports: [MenuDisplayComponent],
  templateUrl: './view-menu-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './view-menu-page.component.scss',
})
export class ViewMenuPage {}
