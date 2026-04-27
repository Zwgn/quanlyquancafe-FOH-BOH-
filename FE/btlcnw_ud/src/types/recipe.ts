export interface MenuItemOption {
  id: string;
  name: string;
  imgUrl: string;
  price: number;
}

export interface IngredientOption {
  id: string;
  name: string;
  unit: string;
}

export interface RecipeRow {
  id: string;
  ingredientName: string;
  unit: string;
  quantity: number;
}

export interface RecipeFormState {
  ingredientId: string;
  quantity: number;
}
