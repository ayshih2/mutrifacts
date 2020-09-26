import React from 'react';
import { Button, Image, List, Row, Col, Divider, Typography, Modal } from 'antd';
import './Gallery.css';
import Label from './Label.js';
import LazyLoad from 'react-lazyload';

const { Title } = Typography;


class Gallery extends React.Component { 

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      playlists: [],
      curr_playlist: null,
      audio_features: [],
      visible: false,
    };
  }

  componentDidMount() {
    const { spotifyApi } = this.props;

    var user_id = null;
    spotifyApi.getMe()
    .then(function(data) {
      console.log('Some information about the authenticated user', data.body);
      user_id = data.body.id;
    }, function(err) {
      console.log('Something went wrong!', err);
    });

    spotifyApi.getArtistAlbums('2WuKU0SYZOQyY3MmE4vtez').then(
      function(data) {
        console.log('Artist albums', data.body);
      },
      function(err) {
        console.error(err);
      }
    );  
    
    var get_all_playlists = spotifyApi.getUserPlaylists(user_id).then(function(data) {
      console.log('Retrieved playlists', data.body);
      return data.body;
    }).catch(function (err) {
      console.error(err);
    });

    get_all_playlists.then((data) => {
      this.setState({
        playlists: data.items,
        curr_playlist: null
      })
    });
  }

  state = { visible: false };

  showModal = (playlist, idx) => {
    const { spotifyApi, access_token } = this.props;
    var get_playlist = spotifyApi.getPlaylist(playlist.id)
    .then(function(data) {
      console.log('Some information about this playlist', data.body);
      return data.body;
    }, function(err) {
      console.log('Something went wrong!', err);
    });

    console.log(get_playlist);

    get_playlist.then((data) => {
      console.log(":////////")
      console.log(data)
      this.setState({
        visible: true,
        curr_playlist: data
      }, this.calcPlaylistAudioFeatures);
    });

    console.log("u talking crazy with that " + access_token);

    // const individualTracksUrl = {
    //   url: `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
    //   headers: { 'Authorization': `Bearer ${access_token}` },
    //   json: true
    // }

    // console.log("aklfjsdlkfj");
    // fetch(individualTracksUrl).then(response => response.json())
    // .then(data => console.log(data));


    // this.setState({
    //   visible: true,
    //   curr_playlist: playlist,
    // });
  };

  async calcPlaylistAudioFeatures() {
    const { spotifyApi } = this.props;
    var track_ids = [];
    (this.state.curr_playlist.tracks.items).map((track_obj) => {
      if (track_obj.track) {
        track_ids.push(track_obj.track.id);
      }
    });

    var getAudioFeatures = spotifyApi.getAudioFeaturesForTracks(track_ids)
    .then(function(data) {
      console.log(data.body);
      return data.body;
    }, function(err) {
      console.log("failed");
    });

    console.log(getAudioFeatures);

    var audio_features = []
    await getAudioFeatures.then((data) => {
      this.setState({
        audio_features: data.audio_features
      });
      //audio_features = data.audio_features;
    });


    // console.log("yee")
    // console.log(audio_features)
    // var num_valid_songs, danceability_sum, energy_sum, loudness_sum, valence_sum, tempo_sum, duration;
    // num_valid_songs = danceability_sum = energy_sum = loudness_sum = valence_sum = tempo_sum = duration = 0;
    // console.log(duration)
    // audio_features.map((song) => {
    //   // make sure it's not null
    //   if (song) {
    //     num_valid_songs += 1;
    //     danceability_sum += song.danceability;
    //     energy_sum += song.energy;
    //     loudness_sum += song.loudness;
    //     valence_sum += song.valence;
    //     tempo_sum += song.tempo;
    //     duration += song.duration;
    //   }
    // });
    // console.log(duration)


    // // convert duration from milliseconds to hours mins
    // const minutes = Math.floor((duration / (1000 * 60)) % 60);
    // const hours   = Math.floor((duration / (1000 * 60 * 60)) % 24);

  }

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const size = 3;
    var split_playlist = [...this.state.playlists];
    const res = split_playlist.reduce((acc, curr, i) => {
      if ( !(i % size)  ) {   
        // push chunk of original array to accumulator
        acc.push(split_playlist.slice(i, i + size));
      }
      return acc;
    }, []);   
    
    return (
      <div className="main">
        <Title className="instruction">❥ choose a playlist to see its nutritional value.</Title>
          {
            res.map((row_data, i) => {
              return (
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{padding: "0.5em"}} key={"r" + i}>
                  {row_data.map((col_data, j) => {
                    return (
                      <Col span={8} key={"c" + j}>
                        <Image preview={false} src={col_data.images[0].url} onClick={() => this.showModal(col_data)}/>
                        <Title level={4}>{col_data.name}</Title>
                      </Col>
                    )
                  })}
                </Row>
              )
            })
          }

        <Modal
          title="View Nutrition Label"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={[
            <Button key="1">Download label</Button>,
            <Button key="2" type="primary" onClick={this.handleOk}>Close</Button>
          ]}
        >          
          <Label playlist={this.state.curr_playlist} audio_features={this.state.audio_features} spotifyApi={this.props}/>
        </Modal>
      </div>
    );    
  }
}

export default Gallery;