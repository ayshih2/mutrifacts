import React from 'react';
import './Label.css';
import './App.css';
import { List, Typography } from 'antd';
const { Title } = Typography;

class Label extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      playlist: this.props.playlist,
      spotifyApi: this.props.spotifyApi,
      audio_features: this.props.audio_features,
      popularity: this.props.popularity
    };
  }

  render () {
    const { playlist, audio_features, popularity } = this.props;

    // get playlist background image 
    var new_background_img = null;
    if (playlist.images) {
      new_background_img = playlist.images[0].url;
    }

    // calculate averages of all collected audio features
    var num_valid_songs, danceability_sum, energy_sum, loudness_sum, valence_sum, tempo_sum, duration;
    num_valid_songs = danceability_sum = energy_sum = loudness_sum = valence_sum = tempo_sum = duration = 0;    
    audio_features.forEach((song) => {
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

    // convert runtime from milliseconds to hours and mins
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    // for main body of nutrition label
    const playlist_details = [
      {
        id: 'Popularity',
        value: Math.round(popularity),
        description: "Out of 100 and based on the total number of plays a track has had and how recent those plays are."
      },
      {
        id: 'Danceability',
        value: (danceability_sum / num_valid_songs).toFixed(2), 
        description: "Describes how suitable a track is for dancing based on a " + 
        "combination of musical elements like tempo and rhythm stability. A value of 0.0 is " +
        "least danceable while 1.0 is most danceable."
      },
      {
        id: 'Energy',
        value: (energy_sum / num_valid_songs).toFixed(2),
        description: "A measure from 0.0 to 1.0 that represents a perpetual " + 
        "measure of intensity and activity. A higher value typically means a more energy track (i.e. sounds faster and noisier)."
      },
      {
        id: 'Valence',
        value: (valence_sum / num_valid_songs).toFixed(2),
        description: "Describes the musical positiveness conveyed by a track (from 0.0 to 1.0). " +
        "Tracks with a higher valence sound more positive (i.e. happy)."
      },
      {
        id: 'Loudness',
        value: (loudness_sum / num_valid_songs).toFixed(2) + " db",
        description: "Describes the overall loudness averaged across a track. Values typically range from -60 to 0 db."
      },
      {
        id: 'Tempo',
        value: Math.floor(tempo_sum / num_valid_songs) + " BPM",
        description: ""
      }
    ];

    // for footer of nutrition label
    const footer_data = [
      {
        id: 'Followers',
        value: (playlist.followers !== undefined) ? playlist.followers.total : 0
      },
      {
        id: 'Privacy',
        value: (playlist.public) ? 'Public' : 'Private' 
      }
    ];

    // prevent playlist name from overflowing by truncating it if it's too long
    const playlist_by_str = playlist.name + " by " + playlist.owner.display_name;
    const formatted_playlist_by_str = (playlist_by_str.length < 55) ? playlist_by_str : (playlist_by_str.substring(0, 54) + "...")

    return (
      <div className="parent-div" >
        {
          (new_background_img) ? (
            <div className="modal-background" style={{backgroundImage: `url(${new_background_img})`}}>
            </div>
          ) : (
            <div className="modal-background" style={{backgroundColor: "gray", width: "100%"}}></div>
          )
        }
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
              header={<div style={{fontWeight: "500", lineHeight: "3px", float: "right"}}>Audio Feature Averages*</div>}
              renderItem={(item) => 
                <List.Item style={{lineHeight: "3px"}}>
                  <List.Item.Meta
                    title={<span style={{fontWeight: "500", float: "left"}}>{item.id}</span>}
                    description= {<span style={{textAlign: "left", float: "left", fontSize: "x-small", paddingRight: "10%"}}>{item.description}</span>}
                  />
                  <div>{item.value}</div>
                </List.Item>}
            />
          </div>
          <div className="extra-info">
            <List
              dataSource={footer_data}
              renderItem={(item) => 
                <List.Item style={{lineHeight: "3px"}}>
                  <span style={{float: "left"}}>{item.id}</span>
                  <span style={{float: "right"}}>{item.value}</span>
                </List.Item>
              }
            />
          </div>
          <div className="footer-text">
            *Note: Local songs are included in the total number of songs but not in the runtime or audio feature stats. {
              (playlist.description.length === 0) ? "" : playlist.description
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Label;