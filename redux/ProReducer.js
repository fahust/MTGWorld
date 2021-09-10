import {combineReducers} from 'redux';

const INITIAL_STATE = {
  decks:{},
  wishlists:{},
  topDecks:{},
  topCards:{},
  //url : "192.168.1.20:31098",
  url : "fosthome.mefound.com:31098",
  stack: undefined,
  drawer: undefined,
  nav:undefined,
  set:{},
  setName:{},
  voted:[],
  loved:[],
  collections:{cards:{}},
  collectionsCards:{cards:{}},
  idClient:Date.now(),
  sortFunctionCollection:undefined,
  nameClient:"",
  players:{},
  symbols:{},
  lang:"en",
  alert:"",
  alertOpen:false,
  alertType:"success",
};

//Need object assign for re-render component
const proReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_PRO':
      return Object.assign({}, state, {
        state: state,
      });

    case 'UPDATE_ONE_SIGNAL':
      return Object.assign({}, state, {
        updatedForOneSignal: 1,
      });

    case 'UPDATE_TIME':
      return Object.assign({}, state, {
        time: action.payload.time,
      });

    case 'ZERO_ONE_SIGNAL':
      return Object.assign({}, state, {
        updatedForOneSignal: 0,
      });

    case 'SET_INTERVENTION':
      return Object.assign({}, state, {
        intervention: action.payload.intervention,
      });

    case 'VIEW_NEW_TUILE':
      return Object.assign({}, state, {
        newTuileView: action.payload,
      });

    case 'VIEW_NEW_AVIS':
      return Object.assign({}, state, {
        newTuileAvis: action.payload,
      });

    case 'VIEW_NEW_INTERVENTION':
      return Object.assign({}, state, {
        newTuileIntervention: action.payload,
      });

      
    default:
      return state;
  }
  /*switch (action.type) {
    case 'ADD_FRIEND':
      // Pulls current and possible out of previous state
      // We do not want to alter state directly in case
      // another action is altering it at the same time
      const {
        current,
        possible,
      } = state;

      // Pull friend out of friends.possible
      // Note that action.payload === friendIndex
      const addedFriend = possible.splice(action.payload, 1);

      // And put friend in friends.current
      current.push(addedFriend);

      // Finally, update the redux state
      const newState = { current, possible };

      return newState;

    default:
      return state
  }*/
};

export default combineReducers({
  pro: proReducer,
});
