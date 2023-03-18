import './App.css';
import { TextField, Button } from '@mui/material';
import { useEffect, useState, useRef } from 'react';

function App() {
  const [text, setText] = useState('')
  const [files, setFiles] = useState([])
  const audioRef = useRef(null);

  const handlePlay = (fileName) => {
    console.log(fileName)

    if (audioRef.current != null) {
      audioRef.current.pause()
    }
    audioRef.current = new Audio(`http://127.0.0.1:8000/audio_file?filename=${fileName}`)
    audioRef.current.play()
  }

  const handleClick = async (text) => {
    await fetch(`http://127.0.0.1:8000/tinkoff-text-to-speech?text=${text}`)
    await fetchFiles()
  }

  const fetchFiles = async () => {
    const response = await fetch(`http://127.0.0.1:8000/generated_audio`)
    const decoded = await response.json()
    console.log(decoded)
    setFiles(decoded)
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  return (
    <div className="App">
      <TextField id="outlined-multiline-flexible" label="Multiline" multiline onChange={(event) => { setText(event.target.value) }} />
      <Button variant="outlined" onClick={() => { handleClick(text) }}>Создать</Button>
      <FilesList files={files} handlePlay={handlePlay} />
    </div>
  );
}

const FilesList = (props) => {
  const filesItems = props.files.map((file, index) =>
    <li key={index}>
      {file}
      <Button onClick={() => { props.handlePlay(file) }}>
        play
      </Button>
    </li>);
  return (
    <ul>{filesItems}</ul>
  );
}

export default App;
