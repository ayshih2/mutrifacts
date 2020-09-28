import React from 'react';
import './Label.css';
import { List, Typography } from 'antd';
const { Title } = Typography;

class Label extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      playlist: this.props.playlist,
      spotifyApi: this.props.spotifyApi,
      audioFeatures: this.props.audioFeatures,
      popularity: this.props.popularity
    };
  }

  render () {
    const { playlist, audioFeatures, popularity } = this.props;

    // get playlist background image 
    var newBackgroundImg = null;
    if (playlist.images) {
      newBackgroundImg = playlist.images[0].url;
    }

    // calculate averages of all collected audio features
    var numValidSongs, danceabilitySum, energySum, loudnessSum, valenceSum, tempoSum, duration;
    numValidSongs = danceabilitySum = energySum = loudnessSum = valenceSum = tempoSum = duration = 0;    
    audioFeatures.forEach((song) => {
      // make sure it's not null
      if (song) {
        numValidSongs += 1;
        danceabilitySum += song.danceability;
        energySum += song.energy;
        loudnessSum += song.loudness;
        valenceSum += song.valence;
        tempoSum += song.tempo;
        duration += song.duration_ms;
      }
    });

    // convert runtime from milliseconds to hours and mins
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    // for main body of nutrition label
    const playlistDetails = [
      {
        id: 'Popularity',
        value: `${Math.round(popularity)}%`,
        description: 'Based on the total number of plays tracks have had and how recent those plays are.'
      },
      {
        id: 'Danceability',
        value: `${(danceabilitySum / numValidSongs * 100).toFixed(2)}%`, 
        description: 'Describes how suitable tracks are for dancing based on a ' + 
        'combination of musical elements like tempo and rhythm stability. A higher value means ' +
        'it\'s more danceable'
      },
      {
        id: 'Energy',
        value: `${(energySum / numValidSongs * 100).toFixed(2)}%`,
        description: 'Represents a perpetual ' + 
        'measure of intensity and activity. A higher value typically means more energetic tracks (i.e. sounds faster and noisier).'
      },
      {
        id: 'Valence',
        value: `${(valenceSum / numValidSongs * 100).toFixed(2)}%`,
        description: 'Describes the musical positiveness of a playlist. ' +
        'Tracks with a higher valence sound more positive (i.e. happy).'
      },
      {
        id: 'Loudness',
        value: (loudnessSum / numValidSongs).toFixed(2) + ' db',
        description: 'Describes the overall loudness averaged across the tracks. Values typically range from -60 to 0 db.'
      },
      {
        id: 'Tempo',
        value: Math.floor(tempoSum / numValidSongs) + ' BPM',
        description: ''
      }
    ];

    // for footer of nutrition label
    const footerData = [
      {
        id: 'Followers',
        value: (playlist.followers !== undefined) ? playlist.followers.total : 0
      },
      {
        id: 'Privacy',
        value: (playlist.public) ? 'Public' : 'Private' 
      }
    ];
    
    const playlistCreationDetails = playlist.name + " by " + playlist.owner.display_name;

    return (
      <div className="parent-div">
        {
          (newBackgroundImg) ? (
            <div className="modal-background" style={{backgroundImage: `url(${newBackgroundImg})`}}>
            </div>
          ) : (
            <div className="modal-background" style={{backgroundColor: "white", width: "100%"}}></div>
          )
        }
        <div className="label">
          <Title>Nutrition Facts</Title>
          <div className="playlist-gen-info">
            <div className="creation-info">{playlistCreationDetails}</div>
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
              dataSource={playlistDetails}
              header={<div className="breakdown-header">Audio Feature Averages*</div>}
              renderItem={(item) => 
                <List.Item>
                  <List.Item.Meta
                    title={<span className="breakdown-type">{item.id}</span>}
                    description= {<span className="breakdown-description">{item.description}</span>}
                  />
                  <div>{item.value}</div>
                </List.Item>}
            />
          </div>
          <div className="extra-info">
            <List
              dataSource={footerData}
              renderItem={(item) => 
                <List.Item>
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