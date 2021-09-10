import { StyleSheet, View, Dimensions, Text} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient'

export default function App(content,padding=50) {
  //return content;
  return <View style={{textAlign:"center",alignItems:"center",padding:padding}}>
    <View style={{flexDirection:"row"}}>
      <LinearGradient
        colors={['#55395E', 'rgba(0,0,0,0)']}
        style={{height:3,width:Dimensions.get('window').width/4,margin:20}}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
      />
      <Text style={{color:"white",fontSize:26,fontWeight:"bold"}}>{content}</Text>
      <LinearGradient
        colors={['#55395E', 'rgba(0,0,0,0)']}
        style={{height:3,width:Dimensions.get('window').width/4,margin:20}}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
    </View>
  </View>
  

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
  