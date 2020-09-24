import React from 'react';
import logo from './logo.svg';
import './Label.css';
import './App.css';
import { List, Row, Col, Divider, Typography } from 'antd';
const { Title } = Typography;

function Label() {

  const data = [
    'Danceability',
    'Energy',
    'Loudness',
    'Valence',
    'Average Temp',
  ];

  return (
    <div className="label">
      <Title>Nutrition Facts</Title>
      <div className="playlist-gen-info">
        <p style={{fontSize: "medium"}}>nectar by annabelleshih</p>
        <div className="runtime">
          <span>Runtime</span>
          <span style={{float: "right"}}>4 hr 13 min</span>
        </div>
      </div>
      <div className="song-info">
        <span className="total-num-text">
          Total Number of <br /> 
          <span className="song-text">Songs</span>
        </span>
        <span className="num-song-text">70</span>
      </div>
      <div className="breakdown">
        <List
          dataSource={data}
          header={<div style={{fontWeight: "500", lineHeight: "3px", float: "right"}}>Average Value*</div>}
          renderItem={item => 
            <List.Item style={{lineHeight: "3px"}}>
              <span style={{fontWeight: "500", float: "left"}}>{item}</span>
              <span style={{float: "right"}}>{70}</span>
            </List.Item>}
        />
      </div>
      <div class="extra-info">
        <List>
          <List.Item style={{lineHeight: "3px"}}>
            <span style={{float: "left"}}>Followers</span>
            <span style={{float: "right"}}>0</span>
          </List.Item>
          <List.Item style={{lineHeight: "3px"}}>
            <span style={{float: "left"}}>Collaborative</span>
            <span style={{float: "right"}}>Y</span>
          </List.Item>
        </List>
      </div>
      <div className="footer-text">
        *Having friends over for dinner? Here's the perfect playlist. Loudness values are averaged across the entire track and are 
        useful for comparing relative loudness of tracks.
      </div>
    </div>
  );
}

/*
        *Danceability describes how suitable a track is for dancing based on tempo, beat strength, etc. Energy represents 
        a perceptual measure of intensity and activity. Loudness values are averaged across the entire track and are 
        useful for comparing relative loudness of tracks. Valence describing the musical positiveness conveyed by a track where a
        higher value represents a more positive track. Tempo is the speed or pace of a given piece (BPM).
*/

export default Label;
