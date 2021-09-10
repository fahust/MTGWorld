import { StyleSheet,Image, View, Dimensions,Text} from 'react-native';
import React from 'react';
import {
  Menu,
  Pressable
} from "native-base"
import actionsFr from '../abilities/action.json';
import actionsEn from '../abilities/actionEn.json';

import { SvgUri } from 'react-native-svg';

function flatMap(array, fn,deletelast) {
  var result = [];
  for (var i = 0; i < array.length; i++) {
    var mapping = fn(array[i]);
    result = result.concat(mapping);
  }
  if(deletelast == true){
    result.splice(-1,1)
  }
  return result;
}

export default function App(content,lang="en") {
  //return content;

    const arrayImage = {
      "{1}":require('../img/1.png'),
      "{2}":require('../img/2.png'),
      '{3}':require('../img/3.png'),
      "{4}":require('../img/4.png'),
      "{5}":require('../img/4.png'),
      "{B}":require('../img/B.png'),
      "{BG}":require('../img/BG.png'),
      "{BR}":require('../img/BR.png'),
      "{C}":require('../img/C.png'),
      "{G}":require('../img/G.png'),
      "{GU}":require('../img/GU.png'),
      "{GW}":require('../img/GW.png'),
      "{R}":require('../img/R.png'),
      "{RG}":require('../img/RG.png'),
      "{RW}":require('../img/RW.png'),
      "{U}":require('../img/U.png'),
      "{UB}":require('../img/UB.png'),
      "{UR}":require('../img/UR.png'),
      "{W}":require('../img/W.png'),
      "{WB}":require('../img/WB.png'),
      "{WU}":require('../img/WU.png'),
      "{X}":require('../img/X.png'),
      "{Z}":require('../img/Z.png'),
      
      "{5}":require('../img/5.png'),
      "{6}":require('../img/6.png'),
      "{7}":require('../img/7.png'),
      "{8}":require('../img/8.png'),
      "{9}":require('../img/9.png'),
      "{10}":require('../img/10.png'),
      "{11}":require('../img/11.png'),
      "{12}":require('../img/12.png'),
      "{13}":require('../img/13.png'),
      "{14}":require('../img/14.png'),
      "{15}":require('../img/15.png'),
      "{16}":require('../img/16.png'),
      "{17}":require('../img/17.png'),
      "{18}":require('../img/18.png'),
      "{19}":require('../img/19.png'),
      "{20}":require('../img/20.png'),
      "{CHAOS}":require('../img/CHAOS.png'),
      "{E}":require('../img/E.png'),
      "{PW}":require('../img/PW.png'),
      "{Q}":require('../img/Q.png'),
      "{100}":require('../img/100.png'),
      "{1000000}":require('../img/1000000.png'),
      "{W/U}":require('../img/WU.png'),
      "{W/B}":require('../img/WB.png'),
      "{B/R}":require('../img/BR.png'),
      "{B/G}":require('../img/BG.png'),
      "{U/B}":require('../img/UB.png'),
      "{U/R}":require('../img/UR.png'),
      "{R/G}":require('../img/RG.png'),
      "{R/W}":require('../img/RW.png'),
      "{G/W}":require('../img/GW.png'),
      "{G/U}":require('../img/GU.png'),
      "{2/W}":require('../img/2W.png'),
      "{2/U}":require('../img/2U.png'),
      "{2/B}":require('../img/2B.png'),
      "{2/R}":require('../img/2R.png'),
      "{2/G}":require('../img/2G.png'),
      "{P}":require('../img/P.png'),
      "{S}":require('../img/S.png'),


    };

    

    
      if(content && content != ""){
        //keyUpper = Math.random()
        content = flatMap(content.split('{T}'), function (part) {return [part, <Image style={styles.imageSymbol} source={require('../img/T.png')} />];},true);
        
        Object.keys(arrayImage).forEach(imageName => {
        var newArray = [];
        content.forEach(element => {
          if(typeof element == "string"){
            element = flatMap(element.split(imageName), function (part) {return [part, <Image style={styles.imageSymbol} source={arrayImage[imageName]} />];},true);
          } 
          newArray = newArray.concat(element);
        });
        content = newArray;
        });
        var actions = actionsEn
        if(lang == "fr") actions = actionsFr
        
        Object.keys(actions).forEach(action => {
          var newArray = [];
          content.forEach(element => {
            if(typeof element == "string"){
              if(element.includes(action.toLowerCase())){
                element = flatMap(element.split(action.toLowerCase()), function (part) {return [part, <View><Menu style={{backgroundColor:"black"}}
                  trigger={(triggerProps) => {
                    return (
                      <Pressable {...triggerProps}>
                        <Text style={{textShadowColor: 'rgba(255, 255, 255, 0.8)',textShadowOffset: {width: 0.1,height:0.1},textShadowRadius: 1,color:"#fff",/*color:"#52595D",*/marginBottom:-5,fontWeight:"bold",fontSize:17}} >{action}</Text>
                      </Pressable>
                    )
                  }}
                >
                  <Menu.Item><Text style={{color:"white",fontSize:18}}>{actions[action]}</Text></Menu.Item>
                </Menu>
                </View>
                /*<Tooltip label={actions[action]} openDelay={100}>{action}</Tooltip>*/];},true);
              }
              if(element.includes(action)){
                element = flatMap(element.split(action), function (part) {return [part, <View><Menu style={{backgroundColor:"black"}}
                  trigger={(triggerProps) => {
                    return (
                      <Pressable {...triggerProps}>
                        <Text style={{textShadowColor: 'rgba(255, 255, 255, 0.8)',textShadowOffset: {width: 0.1,height:0.1},textShadowRadius: 1,color:"#fff",/*color:"#52595D",*/marginBottom:-5,fontWeight:"bold",fontSize:17}} >{action}</Text>
                      </Pressable>
                    )
                  }}
                >
                  <Menu.Item><Text style={{color:"white",fontSize:18}}>{actions[action]}</Text></Menu.Item>
                </Menu>
                </View>
                /*<Tooltip label={actions[action]} openDelay={100}>{action}</Tooltip>*/];},true);
              }
            } 
            newArray = newArray.concat(element);
          });
          content = newArray;
        });

      }

      return content;
  

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
  