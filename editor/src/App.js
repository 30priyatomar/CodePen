import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Editor from './Containers/Editor';
import Home from './Containers/Home';
import Header from './Components/Header';
import SignIn from './Components/SignIn/SignIn';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
  <Header />
  <Switch>
    <Route path='/' exact component={Home} />
    <Route path="/signin" exact component={SignIn} />

    <Route path='/about' exact render={() => { window.location.href = 'https://cginfinity.com';
           return <Redirect to='/' />;
            }}/>
    <Route path='/:id' exact component={Editor} />
  </Switch>
</div>
    </BrowserRouter>
  );
}
 console.log("Hi priya")
export default App;



