import { ADD_ORDER, SET_ORDERS } from '../actions/orders';
import Order from '../../models/order';

// initial state, orders is an empty array
const initialState = {
  orders: []
};

// export default - initial state = state, and an action
export default (state = initialState, action) => {

  //create a switch based on action.type defined in the actions files
  switch (action.type) {
    // type: SET_ORDERS
    case SET_ORDERS:
      // we just return action.orders which is the loadedOrders
      return {
        orders: action.orders
      };

    // type: ADD_ORDER
    case ADD_ORDER:
      // create a new order, get id, items, amount, date
      // action.orderData defined in action dispatch
      const newOrder = new Order(
        action.orderData.id,
        action.orderData.items,
        action.orderData.amount,
        action.orderData.date
      );
      // return a state snapshot, then concatenate a new order
      // to the orders array.
      return {
        ...state,
        orders: state.orders.concat(newOrder)
      };
  }

  return state;
};
