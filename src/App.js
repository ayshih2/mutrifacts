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
    var SpotifyWebApi = require('spotify-web-api-node');

    // credentials are optional
    var spotifyApi = new SpotifyWebApi();    
    var params = this.getHashParams();
    var access_token = params.access_token;
    spotifyApi.setAccessToken(access_token);

    const redirect_loc = 'https://music-nutrifacts-server.herokuapp.com/login';
    const connectSpotify = access_token ? (
      <Gallery spotifyApi={spotifyApi} />
    ) : (
      <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100vh"}}>
        <Button href={redirect_loc}>Log in</Button>
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

// {
//   window.location = window.location.href.includes('localhost') 
//     ? 'http://localhost:8888/login' 
//     : 'https://better-playlists-backend.herokuapp.com/login' }