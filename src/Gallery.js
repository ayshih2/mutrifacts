import React from 'react';
import { Image, List, Row, Col, Divider, Typography } from 'antd';
import './Gallery.css';
const { Title } = Typography;

function Gallery() {
  return (
    <div className="main">
      <Title>❥ choose a playlist to see its nutritional value.</Title>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={8}>
          <Image preview={false} style={{maxWidth: "300px"}} src="https://cdn.shopify.com/s/files/1/2282/8555/products/cokodive-bts-2nd-full-length-album-wings-3716964745296_880x.png?v=1528641470"/>
          <Title level={4} style={{fontStyle: "italic"}}>nectar</Title>
        </Col>
        <Col span={8}>
          <Image preview={false} src="https://upload.wikimedia.org/wikipedia/en/5/5c/BTS_-_Map_of_the_Soul_Persona.png"/>
          <Title level={4} style={{fontStyle: "italic"}}>cardigan</Title>
        </Col>
        <Col span={8}>
          <Image src="https://via.placeholder.com/300"/>
          <Title level={4} style={{fontStyle: "italic"}}>lmaooooooooooookdfjalkfjsldjfsldjfsldkfjsldkfjsldkfjlsdkjfldkj</Title>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={8}>
          <Image preview={false} style={{maxWidth: "300px"}} src="https://cdn.shopify.com/s/files/1/2282/8555/products/cokodive-bts-2nd-full-length-album-wings-3716964745296_880x.png?v=1528641470"/>
          <Title level={4} style={{fontStyle: "italic"}}>nectar</Title>
        </Col>
        <Col span={8}>
          <Image preview={false} src="https://upload.wikimedia.org/wikipedia/en/5/5c/BTS_-_Map_of_the_Soul_Persona.png"/>
          <Title level={4} style={{fontStyle: "italic"}}>cardigan</Title>
        </Col>
        <Col span={8}>
          <Image src="https://via.placeholder.com/300"/>
          <Title level={4} style={{fontStyle: "italic"}}>lmaoooooooooooo</Title>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={8}>
          <Image preview={false} style={{maxWidth: "300px"}} src="https://cdn.shopify.com/s/files/1/2282/8555/products/cokodive-bts-2nd-full-length-album-wings-3716964745296_880x.png?v=1528641470"/>
          <Title level={4} style={{fontStyle: "italic"}}>nectar</Title>
        </Col>
        <Col span={8}>
          <Image preview={false} src="https://upload.wikimedia.org/wikipedia/en/5/5c/BTS_-_Map_of_the_Soul_Persona.png"/>
          <Title level={4} style={{fontStyle: "italic"}}>cardigan</Title>
        </Col>
        <Col span={8}>
          <Image src="https://via.placeholder.com/300"/>
          <Title level={4} style={{fontStyle: "italic"}}>lmaoooooooooooo</Title>
        </Col>
      </Row>      
    </div>
  );
}
/*<Image preview={false} style={{maxWidth: "300"}} src="https://cdn.shopify.com/s/files/1/2282/8555/products/cokodive-bts-2nd-full-length-album-wings-3716964745296_880x.png?v=1528641470"/> */
export default Gallery;
