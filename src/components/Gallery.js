import React from 'react';
import Label from './Label.js';
import domtoimage from 'dom-to-image-chrome-fix-retina';
import { Button, Image, Row, Col, Typography, Modal, Skeleton } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';
import LazyLoad from 'react-lazyload';
import './Gallery.css';

class Gallery extends React.Component { 

  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      currPlaylist: null,
      audioFeatures: [],
      visible: false,
      data_loaded: false,
    };
  }

  async componentDidMount() {
    const { spotifyApi } = this.props;

    var userId = null;
    spotifyApi.getMe()
    .then(function(data) {
      userId = data.body.id;
    }, function(err) {
      console.log('Something went wrong!', err);
    });
 
    var playlists = [];
    var offset = 0
    var numRetrieved = 0;
    const max = 50;
    // spotify api only retrieves up to 50 playlists at a time, must loop if user has > 50 playlists
    do {
      await spotifyApi.getUserPlaylists({user_id: userId, limit: max, offset: offset}).then(function(data) {
        return data.body;
      // eslint-disable-next-line no-loop-func
      }).then((data) => {
        playlists = [...playlists, ...data.items];
        offset += data.items.length;
        numRetrieved = data.items.length;
        return playlists;
      }).catch(function (err) {
        console.error(err);
      });
    } while (numRetrieved === max)

    this.setState({
      playlists: playlists,
      currPlaylist: null
    });
  }

  // for modal visiblity
  state = { visible: false };

  /*
   * Modal was clicked, so must get playlist track info (audio features + popularity) to fill out
   * nutrition label.
   */
  async showModal (playlist, idx) {
    const { spotifyApi } = this.props;

    var getPlaylist = spotifyApi.getPlaylist(playlist.id)
    .then(function(data) {
      return data.body;
    }, function(err) {
      console.log('Something went wrong!', err);
    });

    getPlaylist.then((data) => {
      this.setState({
        visible: true,
        currPlaylist: data
      }, this.calcPlaylistAudioFeatures);
    });
  };

  async calcPlaylistAudioFeatures() {
    const { spotifyApi } = this.props;
    const limit = 100;
    var offset = 0;
    var audioFeatures = [];
    var popularitySum = 0;

    // spotify api gets 100 songs/audio features at once, must loop to get all
    do {
      await spotifyApi.getPlaylistTracks(this.state.currPlaylist.id, {
        offset: offset,
        limit: limit,
        fields: 'items.track'
      // eslint-disable-next-line no-loop-func
      }).then(function(data) {
        // first get as many tracks as possible (max=limit=100) at once
        offset += data.body.items.length;
        var validSongs = [];
        // get list of valid track ids (i.e. aren't local songs in spotify)
        (data.body.items).forEach((trackObj) => {
          if (trackObj.track && trackObj.track.id) {
            popularitySum += trackObj.track.popularity;
            validSongs.push(trackObj.track.id);
          }
        });
        // now get audio features of valid songs (local songs not included)
        return spotifyApi.getAudioFeaturesForTracks(validSongs);
      }).then(function (data) {
        // make sure data isn't equal to [null] 
        if (data.body.audio_features[0]) {
          audioFeatures.push(...data.body.audio_features);
        }
      }).catch(function (err) {
        console.error(err);
      });
      // if you've gotten the total number
    } while (offset < this.state.currPlaylist.tracks.total)
    
    this.setState({
      audioFeatures: audioFeatures,
      popularity: (popularitySum / audioFeatures.length),
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
    document.getElementsByClassName('modal-background')[0].style.display = 'none';
    await domtoimage.toBlob(document.getElementsByClassName('parent-div')[0], {bgcolor: 'white'})
    .then(function (blob) {
        saveAs(blob, 'mutrition-label.png');
    });
    // revert to original
    document.getElementsByClassName('modal-background')[0].style.display = 'block';
  }

  render() {
    // group playlists array into four items per row
    const size = 4;
    var splitPlaylist = [...this.state.playlists];
    const res = splitPlaylist.reduce((acc, curr, i) => {
      if (!(i % size)) {   
        // push chunk of original array to accumulator
        acc.push(splitPlaylist.slice(i, i + size));
      }
      return acc;
    }, []);   

    const logout_loc = window.location.href.includes('localhost') ? process.env.REACT_APP_LOCAL_LOGOUT_URI : process.env.REACT_APP_LOGOUT_URI;
    return (
      <div className="main">
        <Button className="logout-bttn" shape="round" href={logout_loc}>log out</Button>
        <Typography.Text className="instruction">choose a playlist to see its nutritional value.</Typography.Text>
        {
          res.map((row_data, i) => {
            return (
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} key={"r" + i}>
                {row_data.map((colData, j) => {
                  return (
                    <Col xs={12} s={12} md={6} lg={6} key={"c" + j}>
                      <div className="playlist">
                        <LazyLoad once>
                          <Image preview={false} src={colData.images[0].url} onClick={() => this.showModal(colData)}/>
                        </LazyLoad>
                        <Typography.Text className="playlist-name">{colData.name}</Typography.Text>
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
          ? (<Label id="label" playlist={this.state.currPlaylist} audioFeatures={this.state.audioFeatures} 
          popularity={this.state.popularity} spotifyApi={this.props}/>)
          : (<Skeleton active />)
        }     
        </Modal>
      </div>
    );    
  }
}

export default Gallery;