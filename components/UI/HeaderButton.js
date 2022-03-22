import React from "react";
import { Platform } from "react-native";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";

// this is our customHeaderButton component, UI file
// we return a HeaderButton from react-navigation-header-buttons
// inside this we call all props
// place an icon prop, which will be an ionicon
// set the icon size
// and set the color of the header button, if android - white, if ios - color is primary constant
const CustomHeaderButton = (props) => {
  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons}
      iconSize={23}
      color={Platform.OS === "android" ? "white" : Colors.primary}
    />
  );
};

export default CustomHeaderButton;
