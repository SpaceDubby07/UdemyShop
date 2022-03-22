import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import { ADD_ORDER } from '../actions/orders';
import CartItem from '../../models/cart-item';
import { DELETE_PRODUCT } from '../actions/products';

// initial state, an object of items, and totalAmount = cart total sum
const initialState = {
  items: {},
  totalAmount: 0
};

// state is the initial state, and an action
export default (state = initialState, action) => {
  // switch on the action.type
  switch (action.type) {

    // type: ADD_TO_CART
    case ADD_TO_CART:
      //addedProduct is the action.product
      const addedProduct = action.product;
      // product price is the addedProduct price
      const prodPrice = addedProduct.price;
      // product title is the addedProduct title
      const prodTitle = addedProduct.title;

      // empty variable, updatedOrNewCartItem
      // we will be using this to update, or create a new cart item
      // using conditional statements (if/else)
      let updatedOrNewCartItem;

      // if the state of the items[key - addedProduct.id]
      // basically if this item exists in the cart, do something
      if (state.items[addedProduct.id]) {
        // already have the item in the cart
        // we add 1 to the quantity if we add another of the same addedProduct
        // and update the product price
        updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProduct.id].sum + prodPrice
        );
        // otherwise add a new cart item, with a quantity of 1, 
      } else {
        updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
      }

      // return the state snapshot
      // items are the current state of items
      // and the addedProduct id key
      // total amount is the grand total
      return {
        ...state,
        items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
        totalAmount: state.totalAmount + prodPrice
      };

    // type: REMOVE_FROM_CART
    case REMOVE_FROM_CART:
      // selectedCartItem is the items key[action.product id key]
      const selectedCartItem = state.items[action.pid];
      // currentQty is the selected item quantity
      const currentQty = selectedCartItem.quantity;
      let updatedCartItems;
      // if quantity is greater than 1, reduce it by 1 
      // and edit the price
      if (currentQty > 1) {
        // need to reduce it, not erase it
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice
        );
        // updated Cart items are the current state, and action on the id, updated cart items
        updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
      } else {
        // otherwise updatedcartitems is the state of items object
        // delete the pid from the cart items. 
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.pid];
      }
      // return the state snapshop, items as the updated cart items, and the total amount
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectedCartItem.productPrice
      };


    // type: ADD_ORDER
    case ADD_ORDER:
      // pretty simple, just return the initial state
      return initialState;

    // type: DELETE_PRODUCT  
    case DELETE_PRODUCT:
      // if falsy state.items[key is action.pid], basically if the product with the id doesn't exist, return the state
      if (!state.items[action.pid]) {
        // return the state
        return state;
      }

      // updatedItems is an object of items state snapshot
      const updatedItems = { ...state.items };
      // item total is the item key sum 
      const itemTotal = state.items[action.pid].sum;
      // delete the updatedItems at the product id key
      delete updatedItems[action.pid];

      // return state snapshot, updated items, reduced total amount
      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - itemTotal
      };
  }

  return state;
};
