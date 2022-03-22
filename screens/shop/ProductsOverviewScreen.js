import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart";
import * as productsActions from "../../store/actions/products";
import Colors from "../../constants/Colors";

// this is the products overview screen!
const ProductsOverviewScreen = (props) => {
  // State of all things
  // loading set to false, refreshing set to false, error is an empty value
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  // get the state of availableProducts - initially an empty array ( we select from the reducer )
  const products = useSelector((state) => state.products.availableProducts);

  // dispatch function
  const dispatch = useDispatch();

  // load products function
  // set an error to null
  // we set is refreshing to true, because we can refresh it
  // while refreshing is true, we try to dispatch the productsAction fetchProducts function
  // if there is a problem, catch an error, and display an error message
  // refreshing is set back to false
  // we need to dispatch, setIsLoading, and setError as dependencies in the callback
  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  // use an Effect
  // i'm actually not entirely sure what this does
  // add a navigation listener which focuses on the loadedProduct function?
  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadProducts
    );

    // remove focus once refreshing becomes false in the loadProducts function
    // loadProducts is a dependancy.
    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  // use an effect on loading, this is for showing an activity indicator
  // load is true, we then run the load products function which fetches data from DB, then we set loading to false
  // dispatch and loadProducts are dependencies.
  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  // function - selectItemHandler, we need the id, and title of the product we are selecting
  // navigation to the PRODUCTDETAIL page, this value is stored in the shopNavigator file
  // productId and ProductTitle are the values we needso we know which product we are navigating to
  // i believe that we reference this as any key we want, the value is made in the product.js model
  const selectItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
    });
  };

  // if there is an error
  // show a message and a button to try and load the products again
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  // if the page is loading show an activity indicator
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // if the page is not loading and there are 0 products, tell the user they should maybe add a product
  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found. Maybe start adding some!</Text>
      </View>
    );
  }

  // return a flatlist of the data we want on the page
  // onRefresh and refreshing props allow us to swipe down refresh the page by calling the loadProducts function
  // and setting the state of isRefreshing to either true/false depending onRefresh
  // the data we want is the products, which we get from the products variable - available products
  // create a key for each item in the flatlist
  // render the items using itemData - we can name this whatever we want then call it on our props
  // we use the ProductItem component to show our data
  // itemData to render, item is the key, then we call the model data we want
  // on select - we handle the item id and item title - which we pass into the function and navigate to the detail screen
  // there are also buttons to go to the detail screen, or
  // we can dispatch the add to cart action on the item we want based on the key of the item.
  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Colors.primary}
            title="To Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
          />
        </ProductItem>
      )}
    />
  );
};

// nav options
// header title
// headerleft shows the drawer button
// headerRight shows the cart button, and has navigation on press to the CartScreen
ProductsOverviewScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "All Products",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => {
            navData.navigation.navigate("Cart");
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default ProductsOverviewScreen;
