import React from 'react';
import Gallery from './Gallery.js'
import { Button, Typography, Divider } from 'antd';
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

    const redirect_loc = window.location.href.includes('localhost') ? 'http://localhost:8888/login' : 'https://music-nutrifacts-server.herokuapp.com/login';
    const connectSpotify = access_token ? (
      <Gallery spotifyApi={spotifyApi} />
    ) : (
      <div style={{display: "table", width: "100%", height: "100vh"}}>
        <div style={{display: "table-cell", verticalAlign: "middle"}}>
        <Typography.Title className="title">Mu<span className="title-parts-format">sic </span>Nutri<span className="title-parts-format">tion</span> <span>Facts</span></Typography.Title>
        <p className="description-mobile" style={{width: "80%", padding: "0 10px", marginRight: "auto", marginLeft: "auto"}}>See your playlists' audio features in the form of nutrition labels.</p>
        <Button shape="round" href={redirect_loc}>Log in with Spotify</Button></div>
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