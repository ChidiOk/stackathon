import React, {Component} from 'react';
import './App.css';
import {connect} from 'react-redux'
import { awaitingUpload, ready, complete, loadModelThunk, classifyingThunk} from './store';



class App extends Component {
  constructor(){
    super()
    this.handleClick = this.handleClick.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.inputRef = null
    this.imageRef = null

  }


  handleClick(e){
    console.log('EVENT.TARGET.VALUEEEEEEE:', e.target.value)
    if (e.target.value === 'Load Model') this.props.loadModelThunk()
    if (e.target.value === 'Loading Model...') this.props.awaitingUpload(this.loadModel)
    if (e.target.value === 'Upload Image') {
      this.inputRef.click()
      this.props.ready()
    }
    if (e.target.value === 'Classify') this.props.classifyingThunk(this.imageRef)
    if (e.target.value === 'Classifying...') this.props.complete()
    if (e.target.value === 'Restart') this.props.awaitingUpload()
  }

  handleUpload(e){
    const {files} = e.target
    if (files.length > 0){
      const url = URL.createObjectURL(files[0])
      this.props.ready(url)
    }
  }


  render() {
    const {buttonText, imageUrl, results} = this.props
    return (
      <div className="App">
      <h1>Image Classifier</h1>
      <h3>Upload an image and see what it is classified as. This project uses Tensorflow.js and neural networks to predict and classify your image.</h3>
      {imageUrl && <img ref={imageRef => {this.imageRef = imageRef}} alt='preview' src={imageUrl} />}
      <input onChange={this.handleUpload} type='file' accept='image/*' capture='camera' ref={inputRef => {this.inputRef = inputRef}} />
      {results && (
        <ul>
          {results.map(({ className, probability }) => (
            <li key={className}>{`${className}: ${(probability * 100).toFixed(
              2
            )}%`}</li>
          ))}
        </ul>
      )}
      <button onClick={(e) => this.handleClick(e)} value={buttonText} type='button'>{buttonText}</button>
      <h6>made by Chidi Okeke</h6>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    buttonText: state.buttonText,
    imageUrl: state.imageUrl,
    results: state.results,
    model: state.model
  }
}



const mapDispatchToProps = (dispatch) => {
  return {
    awaitingUpload: () => dispatch(awaitingUpload()),
    ready: (url) => dispatch(ready(url)),
    classifyingThunk: (img) => dispatch(classifyingThunk(img)),
    complete: () => dispatch(complete()),
    loadModelThunk: () => dispatch(loadModelThunk())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App)


