import React from 'react';
import logo from './logo.svg';
import Label from './Label.js';
import Gallery from './Gallery.js'
import { Button } from 'antd';
import './App.css';
import { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class App extends React.Component {
  constructor(){
    super();
    const params = this.getHashParams();
    console.log(params);
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  render() {

    var SpotifyWebApi = require('spotify-web-api-node');

    // credentials are optional
    var spotifyApi = new SpotifyWebApi();    

    var params = this.getHashParams();

    var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;
    console.log(params);

    spotifyApi.setAccessToken(access_token);
    
    const connectSpotify = access_token ? (
      <Gallery spotifyApi={spotifyApi}/>
    ) : (
      <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100vh"}}>
        <Button href="http://localhost:8888/login">Log in</Button>
      </div>
    );

    return (
      <div>
        {connectSpotify}
      </div>
    );
  }
}

export default App;

{/* <div className="App" style={{padding: "20px"}}>
        
<Route path="/user/:accessToken/:refreshToken" component={User} />
{<Gallery />
<Label /> }
</div> */}

// return (
//   <Router>
//     <Route path="http://localhost:3000/:accessToken/:refreshToken" component={Gallery} />
//     <Route path="/"><a href="http://localhost:8888/login">Log in</a></Route>
//   </Router>
// );