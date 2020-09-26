import React from 'react';
import Gallery from './Gallery.js'
import { Button } from 'antd';
import './App.css';

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
    // button href eventually needs to be changed to deployed backend server? https://music-nutrifacts-server.herokuapp.com/login
    var SpotifyWebApi = require('spotify-web-api-node');

    // credentials are optional
    var spotifyApi = new SpotifyWebApi();    

    var params = this.getHashParams();

    var access_token = params.access_token;
    spotifyApi.setAccessToken(access_token);
    
    const connectSpotify = access_token ? (
      <Gallery spotifyApi={spotifyApi} />
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