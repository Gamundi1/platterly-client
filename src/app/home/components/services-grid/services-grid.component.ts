import { BreakpointObserver } from '@angular/cdk/layout';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { map, tap } from 'rxjs';

@Component({
  selector: 'home-services-grid',
  templateUrl: './services-grid.component.html',
  styleUrl: './services-grid.component.scss',
  imports: [MatGridList, MatGridTile, NgOptimizedImage, AsyncPipe],
})
export class ServicesGridComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);

  mediumDevice$ = this.breakpointObserver
    .observe('(min-width: 768px)')
    .pipe(map((result) => result.matches));
}
