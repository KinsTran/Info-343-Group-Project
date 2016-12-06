/**
 * shared-state.js
 * module for declaring our shared redux store
 * and various action creation functions
 */

import {createStore} from "redux";

const ADD_MOVIE = "addmov";
const REMOVE_MOVIE= "removemov";
const CHANGE_COUNT = "change";
const DEFAULT_STATE = {items: []};
const LS_KEY = "redux-store";
const PRICE_DVD = 14.95;
const PRICE_BLU = 19.95;

function reducer(state, action) {
    switch(action.type) {
        case ADD_MOVIE:
            var pot = {
                item: action.item,
                format: action.format,
                quantity: action.quantity,
                price: action.format=="dvd"?PRICE_DVD:PRICE_BLU
            };
            for(var i = 0; i < state.items.length; i++) {
                if(state.items[i].item == action.item
                    && state.items[i].format == action.format) {
                        state.items[i].quantity += 1;
                        return Object.assign({}, {items: state.items});
                    }  
            }
            return Object.assign({}, {items:state.items.concat(pot)});
        case REMOVE_MOVIE:
            return Object.assign({},
                {items: state.items.filter(item => item.item.id+""+item.format != action.id)});
        case CHANGE_COUNT:
            return Object.assign({},
                {items: state.items.map(function(item) {
                    if(item.item.id+""+item.format == action.id) {
                        if(item.quantity > 1 || action.amount > 0) {
                            item.quantity += action.amount;
                        }
                    }
                    return item;
                })});

        default: return state;
    }
}

export function addMovie(item, format) {
    return {
        type: ADD_MOVIE,
        format: format,
        quantity: 1,
        item: item
    }
}

export function removeMovie(id) {
    return {
        type: REMOVE_MOVIE,
        id: id
    }
}

export function changeCount(id, amount) {
    return {
        type: CHANGE_COUNT,
        amount: amount,
        id: id
    }
}

var savedState = JSON.parse(localStorage.getItem(LS_KEY));
export var store = createStore(reducer, savedState || DEFAULT_STATE);

store.subscribe(() => localStorage.setItem(LS_KEY,
                    JSON.stringify(store.getState())
                    ));