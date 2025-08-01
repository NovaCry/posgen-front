export interface CartItemStateRaw {
  quantity: number;
  selected: boolean;
}

export interface ProductRaw {
  title: string;
  price: number;
  image: string;
  maxQuantity: number;
  productId: string;
}

export interface CartItem extends ProductRaw {
  state: CartItemStateRaw
}

export interface CartCategory {
  id: string;
  title: string;
  items: CartItem[]
}
