import './App.css';
import {TextField, Button, Select, SelectChangeEvent, MenuItem} from '@mui/material';
import {useEffect, useState, useRef} from 'react';

function App() {
    const [text, setText] = useState('')
    const [files, setFiles] = useState([])
    const audioRef = useRef(null);
    const [voice, setVoice] = useState(0)
    const [type, setType] = useState('gtts')

    const handlePlay = (fileName) => {
        console.log(fileName)

        if (audioRef.current != null) {
            audioRef.current.pause()
        }
        audioRef.current = new Audio(`http://127.0.0.1:8000/audio_file?filename=${fileName}`)
        audioRef.current.play()
    }

    const handleClick = async (text, voice_index) => {
        await fetch(`http://127.0.0.1:8000/text-to-speech?text=${text}&voice_index=${voice_index}&type=${type}`)
        await fetchFiles()
    }

    const handleVoiceChange = (event) => {
        setVoice(event.target.value);
    }

    const handleTypeChange = (event) => {
        setType(event.target.value);
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
            <TextField id="outlined-multiline-flexible" label="Multiline" multiline onChange={(event) => {
                setText(event.target.value)
            }}/>
            <Select
                value={voice}
                onChange={handleVoiceChange}
                label='Voice'
            >
                <MenuItem value={0}>Алёна</MenuItem>
                <MenuItem value={1}>Максим</MenuItem>
                <MenuItem value={2}>Флирт</MenuItem>
            </Select>
            <Select
                value={type}
                onChange={handleTypeChange}
                label='Voice'
            >
                <MenuItem value={'tinkoff'}>Тинькофф</MenuItem>
                <MenuItem value={'gtts'}>gtts</MenuItem>
                <MenuItem value={'macos'}>MacOS</MenuItem>
                <MenuItem value={'espeak'}>ESpeak</MenuItem>
                <MenuItem value={'tts'}>TTS</MenuItem>
            </Select>
            <Button variant="outlined" onClick={() => {
                handleClick(text, voice)
            }}>Создать</Button>
            <FilesList files={files} handlePlay={handlePlay}/>
        </div>
    );
}

const FilesList = (props) => {
    const filesItems = props.files.map((file, index) =>
        <li key={index}>
            {file}
            <Button onClick={() => {
                props.handlePlay(file)
            }}>
                play
            </Button>
        </li>);
    return (
        <ul>{filesItems}</ul>
    );
}

export default App;
