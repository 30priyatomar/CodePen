import React, { Component } from 'react';
import EditorComponent from '../Components/EditorComponent';
import axios from 'axios';
import MonacoEditor from 'react-monaco-editor';

// automatically reconnects if the connection is closed
import ReconnectingWebSocket from 'reconnecting-websocket';
import shareDB from 'sharedb/lib/client';
import StringBinding from './stringBinding';
import getEnv from '../environment';

const isDev = getEnv();
const serverURL = isDev ? process.env.REACT_APP_DEV_SERVER_URL : process.env.REACT_APP_PROD_SERVER_URL;
const websocketURL = isDev ? process.env.REACT_APP_DEV_WEB_SOCKET_URL : process.env.REACT_APP_PROD_WEB_SOCKET_URL;

//open websocket connection to shareDB server
const rws = new ReconnectingWebSocket(websocketURL);
const connection = new shareDB.Connection(rws);
//create local doc instance mapped to 'examples' collection document with id 'textarea'
const doc = connection.get('examples', 'textarea');

class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            input: '',
            output: '',
            editor: null,
            monaco: null,
            binding: null,
        }
    }

    componentDidMount() {
        doc.subscribe((err) => {
            if (err) throw err;
            var binding = new StringBinding(this.state.editor, this, doc, ['content']);
            binding.setup(this);
            this.setState({binding});
        });
    }

    editorDidMount = (editor, monaco) => {
        editor.focus();
        // editor.setSelection(new monaco.Range(1,1,1,1));
        this.setState({editor, monaco})
    }

    onChange = (newValue, e) => {
        this.state.binding._inputListener(this.state.code, newValue, e);
    }

    handleRun = () => {
        // Convert array of codes into a single string
        const code = this.state.editor.getValue();
        // Send API call to run code
        axios.post(serverURL+'/code/run', {
            code: code,
            input: this.state.input,
            id: 123
        }).then(response => {
            this.state.binding._outListener(this.state.output, response.data);
            this.setState({output: response.data});
            // doc.submitOp([{ p: ['output',0], ld: this.state.output, li: response.data }]); //p: PATH
            
        }).catch(err => {
            if(err.response.status === 400) {
                this.state.binding._outListener(this.state.output, err.response.data);
                this.setState({output: err.response.data});
            }
            
            // doc.submitOp([{ p: ['output',0], ld: this.state.output, li: String(err.response.data) }]); //p: PATH
        })
    }

    handleInputChange = (e) => {
        this.state.binding._inListener(this.state.input, e.target.value);
        this.setState({input: e.target.value});
    }

    render() {
        const code = this.state.code;
        const input = this.state.input;
        const output = this.state.output;
        const options = {
            selectOnLineNumbers: true, // Select line by clicking on line number
            minimap: {
                enabled: false
            }
        }
        return (
            <React.Fragment>
            <MonacoEditor
            width="600"
            height="400"
            language="cpp"
            theme="vs-dark"
            value={code}
            options={options}
            onChange={this.onChange}
            editorDidMount={this.editorDidMount}
            />
            <button onClick={this.handleRun}>run code</button>
            <div>input:</div>
            <textarea value={input} onChange={this.handleInputChange}></textarea>
            <div>output:</div>
            <textarea value={output} readOnly={true}></textarea>
            </React.Fragment>
        );
    }
}

export default Editor;