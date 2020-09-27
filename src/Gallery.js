import React from 'react';
import { Button, Image, Row, Col, Typography, Modal } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import './Gallery.css';
import Label from './Label.js';
import domtoimage from 'dom-to-image-chrome-fix-retina';
import { saveAs } from 'file-saver';

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
    const { spotifyApi } = this.props;
    var get_playlist = spotifyApi.getPlaylist(playlist.id)
    .then(function(data) {
      console.log('Some information about this playlist', data.body);
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

    await getAudioFeatures.then((data) => {
      this.setState({
        audio_features: data.audio_features
      });
    });

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

  handlePNGDownload = e => {
    e.preventDefault();
    domtoimage.toBlob(document.getElementsByClassName('label')[0], {bgcolor: "gray"})
    .then(function (blob) {
        saveAs(blob, 'mu-nutrifact-label.png');
    });
  }

  handleBGDownload = e => {
    e.preventDefault();
    const node = document.getElementsByClassName('parent-div')[0];

    domtoimage.toBlob(node, {bgcolor: "white"})
    .then(function (blob) {
        saveAs(blob, 'mu-nutrifact-label.png');
    });
  }

  render() {
    // four items per row
    const size = 4;
    var split_playlist = [...this.state.playlists];
    const res = split_playlist.reduce((acc, curr, i) => {
      if ( !(i % size)  ) {   
        // push chunk of original array to accumulator
        acc.push(split_playlist.slice(i, i + size));
      }
      return acc;
    }, []);   

    const logout_loc = window.location.href.includes('localhost') ? 'http://localhost:8888/logout' : 'https://music-nutrifacts-server.herokuapp.com/logout';


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
                          <Image preview={false} src={col_data.images[0].url} onClick={() => this.showModal(col_data)}/>
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
            <Button key="1" icon={<DownloadOutlined />} onClick={this.handlePNGDownload}>Transparent</Button>,
            <Button key="1" icon={<DownloadOutlined />} onClick={this.handleBGDownload}>As Seen</Button>,
            <Button key="2" type="primary" onClick={this.handleOk}>Close</Button>
          ]}
        >          
          <Label id="label" playlist={this.state.curr_playlist} audio_features={this.state.audio_features} spotifyApi={this.props}/>
        </Modal>
      </div>
    );    
  }
}

export default Gallery;