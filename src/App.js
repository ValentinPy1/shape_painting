import './App.css';
import UploadImage from './UploadImage'
import ImageProcessing from './ImageProcessing'
import React, { useState } from 'react'

function App() {
  const [imageUrl1, setImageUrl1] = useState()
  const [imageUrl2, setImageUrl2] = useState()

  return (
    <div className="App">
      <UploadImage imageUrl={imageUrl1} setImageUrl={setImageUrl1}></UploadImage>
      <UploadImage imageUrl={imageUrl2} setImageUrl={setImageUrl2}></UploadImage>
      <ImageProcessing imageUrl_1={imageUrl1} imageUrl_2={imageUrl2}/>
    </div>
  );
}

export default App;
