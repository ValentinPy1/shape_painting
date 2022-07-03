import './App.css';
import UploadImage from './UploadImage'
import Canva from './Canva'
import React, { useState } from 'react'

function App() {
  const [imageUrl, setImageUrl] = useState()

  return (
    <div className="App">
      <UploadImage imageUrl={imageUrl} setImageUrl={setImageUrl}></UploadImage>
      <Canva imageUrl={imageUrl}></Canva>
    </div>
  );
}

export default App;
