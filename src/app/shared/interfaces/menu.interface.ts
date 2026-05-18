export interface Menu {
  id: string;
  name: string;
  products: MenuProduct;
}

export interface MenuProduct {
  dishes: Dish[];
  drinks: Drink[];
}

export interface Dish {
  id: string;
  name: string;
  price: number;
  priceUnits: string;
  cookTime: number;
  images: string[];
  allergens: Allergen[];
}

export interface Drink {
  id: string;
  name: string;
  price: number;
  isAlcoholic: boolean;
  volume: number;
  units: string;
  allergens: Allergen[];
}

export interface Allergen {
  name: string;
  description?: string;
  icon: string;
}
