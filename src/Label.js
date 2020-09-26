import React from 'react';
import './Label.css';
import './App.css';
import { List, Typography } from 'antd';
const { Title, Paragraph } = Typography;

class Label extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      playlist: this.props.playlist,
      spotifyApi: this.props.spotifyApi,
      audio_features: this.props.audio_features
    };
  }

  render () {
    const { playlist, audio_features } = this.props;
    var new_background_img = playlist.images[0].url;
    console.log("yet")
    console.log(audio_features)

    var num_valid_songs, danceability_sum, energy_sum, loudness_sum, valence_sum, tempo_sum, duration;
    num_valid_songs = danceability_sum = energy_sum = loudness_sum = valence_sum = tempo_sum = duration = 0;    
    audio_features.map((song) => {
      // make sure it's not null
      if (song) {
        num_valid_songs += 1;
        danceability_sum += song.danceability;
        energy_sum += song.energy;
        loudness_sum += song.loudness;
        valence_sum += song.valence;
        tempo_sum += song.tempo;
        duration += song.duration_ms;
      }
    });

    console.log(duration + "mins")
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours   = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const playlist_details = [
      {
        id: 'Danceability',
        value: (danceability_sum / num_valid_songs).toFixed(2)
      },
      {
        id: 'Energy',
        value: (energy_sum / num_valid_songs).toFixed(2)
      },
      {
        id: 'Loudness',
        value: (loudness_sum / num_valid_songs).toFixed(2)
      },
      {
        id: 'Valence',
        value: (valence_sum / num_valid_songs).toFixed(2)
      },
      {
        id: 'Tempo',
        value: (tempo_sum / num_valid_songs).toFixed(2)
      },
    ];

    console.log(playlist.name.length + " yuh");

    const playlist_by_str = playlist.name + " by " + playlist.owner.display_name;
    const formatted_playlist_by_str = (playlist_by_str.length < 55) ? playlist_by_str : (playlist_by_str.substring(0, 54) + "...")

    return (
      <div className="parent-div" >
        <div className="modal-background" style={{backgroundImage: 'url(' + new_background_img + ')'}}>
        </div>
      <div className="label" >
        
        
        <Title>Nutrition Facts</Title>
        <div className="playlist-gen-info">
          <p style={{fontSize: "medium"}}>{formatted_playlist_by_str}</p>
          <div className="runtime">
            <span>Runtime</span>
            <span style={{float: "right"}}>{(hours > 0) ? (hours + ' hrs') : ''} {minutes} mins</span>
          </div>
        </div>
        <div className="song-info">
          <span className="total-num-text">
            Total Number of <br /> 
            <span className="song-text">Songs</span>
          </span>
          <span className="num-song-text">{playlist.tracks.total}</span>
        </div>
        <div className="breakdown">
          <List
            dataSource={playlist_details}
            header={<div style={{fontWeight: "500", lineHeight: "3px", float: "right"}}>Average Value*</div>}
            renderItem={(item) => 
              <List.Item style={{lineHeight: "3px"}}>
                <div style={{display: "inline", float: "left"}}>
                <span style={{fontWeight: "500"}}>{item.id}</span><br/>
                </div>
                <span style={{float: "right"}}>{item.value}</span>
              </List.Item>}
          />
        </div>
        <div className="extra-info">
          <List>
            <List.Item style={{lineHeight: "3px"}}>
              <span style={{float: "left"}}>Followers</span>
              <span style={{float: "right"}}>{ (playlist.followers !== undefined) ? playlist.followers.total : 20394820398420398}</span>
            </List.Item>
            <List.Item style={{lineHeight: "3px"}}>
              <span style={{float: "left"}}>Public</span>
              <span style={{float: "right"}}>{(playlist.public) ? 'Y' : 'N'}</span>
            </List.Item>
          </List>
        </div>
        <div className="footer-text">
          *Local songs are not included. {
            (playlist.description.length === 0) ? (playlist.owner.display_name + " did not provide a description for this playlist.") : playlist.description
          }
        </div>
      </div>

      </div>
    );
  }
}

export default Label;
