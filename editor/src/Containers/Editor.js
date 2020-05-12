import React, { Component } from 'react';
import EditorComponent from '../Components/EditorComponent';

class Editor extends Component {
    state = {
        codes: ["#include<iostream>"],
        col: 0
    }

    handleChange = (e, idx) => {
        //shallow copy of codes
        let codes = [...this.state.codes];
        let str = e.currentTarget.value;
        codes[idx] = str;
        this.setState({ codes });
    }

    handleKeyUp = (e, idx) => {
        let ctrl = e.currentTarget;
        if (e.key === 'Enter') {
            //shallow copy of codes
            let codes = [...this.state.codes];
            //copy remaining string from cursor ro end
            let end = ctrl.selectionEnd;
            let nextString = codes[idx].substring(end);
            codes[idx] = codes[idx].substring(0, end);
            //add new row
            codes.splice(idx + 1, 0, nextString);
            this.setState({ codes }, () => {
                //move cursor to next input on enter
                //ctrl = next input element
                ctrl = ctrl.parentElement.parentElement.nextSibling.children[0].children[1];
                ctrl.focus();
                ctrl.setSelectionRange(0, 0);
            });
        }
        else if (e.key === 'ArrowDown' && idx !== this.state.codes.length - 1) {
            ctrl = ctrl.parentElement.parentElement.nextSibling.children[0].children[1];
            ctrl.focus();
            ctrl.setSelectionRange(this.state.col, this.state.col);
        }
        else if (e.key === 'ArrowUp' && idx !== 0) {
            ctrl = ctrl.parentElement.parentElement.previousSibling.children[0].children[1];
            ctrl.focus();
            ctrl.setSelectionRange(this.state.col, this.state.col);
        }
    }

    handleKeyDown = (e, idx) => {
        let ctrl = e.currentTarget;
        if (e.key === 'Backspace' && this.state.codes[idx].length === 0 && this.state.codes.length > 1) {
            //move cursor to prev input when current input is empty
            //ctrl = previous input element
            ctrl = ctrl.parentElement.parentElement.previousSibling.children[0].children[1];
            //setSelectionRange sets the start and end positions of current text selection in <input />
            let pos = ctrl.value.length;
            ctrl.focus();
            ctrl.setSelectionRange(pos, pos);

            //delete current row
            let codes = [...this.state.codes];
            codes.splice(idx, 1);
            this.setState({ codes });
        }
        if (e.key === 'ArrowDown') {
            this.setState({ col: ctrl.selectionEnd });
        }
        else if (e.key === 'ArrowUp') {
            this.setState({ col: ctrl.selectionEnd });
        }
    }


    render() {

        return (
            <EditorComponent
                codes={this.state.codes}
                handleChange={this.handleChange}
                handleKeyDown={this.handleKeyDown}
                handleKeyUp={this.handleKeyUp}
            />
        );
    }
}

export default Editor;