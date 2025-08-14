import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AdPlaceholder from '../components/AdPlaceholder';

export default function Contact() {
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
              Contact That Labubu Life
            </h1>
            <p className="lead mb-2">
              Have a question, tip, or partnership idea? Send a note and we'll get back within 1–2 business days.
            </p>
            <p className="lead fw-bold">info@thatlabubulife.com</p>
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
