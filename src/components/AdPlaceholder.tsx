import React from 'react';
import { Card } from 'react-bootstrap';

interface AdPlaceholderProps {
  format: 'banner' | 'sidebar';
  className?: string;
}

export default function AdPlaceholder({ format, className }: AdPlaceholderProps) {
  const dimensions = format === 'banner' 
    ? { width: '728px', height: '90px', maxWidth: '100%' }
    : { width: '300px', height: '600px' };

  return (
    <Card 
      className={`ad-container ${format} ${className || ''} d-flex align-items-center justify-content-center overflow-hidden small text-muted`}
      style={{
        ...dimensions,
        background: 'linear-gradient(135deg, rgba(255, 107, 156, 0.05), rgba(108, 223, 255, 0.05))',
        border: '1px dashed var(--bs-border-color)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <Card.Body className="p-0 text-center">
        {format === 'banner' ? '728 × 90 Ad Space' : '300 × 600 Ad Space'}
      </Card.Body>
    </Card>
  );
}
