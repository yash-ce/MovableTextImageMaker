import React, { useState } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './App.css';
import img from './assets/demo.jpg'

function App() {
  const [imageURL, setImageURL] = useState(img);
  const [text, setText] = useState('');
  const [textOverlays, setTextOverlays] = useState([]);
  const [imageFetched, setImageFetched] = useState(false);

  const fetchImage = async () => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos/random?client_id=YOUR_UNSPLASH_API_KEY`
      );
      setImageURL(response.data.urls.regular);
      setImageFetched(true);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const addTextOverlay = () => {
    if (text.trim() !== '') {
      setTextOverlays([
        ...textOverlays,
        { content: text, top: 100, left: 100, width: 200, height: 100 },
      ]);
      setText('');
    }
  };

  const handleOverlayDrag = (index, e, ui) => {
    const newOverlays = [...textOverlays];
    newOverlays[index].top += ui.deltaY;
    newOverlays[index].left += ui.deltaX;
    setTextOverlays(newOverlays);
  };

  const handleOverlayResize = (index, e, direction, ref, delta, position) => {
    const newOverlays = [...textOverlays];
    newOverlays[index].width = ref.style.width;
    newOverlays[index].height = ref.style.height;
    newOverlays[index].top = position.y;
    newOverlays[index].left = position.x;
    setTextOverlays(newOverlays);
  };

  const handleTextChange = (index, newText) => {
    const newOverlays = [...textOverlays];
    newOverlays[index].content = newText;
    setTextOverlays(newOverlays);
  };

  return (
    <div className="app">
      <div className="controls">
        <button onClick={fetchImage} disabled={imageFetched}>Fetch Image</button>
        <input
          type="text"
          placeholder="Enter text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={addTextOverlay}>Add Text</button>
      </div>
      <div className="image-container">
        {imageURL && <img src={imageURL} alt="Unsplash" />}
        {textOverlays.map((overlay, index) => (
          <Draggable
            key={index}
            defaultPosition={{ x: overlay.left, y: overlay.top }}
            onDrag={(e, ui) => handleOverlayDrag(index, e, ui)}
          >
            <Resizable
              width={overlay.width}
              height={overlay.height}
              onResize={(e, direction, ref, delta, position) =>
                handleOverlayResize(index, e, direction, ref, delta, position)
              }
            >
              <div
                className="text-overlay"
                style={{
                  top: overlay.top,
                  left: overlay.left,
                  width: overlay.width,
                  height: overlay.height,
                  backgroundColor: 'transparent',
                }}
              >
                <textarea
                  rows="3" // Adjust the number of rows as needed
                  value={overlay.content}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    resize: 'none',
                    width: '100%',
                    height: '100%',
                    fontSize: '40px',
                    color: 'black', // Set text color to improve visibility
                  }}
                />
              </div>
            </Resizable>
          </Draggable>
        ))}
      </div>
    </div>
  );
}

export default App;