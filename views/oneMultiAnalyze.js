import { StyleSheet, ScrollView, View, TouchableHighlight,Pressable,Dimensions ,ImageBackground,TextInput, KeyboardAvoidingView, Linking} from 'react-native';
import React, { Component } from 'react';
import {
  Text,
  VStack,
  HStack,
  Heading,
  Center,
  Badge,
  Menu,
  Divider,
  Box,
  Select,
  CheckIcon,
} from "native-base"
import {connect} from 'react-redux';
import {setPro} from '../redux/ProActions';
import {bindActionCreators} from 'redux';
import ConvertText from './services/ConvertText';
import { SvgUri } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  BarChart,
  PieChart,
} from "react-native-chart-kit";
import LinearGradient from 'react-native-linear-gradient'
import DividerLinear from './services/DividerLinear';
import DividerLinearFullWidth from './services/DividerLinearFullWidth';
import storeData from './services/StoreData';
import * as Animatable from 'react-native-animatable';


function arrayUnique(array) {
  var a = array.concat();
  for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
          if(a[i] === a[j])
              a.splice(j--, 1);
      }
  }

  return a;
}

 class OneMulti extends Component {
  constructor(properties) {
    super(properties);
    this.state = {  
      courbeDeMana:{
        1:0,
        2:0,
        3:0,
        4:0,
        5:0,
        6:0,
      },
      couleurs : [
      ],
    };
    this.use = this.props.use[this.props.item]?this.props.use[this.props.item]:(this.props.use);
    //console.log(this.use)
  }
  
  componentDidMount(){
    this.props.navigation.addListener('focus', () => {
      this.sortFunction();
    });
    this.sortFunction();
    if(this.props.collections){
      this.props.pro.sortFunctionCollection = this; 
    }
    
  }

sortFunction(){
  //if(this.props.collections)console.log(this.use);
    var colors = []
    this.state.courbeDeMana = {
      1:0,
      2:0,
      3:0,
      4:0,
      5:0,
      6:0,
    }
    this.state.couleurs = []
    var couleurs = {}
    if(this.use.cards){
      Object.keys(this.use.cards).forEach(card => {
        
        //if(this.use.cards[card].prices.eur != null) price += parseInt(this.use.cards[card].prices.eur);
        colors = arrayUnique(colors.concat(this.use.cards[card].color_identity));


        if(this.use.cards[card] && this.use.cards[card].colors && this.use.cards[card].colors.length > 0){
          this.use.cards[card].colors.forEach(color=>{
            if(!couleurs[color]){
              couleurs[color]=1;
            }else{
              couleurs[color]=couleurs[color]+1;
            }
          })
        }
  
        if(this.use.cards[card].cmc>=6){
          this.state.courbeDeMana[6]++;
        }else{
          this.state.courbeDeMana[this.use.cards[card].cmc]++;
        }
        
      });
    }

    Object.keys(couleurs).forEach(couleur => {
      if(couleur=="R"){
        var colorTemp = {
          name: "Red",
          population: couleurs[couleur],
          color: "#4C1610",
          legendFontColor: "rgba(255, 255, 255, 1)",
          legendFontSize: 15
        }
      }else if(couleur=="U"){
        var colorTemp = {
          name: "Blue",
          population: couleurs[couleur],
          color: "#1A263F",
          legendFontColor: "rgba(255, 255, 255, 1)",
          legendFontSize: 15
        }
      }else if(couleur=="B"){
        var colorTemp = {
          name: "Black",
          population: couleurs[couleur],
          color: "rgba(75, 75, 75, 1)",
          legendFontColor: "rgba(255, 255, 255, 1)",
          legendFontSize: 15
        }
      }else if(couleur=="W"){
        var colorTemp = {
          name: "White",
          population: couleurs[couleur],
          color: "rgba(220, 220, 220, 1)",
          legendFontColor: "rgba(255, 255, 255, 1)",
          legendFontSize: 15
        }
      }else if(couleur=="G"){
        var colorTemp = {
          name: "Green",
          population: couleurs[couleur],
          color: "#254A0A",
          legendFontColor: "rgba(255, 255, 255, 1)",
          legendFontSize: 15
        }
      }
      this.state.couleurs.push(colorTemp);
    })
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
      <ScrollView style={{marginBottom:190}} stickyHeaderIndices={[0,2,4,8,10,12,14,17,19,21,23]}>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{DividerLinear("Mana Curve",0)}</LinearGradient>
        <BarChart
          style={{
            marginVertical: 8,
            borderRadius: 0,
            color:"white"
          }}
          data={{
            labels: ["1 Mana", "2 Mana", "3 Mana", "4 Mana", "5 Mana", "6+"],
            datasets: [
              {
                data: [
                  this.state.courbeDeMana[1],
                  this.state.courbeDeMana[2],
                  this.state.courbeDeMana[3],
                  this.state.courbeDeMana[4],
                  this.state.courbeDeMana[5],
                  this.state.courbeDeMana[6],
                ]
              }
            ]
          }}
          width={Dimensions.get("window").width}
          height={250}
          yAxisLabel="Nbr : "
          chartConfig={{
            barColors: ["#fff", "#fff", "#fff","#fff", "#fff", "#fff"],
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "#fff",
            backgroundGradientToOpacity: 0,
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, 1)`,
            strokeWidth: 20,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "20",
              stroke: "#ffa726"
            }
          }}
          verticalLabelRotation={30}
        />

      <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} style={{marginTop:10}}>{Object.keys(this.state.couleurs).length<=0?<></>:DividerLinear("Colours",0)}</LinearGradient>
      <View>{Object.keys(this.state.couleurs).length<=0?<></>:<PieChart
        style={{marginBottom:50,paddingBottom:50}}
          data={this.state.couleurs}
          width={Dimensions.get('window').width}
          height={150}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />}</View>
        
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