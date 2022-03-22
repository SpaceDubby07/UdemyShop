import React from 'react';
import { View, StyleSheet } from 'react-native';


// Card component is a view that uses props.children and has styles
// this is styled as our card, it shows our products, order details, etc...
const Card = props => {
  return <View style={{...styles.card, ...props.style}}>{props.children}</View>;
};

const styles = StyleSheet.create({
  card: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white'
  }
});

export default Card;
