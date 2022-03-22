export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';

// action type: add to cart, product: product
export const addToCart = product => {
  return { type: ADD_TO_CART, product: product };
};


// action type: remove from, cart pid: productId
export const removeFromCart = productId => {
  return { type: REMOVE_FROM_CART, pid: productId };
};
