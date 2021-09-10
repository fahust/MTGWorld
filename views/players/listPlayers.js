import { StyleSheet,Image, ScrollView, View, SafeAreaView, TouchableOpacity,Pressable,Dimensions ,ImageBackground } from 'react-native';
import React, { Component } from 'react';
import {
  Text,
  Input,
} from "native-base"
import {connect} from 'react-redux';
import {setPro} from '../../redux/ProActions';
import {bindActionCreators} from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient'
import DividerLinearFullWidth from '../services/DividerLinearFullWidth';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dialog from "react-native-dialog";
import storeData from '../services/StoreData';
var DecksImg = require('../img/DecksImg.png');
var CollectionsImg = require('../img/CollectionsImg.png');

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

class ListPlayers extends Component {
  constructor(properties) {
    super(properties);
    this.state = {
      name : this.props.pro.nameClient,
      index : 20,
      search : "",
      visibleChangeName: false,
    };
  }
  
  componentDidMount(){
    this.props.navigation.addListener('focus', () => {
      this.props.setPro({});
    });
    this.props.navigation.setOptions({title:'List Players'});
  }

  onePlayer = (idClient) => {
    fetch('http://'+this.props.pro.url+'/datasOnePlayer', {
        method: 'POST',
        body: JSON.stringify({'idClient':idClient}),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      }).then((response) => response.json())
      .then((json) => {
        //console.log(json.player.decks)
        //console.log(this.props.navigation)
        this.props.navigation.navigate("MultiDeckPlayer", {decks: json.player.decks,player: json.player.n})
      })
      .catch((error) => {
        console.error(error);
      });
  }

  addIndexToScroll = () => {
    this.setState({index:this.state.index+10})
  }

  listFunction = () => {
    var key = 0;
    return Object.keys(this.props.pro.players).map((player,index)=>{
      if(key<this.state.index){
        if((this.state.search == ""||similarity(this.state.search,this.props.pro.players[player].n?this.props.pro.players[player].n:"") > 0.5)){
          key++
          return <TouchableOpacity key={key} onPress={()=>{
            this.onePlayer(player)
          }}>
            <View style={{flexDirection:"row",margin:10,justifyContent:"space-between"}}>
              <View style={{flexDirection:"row"}}>
                <Image style={{width:30,height:30,marginRight:10,marginLeft:10,tintColor:"white"}} source={DecksImg} />
                <Text style={{color:"silver",fontSize:16,fontWeight:"bold"}}>  {this.props.pro.players[player].d}</Text>
              </View>
              <Text style={{color:"white",fontSize:18,fontWeight:"bold",paddingLeft:30,paddingRight:30}}>{this.props.pro.players[player].n}</Text>
              <View style={{flexDirection:"row"}}>
                <Image style={{width:30,height:30,tintColor:"white"}} source={CollectionsImg} />
                <Text style={{color:"silver",fontSize:16,fontWeight:"bold"}}>  {this.props.pro.players[player].c}</Text>
              </View>
            </View>
            {DividerLinearFullWidth()}
          </TouchableOpacity>
        }
      }
    })
  }

  closeChangeName = () =>{
    if(this.state.name == ""){
      this.state.name = "client "+Date.now();
      this.props.pro.nameClient = this.state.name;
    }else{
      this.props.pro.nameClient = this.state.name;
    }
    this.setState({visibleChangeName:false})
    storeData(this.props.pro);
    this.props.setPro({});
  }

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
      <ImageBackground blurRadius={1} style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height/2,marginTop:Dimensions.get('window').height/3,resizeMode: 'cover',position:"absolute"}} source={backgroundImg} alt="image base" resizeMode="cover" roundedTop="md" imageStyle= {{opacity:0.1}} />
      <Dialog.Container visible={this.state.visibleChangeName}>
        <Dialog.Title>Choose your username</Dialog.Title>
        <Dialog.Input
        onRequestClose={()=>{this.closeChangeName()}}
        placeholder="Tap your Username"
        style={{width:imageWidth/2,backgroundColor:"white",height:40,color:"black"}}
        onChangeText={(text)=> this.setState({ name: text })}
        value={this.state.name}
        >
        </Dialog.Input>
        <Dialog.Button label="Choose" onPress={ ()=>{this.closeChangeName()} }  />
      </Dialog.Container>
      <Input
        style={{height:50,margin:10,width:Dimensions.get('window').width-20,color:"white"}}
        width={Dimensions.get('window').width}
        color="white"
          autoCapitalize="none"
          placeholder="Search"
          underlineColorAndroid='rgba(0, 0, 0, 0)'
          value = {this.state.search}
          onChangeText={search => this.setState({search: search,index:20})}
        />
    <ScrollView style={{marginBottom:80}}
    onScroll={({nativeEvent}) => {
      if (isCloseToBottom(nativeEvent)) {
        this.addIndexToScroll();
      }
    }}
    scrollEventThrottle={400}
    >
    <ImageBackground  blurRadius={0} style={{width:Dimensions.get('window').width*1.5,height:130,resizeMode: 'cover'}} source={backgroundImg} alt="image base" resizeMode="cover" roundedTop="md" >
          </ImageBackground>
          <TouchableOpacity onPress={()=>{this.setState({visibleChangeName:true})}} style={{color:"white",margin:2,backgroundColor:"#28283C",borderRadius: 10,width:Dimensions.get('window').width,flexDirection:"row",flexGrow:1,justifyContent:"space-between"}}>
            <View style={{flexDirection:"row"}}>
              <Icon style={{padding:20}} name="edit" size={40} color="white" />
              <View>
                <Text style={{color:"white",fontSize:20,fontWeight:"bold",padding:5}}>{this.props.pro.nameClient}</Text>
                <Text style={{color:"white",fontSize:16,padding:5,width:Dimensions.get('window').width/1.55}}>Click to change your username</Text>
              </View>
            </View>
            <Icon style={{textAlignVertical: 'center',padding:15}} name="chevron-right" size={20} color="white" />
          </TouchableOpacity>
        {this.listFunction()}
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
    borderRadius: 5,
    width: 100,
    height: 100,
    margin: 10,
    padding: 10,
    //backgroundColor: 'rgba(50, 50, 50, 1.0)'
  },
  backgroundStyle:{
    backgroundColor:"black"
  },
  image: {
      height: 300,
      width: 300,
      marginTop: 30,
      borderRadius: 10,
    },
  screen: {
    flex: 1,
    alignItems: 'center',
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
  
//Get function
const mapStateToProps = (state) => {
  const {pro} = state;
  return {pro};
};

//Call set functions
const mapDispatchToProps = (dispatch) => bindActionCreators({setPro}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ListPlayers);