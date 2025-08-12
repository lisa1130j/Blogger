import React from 'react';
import LabubuAuthenticityGuide from '../components/LabubuAuthenticityGuide';

const AuthenticityVerification: React.FC = () => {
  return (
    <div className="container mx-auto px-4 max-w-[1400px]">
      <LabubuAuthenticityGuide accent="emerald" /> 
    </div>
  );
};

export default AuthenticityVerification;
