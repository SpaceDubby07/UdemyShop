import AsyncStorage from "@react-native-async-storage/async-storage";
// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

// empty variable for the login timer
let timer;


// authenticate the user, we need the userId, our token, and an expiration time
export const authenticate = (userId, token, expiryTime) => {
  return (dispatch) => {
    // dispatch a logoutTimer
    dispatch(setLogoutTimer(expiryTime));

    // and dispatch the authenticate type and its values
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

// signup action, we pass an email and a password into this
export const signup = (email, password) => {
  return async (dispatch) => {
    // fetch a response from the database using our authentication key - from firebase
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA08r-2huiNtt16Lo6gKc2EgZ8vFplP3RM",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // we get the email, password, and our secure token
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    // throw errors - email in use, etc...
    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = "Something went wrong!";
      if (errorId === "EMAIL_EXISTS") {
        message = "This email exists already!";
      }
      throw new Error(message);
    }

    // get a json reponse as our resData
    const resData = await response.json();
    console.log(resData); // log it to the console
    // dispatch our authenticate function, using the localId, idToken, and parse an integer for our token expiration
    // we can see this data in our console.log of resData
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );

    // expiration date = new Data(new Data) - get time, parse an int for expires in
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );

    // function which stores data in our device storage
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

// login action, we need the email and password
export const login = (email, password) => {
  return async (dispatch) => {
    // fetch a database response
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA08r-2huiNtt16Lo6gKc2EgZ8vFplP3RM",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // get the email, password, return the secure token
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    // throw errors if info is invalid
    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = "Something went wrong!";
      if (errorId === "EMAIL_NOT_FOUND") {
        message = "This email could not be found!";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "This password is not valid!";
      }
      throw new Error(message);
    }

    const resData = await response.json();
    console.log(resData);
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

// logout, remove the storage, in this instance its userData that we remove. using action type logout
export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

// clear the logout timer if there is a timer
const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

// set a logout timer, pretty self explanitory. set a timeout, dispatch the logout function which will clear the timer
const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

// store data as json string using AsyncStorage so we can access it on our personal device without having
// to re-enter data each time we open the app, persistant data.
const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};
