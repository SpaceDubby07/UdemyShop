import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import CartItem from "../../components/shop/CartItem";
import Card from "../../components/UI/Card";
import * as cartActions from "../../store/actions/cart";
import * as ordersActions from "../../store/actions/orders";

// Cart screen!
const CartScreen = (props) => {
  //loading state
  const [isLoading, setIsLoading] = useState(false);

  // cartTotalAmount uses a selector to get the state
  // Specify the state, and we want the STATE of the CART, TOTALAMOUNT
  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);

  // cartItems selects the state, and we create an empty array called transformedCartItems
  // the purpose of this empty array is to push the cart items we selected into this array
  const cartItems = useSelector((state) => {
    const transformedCartItems = [];

    // Loops through the empty array by creating a key, the ITEMS keyword comes from the cart reducer
    // items is an empty object initially
    // push in the values we want
    //  productId is the key value
    //  to get the rest of the data we use the cart-item model (quantity, productPrice, productTitle, sum)
    //  we use the [key] to push the correct id to each data point
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
      });
    }
    // when we are done loooping through the array we need to sort it.
    // This is because if we do not sort it, as we start deleting items from the cart the items move around
    // is the product id of A greater than product id of b? if it is, sort higher, else sort lower.
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });

  // create a dispatch function useDispatch();
  const dispatch = useDispatch();

  // send order handler, it is an async function, for loading / not loading. we can also await actions
  // first we set loading state to true
  // once it is true we DISPATCH the ordersActions.addOrder, we need the cartItems and cartTotalAmount
  // cartItems and cartTotalAmount (which is equal to totalAmount) get passed to the orders.js actions
  // once that finishes we set loading state back to false.
  const sendOrderHandler = async () => {
    setIsLoading(true);
    await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
    setIsLoading(false);
  };

  // Show the cart items
  // {isLoading} is used to show an activity indicator, if loading is false - as our initial state, dont show anything
  // when we click the button we sendOrderHandler function, which changes the state to true, awaits a dispatch, then sets loading to false
  // while loading is set to true an activity indicator may show, unless the function gets handled very quickly.
  // we also disable the order now button if there are 0 items in the cart
  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{" "}
          <Text style={styles.amount}>
            ${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Button
            color={Colors.accent}
            title="Order Now"
            disabled={cartItems.length === 0}
            onPress={sendOrderHandler}
          />
        )}
      </Card>

      {/* 
        show a flatlist of the cart items, if there are any 
        the data is the cartItems, which are pushed into the transformedCartItems array
        we then need to render these cartItems somehow
        we have a component called CartItem that we use, this has props
        we get the quantity, productTitle, sum from the cart-item.js model (quantity, productPrice, productTitle, sum)
        we render the itemData.item key . model value 
        we also have a deletable prop which allows us to remove an item from the cart
        on remove, we dispatch the cart action, remove from cart(productId) - which is the name we use in actions, reducers. 
      */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId}
        renderItem={(itemData) => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            deletable
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemData.item.productId));
            }}
          />
        )}
      />
    </View>
  );
};

// navigation screen options, this just adds a title in the header.
CartScreen.navigationOptions = {
  headerTitle: "Your Cart",
};

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  amount: {
    color: Colors.primary,
  },
});

export default CartScreen;
