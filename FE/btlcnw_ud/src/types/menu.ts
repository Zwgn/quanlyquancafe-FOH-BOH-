export interface MenuItemPayload {
  name: string;
  categoryId: string;
  price: number;
  imgUrl?: string | null;
}

export interface MenuOption {
  id: string;
  name: string;
  price: number;
  imgUrl?: string | null;
}

export interface MenuCategoryOption {
  id: string;
  name: string;
}

export interface MenuCardItem {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number;
  imgUrl: string;
}

export interface MenuFormState {
  name: string;
  categoryId: string;
  price: string;
  imgUrl: string;
}
