import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AdPlaceholder from '../components/AdPlaceholder';
import CertifiedLabubuComponent from '../components/CertifiedLabubu';

export default function CertifiedLabubu() {
  return (
    <Container style={{ maxWidth: '1400px' }}>
      {/* Top Banner Ad */}
      <div className="d-flex justify-content-center mb-4">
        <AdPlaceholder format="banner" />
      </div>

      <Row className="g-4">
        <Col lg={9}>
          <CertifiedLabubuComponent />
          
          {/* Middle Banner Ad */}
          <div className="d-flex justify-content-center my-5">
            <AdPlaceholder format="banner" />
          </div>
        </Col>

        <Col lg={3} className="mt-5">
          <div className="sticky-top" style={{ top: 'var(--header-offset)' }}>
            <AdPlaceholder format="sidebar" />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
