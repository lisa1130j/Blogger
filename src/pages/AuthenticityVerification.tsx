import React from 'react';
import { Container } from 'react-bootstrap';
import LabubuAuthenticityGuide from '../components/LabubuAuthenticityGuide';
import AdPlaceholder from '../components/AdPlaceholder';

const AuthenticityVerification: React.FC = () => {
  return (
    <Container style={{ maxWidth: '1400px' }}>
      <LabubuAuthenticityGuide accent="emerald" />
      
      {/* Bottom Banner Ad */}
      <div className="d-flex justify-content-center my-5">
        <AdPlaceholder format="banner" />
      </div>
    </Container>
  );
};

export default AuthenticityVerification;
