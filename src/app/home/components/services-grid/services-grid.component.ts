import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

@Component({
  selector: 'home-services-grid',
  templateUrl: './services-grid.component.html',
  styleUrl: './services-grid.component.scss',
  imports: [MatGridList, MatGridTile, NgOptimizedImage],
})
export class ServicesGridComponent {}
