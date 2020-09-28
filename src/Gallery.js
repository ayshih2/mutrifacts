import React from 'react';
import { Button, Image, Row, Col, Typography, Modal, Spin, Skeleton } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import './Gallery.css';
import Label from './Label.js';
import domtoimage from 'dom-to-image-chrome-fix-retina';
import { saveAs } from 'file-saver';
import LazyLoad from 'react-lazyload';

class Gallery extends React.Component { 

  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      curr_playlist: null,
      audio_features: [],
      visible: false,
      data_loaded: false,
    };
  }

  async componentDidMount() {
    const { spotifyApi } = this.props;

    var user_id = null;
    spotifyApi.getMe()
    .then(function(data) {
      user_id = data.body.id;
    }, function(err) {
      console.log('Something went wrong!', err);
    });
 
    var playlists = [];
    var offset = 0
    var num_retreived = 0;
    const max = 50;
    // spotify api only retrieves up to 50 playlists at a time, must loop if user has > 50 playlists
    do {
      await spotifyApi.getUserPlaylists({user_id: user_id, limit: max, offset: offset}).then(function(data) {
        return data.body;
      // eslint-disable-next-line no-loop-func
      }).then((data) => {
        playlists = [...playlists, ...data.items];
        offset += data.items.length;
        num_retreived = data.items.length;
        return playlists;
      }).catch(function (err) {
        console.error(err);
      });
    } while (num_retreived === max)

    this.setState({
      playlists: playlists,
      curr_playlist: null
    });
  }

  /* 
   * For modal visiblity.
   */
  state = { visible: false };

  /*
   * Modal was clicked, so must get playlist track info (audio features + popularity) to fill out
   * nutrition label.
   */
  async showModal (playlist, idx) {
    const { spotifyApi } = this.props;

    var get_playlist = spotifyApi.getPlaylist(playlist.id)
    .then(function(data) {
      return data.body;
    }, function(err) {
      console.log('Something went wrong!', err);
    });

    get_playlist.then((data) => {
      this.setState({
        visible: true,
        curr_playlist: data
      }, this.calcPlaylistAudioFeatures);
    });
  };

  async calcPlaylistAudioFeatures() {
    const { spotifyApi } = this.props;
    const limit = 100;
    var offset = 0;
    var audio_features = [];
    var popularity_sum = 0;

    // spotify api gets 100 songs/audio features at once, must loop to get all
    do {
      await spotifyApi.getPlaylistTracks(this.state.curr_playlist.id, {
        offset: offset,
        limit: limit,
        fields: 'items.track'
      // eslint-disable-next-line no-loop-func
      }).then(function(data) {
        // first get as many tracks as possible (max=limit=100) at once
        offset += data.body.items.length;
        var valid_songs = [];
        // get list of valid track ids (i.e. aren't local songs in spotify)
        (data.body.items).forEach((track_obj) => {
          if (track_obj.track && track_obj.track.id) {
            popularity_sum += track_obj.track.popularity;
            valid_songs.push(track_obj.track.id);
          }
        });
        // now get audio features of valid songs (local songs not included)
        return spotifyApi.getAudioFeaturesForTracks(valid_songs);
      }).then(function (data) {
        // make sure data isn't equal to [null] 
        if (data.body.audio_features[0]) {
          audio_features.push(...data.body.audio_features);
        }
      }).catch(function (err) {
        console.error(err);
      });
      // if you've gotten the total number
    } while (offset < this.state.curr_playlist.tracks.total)
    
    this.setState({
      audio_features: audio_features,
      popularity: (popularity_sum / audio_features.length),
      data_loaded: true
    });
  }

  /*
   * For modal close button.
   */
  handleOk = e => {
    this.setState({
      visible: false,
      data_loaded: false
    });
  };

  /*
   * For modal 'X' button.
   */
  handleCancel = e => {
    this.setState({
      visible: false,
      data_loaded: false
    });
  };

  /*
   * Functionality for download button. Will download nutrition label with white background.
   */
  async handlePNGDownload() {
    // remove background of playlist album art first
    document.getElementsByClassName('modal-background')[0].style.display = "none";
    await domtoimage.toBlob(document.getElementsByClassName('parent-div')[0], {bgcolor: "white"})
    .then(function (blob) {
        saveAs(blob, 'mu-nutrifact-label.png');
    });
    // revert to original
    document.getElementsByClassName('modal-background')[0].style.display = "block";
  }

  /*
   * Download PNG with album cover background (as seen). Not in use.
   */
  /*
  handleBGDownload = e => {
    e.preventDefault();
    const node = document.getElementsByClassName('parent-div')[0];

    domtoimage.toBlob(node, {bgcolor: "white"})
    .then(function (blob) {
        saveAs(blob, 'mu-nutrifact-label.png');
    });
  }*/

  render() {
    // group playlists array into four items per row
    const size = 4;
    var split_playlist = [...this.state.playlists];
    const res = split_playlist.reduce((acc, curr, i) => {
      if ( !(i % size)  ) {   
        // push chunk of original array to accumulator
        acc.push(split_playlist.slice(i, i + size));
      }
      return acc;
    }, []);   

    const logout_loc = window.location.href.includes('localhost') ? process.env.REACT_APP_LOCAL_LOGOUT_URI : process.env.REACT_APP_LOGOUT_URI;
    return (
      <div className="main">
        <Button className="logout-bttn" shape="round" style={{float: "right"}} href={logout_loc}>log out</Button>
        <Typography.Text className="instruction">choose a playlist to see its nutritional value.</Typography.Text>
        {
          res.map((row_data, i) => {
            return (
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} key={"r" + i}>
                {row_data.map((col_data, j) => {
                  return (
                    <Col xs={12} s={12} md={6} lg={6} key={"c" + j}>
                      <div className="playlist">
                        <LazyLoad once>
                          <Image preview={false} src={col_data.images[0].url} onClick={() => this.showModal(col_data)}/>
                        </LazyLoad>
                        <Typography.Text className="playlist-name">{col_data.name}</Typography.Text>
                      </div>
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
            <Button key="1" icon={<DownloadOutlined />} onClick={this.handlePNGDownload}>White Background</Button>,
            <Button key="2" type="primary" onClick={this.handleOk}>Close</Button>
          ]}
        >     
        {
          (this.state.data_loaded) 
          ? (<Label id="label" playlist={this.state.curr_playlist} audio_features={this.state.audio_features} 
          popularity={this.state.popularity} spotifyApi={this.props}/>)
          : (<Skeleton active />)
        }     
        </Modal>
      </div>
    );    
  }
}

export default Gallery;