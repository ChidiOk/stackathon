import {createStore, applyMiddleware} from 'redux'
import reduxLogger from 'redux-logger';
import thunk from 'redux-thunk'
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-wasm';
// import { model } from '@tensorflow/tfjs';


//Action Types
const LOADING_MODEL = 'LOADING_MODEL'
const AWAITING_UPLOAD  = 'AWAITING_UPLOAD'
const READY = "READY"
const CLASSIFYING = 'CLASSIFYING'
const COMPLETE = 'COMPLETE'

//Action Creators
export const loadingModel = (model) => ({
        type: LOADING_MODEL,
        text: 'Loading Model...',
        model
})

export const awaitingUpload = () => ({
        type: AWAITING_UPLOAD,
        text: 'Upload Image',
})

export const ready = (imageUrl) => ({
        type: READY,
        text: 'Classify',
        imageUrl
})

export const classifying = (results) => ({
        type: CLASSIFYING,
        text: 'Classifying...', 
        results
})

export const complete = () => ({
        type: COMPLETE,
        text: 'Restart',
})


//Thunk Creators
export const loadModelThunk = () => {
    return async (dispatch) => {
        const mobilenetModel = await mobilenet.load();
        dispatch(loadingModel(mobilenetModel))
        dispatch(awaitingUpload())
    }
}

export const classifyingThunk = (img) => {
    return async (dispatch) => {
        console.log('IMAGGGEEEEEEEE', img)
        const theModel = store.getState().model
        const results = await theModel.classify(img)
        console.log(results)
        dispatch(classifying(results))
        dispatch(complete())
    }
}

//Initial State
const initialState = {
    buttonText: 'Load Model',
    imageUrl: '',
    results: [],
    model: null
}



//Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
      case LOADING_MODEL:
          return {...state, buttonText: action.text, model: action.model}   
      case AWAITING_UPLOAD:
          return {...state, buttonText: action.text, results: [], imageUrl: ''}
      case READY:
          return {...state, buttonText: action.text, imageUrl: action.imageUrl}
      case CLASSIFYING:
          return {...state, buttonText: action.text, results: action.results}
      case COMPLETE:
          return {...state, buttonText: action.text}

    default:
      return state
  }
}

const store = createStore(reducer, applyMiddleware(thunk, reduxLogger))

export default store
