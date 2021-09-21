import { StyleSheet,Image, Text, ScrollView, View, SafeAreaView, Dimensions, ImageBackground,TouchableOpacity,TextInput,FlatList,TouchableHighlight } from 'react-native';
import React, { Component } from 'react';
import { Radio,Input} from "native-base"
import ConvertText from '../services/ConvertText';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient'
import DividerLinearFullWidth from '../services/DividerLinearFullWidth';
import { SvgUri } from 'react-native-svg';
import { width } from 'styled-system';
import {connect} from 'react-redux';
import {setPro} from '../../redux/ProActions';
import {bindActionCreators} from 'redux';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 250;
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

 class OneSet extends Component {
  constructor(properties) {
    super(properties);
    this.state = {
      index:20,
      search:'',
      cards:{},
      datas:[],
    };
  }

  componentDidMount(){
      var randomPath = 'cards/search?q=e:"'+this.props.route.params.set.item;
          fetch('https://api.scryfall.com/'+encodeURI(randomPath), {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        }).then((response) => response.json())
        .then((json) => {
          if(json.status != 404 && json != undefined){
            this.state.autocompleteObject={}
            var BreakException = {};
            try {
              if(json.data.length > 0){
                this.setState({datas:json.data})
              }
            } catch (e) {
              if (e !== BreakException) throw e;
            }
            
          }else{
            this.state.autocompleteObject = [{name:"Nothing"}];
          }
        })
        .catch((error) => {
          console.error(error);
        });
  }

  renderItem = (card) => (<TouchableHighlight onPress={()=>{
    this.props.navigation.navigate("OneCardView", {item: this.state.datas[card.item],route:this.props.route,cantUpdate:false})
  }} style={{alignContent:"flex-start",alignItems:"flex-start",alignSelf:"flex-start"}}>
    <>
    <View style={{flexDirection:'row',width:Dimensions.get('window').width/1.3,}}>
    {/*this.state.sets[card.item].svg?<SvgUri
    style={{...styles.innerCircle,marginLeft:10,alignSelf:"center",alignItems:"center",alignContent:"center",color:"white"}}
      fill={"white"}
      fillAll={"white"}
      stroke="white"
      strokeOpacity={1}
      color={"white"}
      fillOpacity={1}
      width="25"
      height="25"
      uri={this.state.sets[card.item].svg}
  />:<></>*/}
    {<Image resizeMethod={"scale"} style={{width:80,height:80}} source={this.state.datas[card.item].image_uris && this.state.datas[card.item].image_uris.art_crop?{uri:this.state.datas[card.item].image_uris.art_crop}:""}/>}
    <View style={{padding:5}}>
      <Text style={{paddingTop:10,fontSize:16,fontWeight:"bold",flex:1,flexWrap:"wrap",maxWidth:imageWidth/2,color:"white"}}>{this.state.datas[card.item].printed_name?this.state.datas[card.item].printed_name:this.state.datas[card.item].name}</Text>
      <View style={{flexDirection:"row"}}>
      {this.props.pro.set && this.props.pro.set[this.state.datas[card.item].set] && this.props.pro.set[this.state.datas[card.item].set] && this.props.pro.set[this.state.datas[card.item].set].icon && this.props.pro.set[this.state.datas[card.item].set].icon != null && this.state.datas[card.item].set !="afc" && this.props.pro.set[this.state.datas[card.item].set].icon !="gk2"?<SvgUri
        style={styles.innerCircle}
          fill={this.state.datas[card.item].rarity == "uncommon"?"rgba(192,192,192,0.8)":(this.state.datas[card.item].rarity == "rare"?"gold":(this.state.datas[card.item].rarity == "common"?"white":("orange")))}
          stroke="white"
          strokeOpacity={0.5}
          color={this.state.datas[card.item].rarity == "uncommon"?"rgba(192,192,192,0.8)":(this.state.datas[card.item].rarity == "rare"?"gold":(this.state.datas[card.item].rarity == "common"?"white":("orange")))}
          fillOpacity={1}
          width="25"
          height="25"
          uri={this.props.pro.set[this.state.datas[card.item].set].icon}
      />:<></>}
        <Text style={{...styles.innerCircle,paddingTop:2,paddingLeft:3,paddingRight:3,height:25,color:"white"}}>{ConvertText(this.state.datas[card.item].mana_cost,this.state.datas[card.item].lang)}</Text>
      </View>
    </View>
    </View>
  {DividerLinearFullWidth()}
  </>
  </TouchableHighlight>
)
  render(){
      
    const dimensions = Dimensions.get('window');
    const imageHeight = Math.round(dimensions.width * 9 / 16);
    const imageWidth = dimensions.width;
        
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
        <View style={{marginBottom:80}} >

        <FlatList
          data={Object.keys(this.state.datas)}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
        />
        </View>
        </LinearGradient>
      );
  }

 }


 const styles = StyleSheet.create({
   textLabel:{
    color:"white",padding:15,fontSize:18,fontWeight:"bold"
   },
  backgroundStyle:{
    backgroundColor:"black"
  },
  image: {
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
      marginTop: 0,
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

const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 9 / 16);
const imageWidth = dimensions.width;
//Get function
const mapStateToProps = (state) => {
  const {pro} = state;
  return {pro};
};

//Call set functions
const mapDispatchToProps = (dispatch) => bindActionCreators({setPro}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OneSet);
