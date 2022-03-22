import Product from "../../models/product";

// constants for the dispatch type:
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

// Firebase database rules
// Read: true
// Write: 'auth != null' -- if auth is not null then writing is allowed

// action: fetch our products
// we return an async function so we can await a promise
export const fetchProducts = () => {
  // we dispatch and getstate as function parameters
  return async (dispatch, getState) => {
    // getState() = Returns the current state tree of your application.
    // It is equal to the last value returned by the store's reducer

    // userId auth (as defined in our rules) of the userId we are fetching
    // this will allow us to write data
    const userId = getState().auth.userId;

    // try a response from firebase
    // fetch the DB products section
    try {
      const response = await fetch(
        "https://udemyshop-ee368-default-rtdb.firebaseio.com/products.json"
      );

      // if no response, throw an error
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      // resData awaits a response.json() function and parses data to json text
      const resData = await response.json();

      // loadedProducts is an empty array
      const loadedProducts = [];

      // loop through our resData if there is any - on the key
      // push the products into the loadedProduct array (product model)
      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }

      // dispatch the actoin type, action.products,
      // action.userProducts where userId = product ownerId
      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter((prod) => prod.ownerId === userId),
      });
      // catch any errors, and throw an error if there is any
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

// delete product action
export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    // get an authorization token to write data to the db
    const token = getState().auth.token;
    // fetch a reponse on the selected {productId}, and pass the auth token into firebase api
    const response = await fetch(
      `https://udemyshop-ee368-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        // use the delete method defined in the firebase api
        method: "DELETE",
      }
    );

    // throw an error if no response
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    // dispatch type, and action.pid on productId
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

// action: type: createProduct - we get the title, desc, imgurl and price
export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    // any async code you want!
    // we want to write data, so we need auth, userId becomes the ownerId
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://udemyshop-ee368-default-rtdb.firebaseio.com/products.json?auth=${token}`,
      {
        // post data, content is json
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // the body is the data posted, so we need to turn it all to json strings
        // ownerId = userId
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId: userId,
        }),
      }
    );

    // resData awaits a response.json() function
    const resData = await response.json();

    // dispatch the type
    // and productData
    // idk wtf resData.name looks like its randomly generated somehow
    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title,
        description,
        imageUrl,
        price,
        ownerId: userId,
      },
    });
  };
};


// action: updateProduct - id, title, description, img
export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    // need an auth token for write capabilities
    const token = getState().auth.token;
    const response = await fetch(
      `https://udemyshop-ee368-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        // method is patch, content is json
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        // stringify the title, description, imageurl
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      }
    );

    // spit an error if no server response
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    // dispatch action
    // type, pid on the id, and product data
    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl,
      },
    });
  };
};
