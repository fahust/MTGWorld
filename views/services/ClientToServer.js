import { StyleSheet, Dimensions} from 'react-native';

export default async function App(pro) {
    if(pro.noSendModif==true){
      pro.noSendModif=false
    }else{
    try{
      fetch('http://'+pro.url+'/datasTopDecks', {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'same-origin',
        body: JSON.stringify({'decks':pro.lastDeckUpdate!=undefined?{[pro.lastDeckUpdate]:pro.decks[pro.lastDeckUpdate]}:pro.decks,'idClient':pro.idClient,'name':pro.nameClient,'nbrCards':Object.keys(pro.collections.cards).length}),
        headers: {
          'Accept':       'application/json',
          'Content-Type': 'application/json'
        }
      }).then((response) => {return response.json();}) 
      .then((data) => {
        pro.topDecks = data.topDecks;
        if(pro.lastDeckUpdate!=undefined){
          pro.lastDeckUpdate=undefined;
        }else{
          fetch('http://'+pro.url+'/datasTopCards', {
          method: 'POST',
          credentials: 'same-origin',
          mode: 'same-origin',
          body: JSON.stringify({}),
          headers: {
            'Accept':       'application/json',
            'Content-Type': 'application/json'
          }
          }).then((response) => {return response.json();}) 
          .then((data) => {
            pro.topCards = data.topCards;
            fetch('http://'+pro.url+'/datasPlayers', {
            method: 'POST',
            credentials: 'same-origin',
            mode: 'same-origin',
            body: JSON.stringify({}),
            headers: {
              'Accept':       'application/json',
              'Content-Type': 'application/json'
            }
            }).then((response) => {return response.json();}) 
            .then((data) => {
              pro.players = data.players
              return pro;
            })
            .catch((error) => {
              console.error('net error',error);
            });
          })
          .catch((error) => {
            console.error('net error',error);
          });
        }
      })
      .catch((error) => {
        console.error('net error',error);
      });
    } catch (e) {
      console.error('net error',error);
    }
      
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
  