import React, { useState } from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import ReduxThunk from "redux-thunk";

import productsReducer from "./store/reducers/products";
import cartReducer from "./store/reducers/cart";
import ordersReducer from "./store/reducers/orders";
import authReducer from "./store/reducers/auth";
import NavigationContainer from "./navigation/NavigationContainer";

// combineReducers puts all the reducers into an object
// instead of using useState for each individual reducer initial state, it is easier to just use a combined reducer
const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer,
});

// Create a store - this is a variable that holds a store of the reducers
// it also has ReduxThunk middleware applied to it so we can do asynchronous calls with redux thunk
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

// fetch fonts and load them from the assets folder
const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

export default function App() {
  // used for loading fonts, load them once data is loaded
  const [fontLoaded, setFontLoaded] = useState(false);

  // Data not loaded, then fetch fonts, when finished load data
  // otherwise log an error to console
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  // because we are using react navigation we need to store a 'store' of reducers/actions for every page
  // to do this we use a <Provider></Provider> that wraps our main navigation container
  // we then call our store variable we made, which gets the reducers and uses redux thunk
  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
