import React from 'react';
import { Button, Image, List, Row, Col, Divider, Typography, Modal } from 'antd';
import './Gallery.css';
import Label from './Label.js';
import LazyLoad from 'react-lazyload';

const { Title } = Typography;


class Gallery extends React.Component { 

  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      curr_playlist: null,
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
    
    var get_playlists = spotifyApi.getUserPlaylists(user_id).then(function(data) {
      console.log('Retrieved playlists', data.body);
      return data.body;
    }).catch(function (err) {
      console.error(err);
    });

    get_playlists.then((data) => {
      this.setState({
        playlists: data.items,
        curr_playlist: null
      })
    });
  }

  state = { visible: false };

  showModal = (playlist, idx) => {
    this.setState({
      visible: true,
      curr_playlist: playlist,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
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
    console.log(res);
    
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
          <Label playlist={this.state.curr_playlist}/>
        </Modal>
      </div>
    );    
  }
}

export default Gallery;