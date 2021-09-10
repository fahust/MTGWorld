/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  StyleSheet
} from 'react-native';

import { extendTheme, NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import cardReducer from './redux/ProReducer';
import AppView from './views/App';

const theme = extendTheme({ 
  components: {
      Select: {
          baseStyle: {fontSize:2,color:"black"},
          defaultProps: {},
          variants: {},
          sizes: {},
      }
  } 
});

const App: () => Node = () => {
   
  const store = createStore(cardReducer);

 
   return (
    <Provider store={store}>
      <NativeBaseProvider>
          <AppView/>
      </NativeBaseProvider>
    </Provider>
   );
 };
 
 const styles = StyleSheet.create({
   sectionContainer: {
     marginTop: 32,
     paddingHorizontal: 24,
   },
   sectionTitle: {
     fontSize: 24,
     fontWeight: '600',
   },
   sectionDescription: {
     marginTop: 8,
     fontSize: 18,
     fontWeight: '400',
   },
   highlight: {
     fontWeight: '700',
   },
 });
 
 export default App;
 