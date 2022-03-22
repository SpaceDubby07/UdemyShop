import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { NavigationActions } from "react-navigation";

import ShopNavigator from "./ShopNavigator";


// this is our navigation container, it is used to reference our Auth route
const NavigationContainer = (props) => {
  // useRef function is our navRef
  const navRef = useRef();

  // isAuth selector, state is truthy token
  const isAuth = useSelector((state) => !!state.auth.token);


  // if not isAuth, navigate to the authentication page
  useEffect(() => {
    if (!isAuth) {
      navRef.current.dispatch(
        NavigationActions.navigate({ routeName: "Auth" })
      );
    }
  }, [isAuth]);

  // otherwise we return to our shopNavigator and we reference our navRef
  return <ShopNavigator ref={navRef} />;
};

export default NavigationContainer;
