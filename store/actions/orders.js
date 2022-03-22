import Order from "../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

// fetch orders
export const fetchOrders = () => {
  return async (dispatch, getState) => {
    // get the userId as auth state
    const userId = getState().auth.userId;

    // try to fetch a response on userId from firebase orders
    try {
      const response = await fetch(
        `https://udemyshop-ee368-default-rtdb.firebaseio.com/orders/${userId}.json`
      );

      // if no reponse, throw error
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      // resData = response from server parsed as json
      const resData = await response.json();

      // create an empty array called loadedOrders
      const loadedOrders = [];

      // loop through our resData and push all orders into the loadedOrders array
      for (const key in resData) {
        loadedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].totalAmount,
            new Date(resData[key].date)
          )
        );
      }
      // dispatch type, orders: loadedOrders
      dispatch({ type: SET_ORDERS, orders: loadedOrders });
    } catch (err) {
      throw err;
    }
  };
};


// action: addOrder
export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
    // we need write auth for this, so get a token, and the userId so we know whos orders to write to
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    // date is a new date, we pass a date into our json data when adding an order
    const date = new Date();

    // fetch the firebase response
    const response = await fetch(
      `https://udemyshop-ee368-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        // post json to the db
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // this is the json data we want to post, cartItems, totalAmount, and the date
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString(),
        }),
      }
    );

    // throw error if no response 
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    // resData = response.json function
    const resData = await response.json();

    // dispatch the action, and orderData object. 
    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resData.name,
        items: cartItems,
        amount: totalAmount,
        date: date,
      },
    });
  };
};
