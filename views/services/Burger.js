import React from 'react';
import {StyleSheet, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Burger(props) {
  // const navigation = useNavigation();
  const disconnect = () => {
    if (props['nav']) {
      props['nav'].toggleDrawer()
    }
  };

  return (
    <Icon
      style={styles.fixBurger}
      color="#ffffff"
      name="outdent"
      onPress={() => disconnect()}
      // navigation={navigation}
      // onPress={() => navigation.navigate('Deconnection')}
    />
  );
}

const styles = StyleSheet.create({
  fixBurger: {
    fontSize: 21,
    color: Platform.OS == 'ios' ? '#000000' : '#ffffff',
    paddingHorizontal: 20,
  },
});
