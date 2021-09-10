import { StyleSheet, ScrollView, View,  Dimensions, ImageBackground} from 'react-native';
import React, { Component } from 'react';
import {
  Input,
  Text,
} from "native-base"
import {connect} from 'react-redux';
import {setPro} from '../../redux/ProActions';
import {bindActionCreators} from 'redux';
import LinearGradient from 'react-native-linear-gradient';
import rulings from './rulings.json';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 100;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

 class RulingsList extends Component {
  constructor(properties) {
    super(properties);
    this.state = {
      inputValue: '',
      list: [],
      search:'',
      index:20,
    };
  }

  componentDidMount(){
    this.props.navigation.setOptions({title:'Rulings'});
  }

  listFuncton = () => {
    var key = 0;
    var BreakException = {};
    var rulingsLists = <View></View>
    try {
      var rulingsLists = Object.keys(rulings).map((ruling)=>{
        if(key<this.state.index){
          if((this.state.search == ""||similarity(this.state.search,rulings[ruling].comment) > 0.1)){
            key++
            return <View style={{flexDirection:"row",padding:10}} key={rulings[ruling].oracle_id+"--"+ruling}>
              <Text style={{color:"white",fontWeight:"bold",fontSize:20}}>{rulings[ruling].published_at}
              <Text style={{color:"white",fontSize:16}}>  :  {rulings[ruling].comment}</Text>
              </Text>
            </View>
          }
        }
      })
    } catch (e) {
      if (e !== BreakException) throw e;
    }
    return rulingsLists;
  }

  addIndexToScroll = () => {
    this.setState({index:this.state.index+10})
  }

  /*listFuncton = () => {
    var BreakException = {};
    var rulingsLists = <View></View>
    try {
      var rulingsLists = Object.keys(rulings).map((ruling,key)=>{
        //if(key>10) throw BreakException;
        //console.log(similarity(this.state.search,rulings[ruling].comment))
        if((this.state.search == ""||similarity(this.state.search,rulings[ruling].comment) > 0.2)&&key<10)
        return <View style={{flexDirection:"row",padding:10}} key={rulings[ruling].oracle_id+"--"+ruling}>
            <Text style={{color:"white",fontWeight:"bold",fontSize:20}}>{rulings[ruling].published_at}
            <Text style={{color:"white",fontSize:16}}>  :  {rulings[ruling].comment}</Text>
            </Text>
          </View>
      })
    } catch (e) {
      if (e !== BreakException) throw e;
    }
    return rulingsLists;
  }*/

render() {
  return (
    <LinearGradient
    colors={['#191919', '#191919']}
    style={{
      height:Dimensions.get('window').height,
      width:Dimensions.get('window').width,
    }}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
  >
    <ImageBackground  blurRadius={1} style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height/2,marginTop:Dimensions.get('window').height/3,resizeMode: 'cover',position:"absolute"}} source={backgroundImg} alt="image base" resizeMode="cover" roundedTop="md" imageStyle= {{opacity:0.1}} />
    <ScrollView style={{marginBottom:80}}
    onScroll={({nativeEvent}) => {
      if (isCloseToBottom(nativeEvent)) {
        this.addIndexToScroll();
      }
    }}
    scrollEventThrottle={400}
    >
      <View style={{flexDirection:"row"}}>
        <Input
        style={{height:50,margin:10,width:150,color:"white"}}
        width={150}
        color="white"
          autoCapitalize="none"
          placeholder="Search"
          underlineColorAndroid='rgba(0, 0, 0, 0)'
          value = {this.state.search}
          onChangeText={search => this.setState({search: search,index:20})}
        />
      </View>

      {this.listFuncton()}
    </ScrollView>
    </LinearGradient>
  );
}

}

const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 9 / 16);
const imageWidth = dimensions.width;
  
  
 const styles = StyleSheet.create({
  innerCircle: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: 5,
    width: 100,
    height: 100,
  },
  backgroundStyle:{
    backgroundColor:"black"
  },
  
  image: {
    width: imageWidth,
    height: imageHeight,
    
},
imageSymbol: {
  flex: 1,
  width: 15,
  height: 15,
},

  screen: {
    flex: 1,
    alignItems: 'center',
  },
  screenRight: {
    fontSize:20,
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
  /*lineStyle:{
    width:"100%",
    borderWidth: 0.5,
    borderColor:'grey',
    marginTop:5,
    marginBottom:5,
    
  },*/
});
  
//Get function
const mapStateToProps = (state) => {
  const {pro} = state;
  return {pro};
};

//Call set functions
const mapDispatchToProps = (dispatch) => bindActionCreators({setPro}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RulingsList);