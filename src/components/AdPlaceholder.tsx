import React from 'react';

interface AdPlaceholderProps {
  format: 'banner' | 'sidebar';
  className?: string;
}

export default function AdPlaceholder({ format, className }: AdPlaceholderProps) {
  const dimensions = format === 'banner' 
    ? { width: '728px', height: '90px', maxWidth: '100%' }
    : { width: '300px', height: '600px' };

  return (
    <div 
      className={`ad-container ${format} ${className || ''}`}
      style={{
        ...dimensions,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255, 107, 156, 0.05), rgba(108, 223, 255, 0.05))',
        border: '1px dashed var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
        transition: 'all var(--transition-normal)',
        color: 'var(--color-text-muted)',
        fontSize: 'var(--font-size-sm)',
      }}
    >
      {format === 'banner' ? '728 × 90 Ad Space' : '300 × 600 Ad Space'}
    </div>
  );
}
