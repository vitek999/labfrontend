import './App.css';
import {
    TextField,
    Button,
    Select,
    SelectChangeEvent,
    MenuItem,
    Divider,
    Box,
    LinearProgress,
    createTheme, ThemeProvider, styled, linearProgressClasses
} from '@mui/material';
import {useEffect, useState, useRef} from 'react';
import {blue, red, yellow} from "@mui/material/colors";

function App() {
    const [text, setText] = useState('')
    const [files, setFiles] = useState([])
    const [latestFile, setLatestFile] = useState(null);
    const audioRef = useRef(null);
    const [voice, setVoice] = useState(0)
    const [type, setType] = useState('gtts')

    const [isProgressList, setProgressList] = useState(false)
    const [isProgressOneItem, setProgressOneItem] = useState(false)

    const handlePlay = (fileName) => {
        console.log(fileName)

        if (audioRef.current != null) {
            audioRef.current.pause()
        }
        audioRef.current = new Audio(`http://127.0.0.1:8000/audio_file?filename=${fileName}`)
        audioRef.current.play()
    }

    const handleClick = async (text, voice_index) => {
        setProgressList(true)
        setProgressOneItem(true)
        await fetch(`http://127.0.0.1:8000/text-to-speech?text=${text}&voice_index=${voice_index}&type=${type}`)
        await fetchFiles()
        await fetchLatestGeneratedFile()
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
        setProgressList(false)
    }

    const fetchLatestGeneratedFile = async () => {
        const response = await fetch('http://127.0.0.1:8000/latest_generated_audio')
        const decoded = await response.text();
        console.log("latest: " + decoded)
        setLatestFile(decoded)
        setProgressOneItem(false)
    }

    useEffect(() => {
        setProgressList(true)
        setProgressOneItem(true)
        fetchFiles()
        fetchLatestGeneratedFile()
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
            <Divider style={{marginTop: 10}}/>

            {isProgressOneItem ? <LinearIndeterminate color={'primary'}/> :
                <LatestFile latestFile={latestFile} handlePlay={handlePlay}/>}


            <Divider/>

            {/*{isProgressList ? <LinearIndeterminate color={'secondary'}/> :*/}
            {/*    <FilesList files={files} handlePlay={handlePlay}/>}*/}
        </div>
    );
}


const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));
const LinearIndeterminate = (props) => {
    return (
        <Box sx={{width: '100%'}}>
            <BorderLinearProgress size={80} thickness={100} color={props.color}/>
        </Box>
    );
}

const LatestFile = (props) => {
    return <div style={{marginLeft: 40}}>
        {props.latestFile}
        <Button onClick={() => {
            props.handlePlay(props.latestFile)
        }}>
            play
        </Button>
    </div>
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
