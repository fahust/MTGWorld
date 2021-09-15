import { StyleSheet, ScrollView, View, TouchableHighlight,Pressable,Dimensions ,ImageBackground,TextInput, KeyboardAvoidingView, Linking} from 'react-native';
import React, { Component } from 'react';
import {
  Text,
  HStack,
  Menu,
} from "native-base"
import {connect} from 'react-redux';
import {setPro} from '../redux/ProActions';
import {bindActionCreators} from 'redux';
import ConvertText from './services/ConvertText';
import { SvgUri } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient'
import DividerLinear from './services/DividerLinear';
import DividerLinearFullWidth from './services/DividerLinearFullWidth';
import storeData from './services/StoreData';
import * as Animatable from 'react-native-animatable';


 class OneMulti extends Component {
  constructor(properties) {
    super(properties);
    this.myRefs = []
    this.title1=undefined;
    this.state = {
      inputValue: '',
    };
    this.use = this.props.use[this.props.item]?this.props.use[this.props.item]:(this.props.use);
    //console.log(this.use)
  }

  sortFunction = () => {
    this.setState({})
  }

endEditDescription = () => {
  this.sortFunction();
  if(this.props.oneNavigateType=='deck')
      this.props.pro.lastDeckUpdate = this.props.route.params.item;
  storeData(this.props.pro);
  this.props.setPro({});
}

setDescription = (text,item) => {
  this.props.use[item].description = text;
  this.setState({})
}



  render() {

  return (
    <View 
    style={{
      height:Dimensions.get('window').height,
      width:Dimensions.get('window').width,
    }}>
    
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
  <ScrollView style={{marginBottom:190}}
  stickyHeaderIndices={[2,4,6,8,10,12,14,16,18,20,23]}>

    <View>
      {!this.props.cantUpdate?
      <TouchableHighlight
      activeOpacity={0.9}
      underlayColor="rgba(255,255,255,0.1)" onPress={() => this.props.navigation.navigate('addCardByText', {collection:this.props.collections,item: this.props.item,type:this.props.oneNavigateType,functionReload:()=>this.sortFunction(),image:true})} style={{color:"white",margin:2,backgroundColor:"#28283C",borderRadius: 10,width:Dimensions.get('window').width,flexDirection:"row",flexGrow:1,justifyContent:"space-between"}}>
        <View style={{color:"white",width:Dimensions.get('window').width,flexDirection:"row",flexGrow:1,justifyContent:"space-between"}}>
        <View style={{flexDirection:"row"}}>
          <Icon style={{padding:20}} name="search" size={40} color="white" />
          <View>
            <Text style={{color:"white",fontSize:20,fontWeight:"bold",padding:5}}>Looking for an image ?</Text>
            <Text style={{color:"white",fontSize:16,padding:5,width:Dimensions.get('window').width/1.55}}>Use quick search to find and change image of deck {this.props.collections?"collection":'deck : '+this.use.title}.</Text>
          </View>
        </View>
        <Icon style={{textAlignVertical: 'center',padding:15}} name="chevron-right" size={20} color="white" />
        </View>
      </TouchableHighlight>:<></>}
    </View>
    
        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{this.props.collections?<></>:DividerLinear("Description",0)}</LinearGradient>
        <View>{this.props.collections?<></>:<>
          <TextInput onEndEditing={()=>this.endEditDescription()} editable={this.props.cantUpdate==true?false:true} multiline value={this.use.description} style={{color:"white",width:Dimensions.get("window").width-15,padding:20,borderColor:"grey",borderWidth:0.5,borderRadius:5,margin:15}} onChangeText={text => this.setDescription(text,this.props.item)} placeholderTextColor="#fff"  placeholder="Write description deck here" /></>}</View>
          
        
      </ScrollView>
      </KeyboardAvoidingView>
      </View>
  );
}

}

 const styles = StyleSheet.create({
  innerCircle: {
    borderRadius: 5,
    width: 50,
    height: 50,
    margin: 5,
    padding: 5,
    //backgroundColor:"rgba(0, 0, 0, 0.15)"
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

export default connect(mapStateToProps, mapDispatchToProps)(OneMulti);