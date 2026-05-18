import { Component, inject, OnInit, signal } from '@angular/core';
import { UrlProvider } from '../../enums/url-provider.enum';
import { HttpHandlerService } from '../../services/http-handler.service';
import { Menu } from '../../interfaces/menu.interface';
import { NgOptimizedImage } from '@angular/common';
import { map } from 'rxjs';

interface MenuAside {
  name: string;
  id: string;
}

@Component({
  selector: 'menu-display',
  templateUrl: './menu-display.component.html',
  styleUrl: './menu-display.component.scss',
  imports: [NgOptimizedImage],
})
export class MenuDisplayComponent implements OnInit {
  protected readonly httpHandlerService = inject(HttpHandlerService);

  protected menuAvailables = signal<MenuAside[]>([]);

  protected menus: Record<string, Menu> = {};

  protected selectedMenuId = signal<string | null>(null);

  ngOnInit(): void {
    this.httpHandlerService
      .getRequest<MenuAside[]>(UrlProvider.getAllMenus)
      .subscribe((menus: MenuAside[]) => {
        this.menuAvailables.set(menus);
      });
  }

  getMenuItems(menuId: string): void {
    this.selectedMenuId.set(menuId);

    if (this.menus[menuId]) {
      return;
    }

    this.httpHandlerService
      .getRequest<Menu>(UrlProvider.getMenu, {
        menuId,
      })
      .pipe(
        map((menu) => {
          return {
            ...menu,
            products: {
              dishes: menu.products.dishes.map((dish) => {
                return {
                  ...dish,
                  images: this.getImages(dish.images),
                };
              }),
              drinks: menu.products.drinks,
            },
          };
        }),
      )
      .subscribe((menu: Menu) => {
        this.menus[menuId] = menu;
      });
  }

  private getImages(images: string[]): string[] {
    if (images.length === 0) {
      return ['images/menus/default_dish.webp'];
    }
    return images;
  }
}
