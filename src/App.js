import React from 'react';
import Gallery from './components/Gallery.js'
import { Button, Typography } from 'antd';
import './App.css';

class App extends React.Component {

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

    const redirect_loc = window.location.href.includes('localhost') ? process.env.REACT_APP_LOCAL_LOGIN_URI : process.env.REACT_APP_LOGIN_URI;
    const connectSpotify = access_token ? (
      <Gallery spotifyApi={spotifyApi} />
    ) : (
      <div className="wrapper">
        <div className="content">
        <Typography.Title className="title">
          MutriFacts
        </Typography.Title>
        <Typography.Title level={5} className="sub-title">
          (Mu
          <span className="sub-title-parts">sic Nu</span>
          tri
          <span className="sub-title-parts">tion </span>
          Facts)
        </Typography.Title>
        <p className="description-mobile">See your playlists' audio features in the form of nutrition labels.</p>
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