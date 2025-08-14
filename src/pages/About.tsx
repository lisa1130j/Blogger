import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AdPlaceholder from '../components/AdPlaceholder';

export default function About() {
  return (
    <Container style={{ maxWidth: '1400px' }}>
      {/* Top Banner Ad */}
      <div className="d-flex justify-content-center mb-4">
        <AdPlaceholder format="banner" />
      </div>

      <Row className="g-4">
        <Col lg={9}>
          {/* Hero Section */}
          <div className="mb-4">
            <h1 
              className="display-4 fw-bold"
              style={{
                background: "linear-gradient(135deg, var(--bs-primary), var(--bs-info), var(--bs-secondary))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              About That Labubu Life
            </h1>
            <p className="lead">
              <strong>That Labubu Life</strong> is your source for Labubu news, tips, and collecting guidance. From spotting authentic pieces to staying up-to-date on the latest releases, we help collectors enjoy and protect their Labubu treasures.
            </p>
          </div>

          {/* Middle Banner Ad */}
          <div className="d-flex justify-content-center my-4">
            <AdPlaceholder format="banner" />
          </div>
        </Col>

        <Col lg={3} className="mt-5">
          <div className="sticky-top" style={{ top: '6rem' }}>
            <AdPlaceholder format="sidebar" />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
