import PRODUCTS from "../../data/dummy-data";
import {
  DELETE_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  SET_PRODUCTS,
} from "../actions/products";
import Product from "../../models/product";

//this is our products reducer

// create initial state, avaialableProducts and userProducts are empty arrays
const initialState = {
  availableProducts: [],
  userProducts: [],
};

// export default state which is = to the initial state, and an action
// create a switch on our action.type - this is set in our actions products.js file - we dispatch it in actions
export default (state = initialState, action) => {
  switch (action.type) {
    // type: SET_PRODUCTS - which is our fetchProducts action
    // we return the avaialable products on action.products - loadedProducts in actions
    // return the userProducts on action.userProducts - loadedProducts filtered by user Id in actions
    case SET_PRODUCTS:
      return {
        availableProducts: action.products,
        userProducts: action.userProducts,
      };

    // type: CREATE_PRODUCT
    case CREATE_PRODUCT:
      // we want to create a new product based off our product model
      // id, ownerId, imageUrl, title, description, price
      // the action is an action, productData is defined in our action dispatch, and we dispatch the model values
      const newProduct = new Product(
        action.productData.id,
        action.productData.ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        action.productData.price
      );

      // return a state snapshot
      // then concatenate the new product to available products, and userProducts
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
      };

    // type: UPDATE_PRODUCT
    case UPDATE_PRODUCT:
      // create a constant productIndex which we will find the index of the userProduct
      // the pid is defined in the action dispatch, so we set the prod.id to the action.pid
      const productIndex = state.userProducts.findIndex(
        (prod) => prod.id === action.pid
      );

      // create a constant for our updatedProduct
      // it is equal to a new product (we cannot edit the ownerId or the price)
      // so we get the state of the price and owner id
      // we can edit the title, image and description, so we pass an action on these values
      // action, dispatch productData, and the values we put on the action
      const updatedProduct = new Product(
        action.pid,
        state.userProducts[productIndex].ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        state.userProducts[productIndex].price
      );
      // updatedUserProducts is the state of userProducts, an array of all available user products
      const updatedUserProducts = [...state.userProducts];
      // we then use the productIndex of the updated user product and set it to the updated product
      updatedUserProducts[productIndex] = updatedProduct;

      // we aalso need to find the index of avaialble products
      const availableProductIndex = state.availableProducts.findIndex(
        (prod) => prod.id === action.pid
      );

      // updatedAvailableProducts is the current state of avaialable products
      const updatedAvailableProducts = [...state.availableProducts];

      // then we update the avaiable product index of the updated product we just changed
      updatedAvailableProducts[availableProductIndex] = updatedProduct;

      // return a state snapshop
      // the updatedAvaiableProducts
      // the updated user products
      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts,
      };

    // type: DELETE_PRODUCT
    case DELETE_PRODUCT:
      // for this we use a delete method
      // return a state snapshot
      // filter userProducts/available products we we remove !== the product.id = dispatched action.pid
      return {
        ...state,
        userProducts: state.userProducts.filter(
          (product) => product.id !== action.pid
        ),
        availableProducts: state.availableProducts.filter(
          (product) => product.id !== action.pid
        ),
      };
  }
  return state;
};
