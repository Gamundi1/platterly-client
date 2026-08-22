import { BreakpointObserver } from '@angular/cdk/layout';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { map, Observable } from 'rxjs';
import { UrlProvider } from '../../enums/url-provider.enum';
import { Dish, Menu } from '../../interfaces/menu.interface';
import { HttpHandlerService } from '../../services/http-handler.service';
import { AllergenIconComponent } from '../allergen-icon/allergen-icon.component';

interface MenuAside {
  name: string;
  id: string;
}

@Component({
  selector: 'menu-display',
  templateUrl: './menu-display.component.html',
  styleUrl: './menu-display.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NgOptimizedImage, CurrencyPipe, AllergenIconComponent, TranslocoPipe],
})
export class MenuDisplayComponent implements OnInit {
  protected readonly httpHandlerService = inject(HttpHandlerService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  public showAddButton = input<boolean>(false);
  public selectedDish = output<Dish>();

  protected menuAvailables = signal<MenuAside[]>([]);
  protected menus: Record<string, Menu> = {};
  protected selectedMenuId = signal<string | null>(null);
  protected isMobile$: Observable<boolean>;

  constructor() {
    this.isMobile$ = this.breakpointObserver
      .observe('(max-width: 768px)')
      .pipe(map((result) => result.matches));
  }

  ngOnInit(): void {
    this.httpHandlerService
      .getRequest<MenuAside[]>(UrlProvider.getAllAvailableMenus)
      .subscribe((menus: MenuAside[]) => {
        this.menuAvailables.set(menus);

        if (menus.length > 0) {
          this.getMenuItems(menus[0].id);
        }
      });
  }

  getMenuItems(menuId: string): void {
    if (this.menus[menuId]) {
      this.selectedMenuId.set(menuId);
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
        this.selectedMenuId.set(menuId);
      });
  }

  private getImages(images: string[]): string[] {
    if (images.length === 0) {
      return ['images/menus/default_dish.webp'];
    }
    return images;
  }
}
