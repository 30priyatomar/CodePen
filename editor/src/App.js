import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Editor from './Containers/Editor';
import Home from './Containers/Home';
import Header from './Components/Header';
import Homepage from './pages/Homepage';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Header/>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/:id' exact component = {Editor} />
          <Route path='/homepage' exact component = {<Homepage/>} />

        </Switch>
    </div>
    </BrowserRouter>
  );
}

export default App;
