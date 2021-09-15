import { StyleSheet, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import clientToServer from './ClientToServer';

export default async function App(pro,sendNet=true) {
    try{
      await AsyncStorage.setItem(
        'decks',
        JSON.stringify({
          decks: pro.decks,
          wishlists: pro.wishlists,
          idClient: pro.idClient,
          topDecks:pro.topDecks,
          topCards:pro.topCards,
          voted:pro.voted,
          loved:pro.loved,
          collections:pro.collections,
          collectionsCards:pro.collectionsCards,
          nameClient:pro.nameClient,
          symbols:pro.symbols,
          lang:pro.lang,
        }),
      );
      if(sendNet == true){clientToServer(pro);} 
    } catch (e) {
      console.log('saving error', e);
    }

}



const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 9 / 16);
const imageWidth = dimensions.width;
  
  
 const styles = StyleSheet.create({
  backgroundStyle:{
    backgroundColor:"black"
  },
  
  image: {
    flex: 1,
    alignSelf: 'stretch',
    width: imageWidth,
    height: imageHeight,
},
imageSymbol: {
  width: 15,
  height: 15,
  margin:5,
},

  screen: {
    flex: 1,
    alignItems: 'center',
  },
  screenRight: {
    flex:1,
    justifyContent:"flex-end",
    alignItems:"flex-end",
  },
  title: {
    fontSize: 35,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#47477b',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
  },
});
  