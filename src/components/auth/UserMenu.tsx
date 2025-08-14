import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Dropdown, Image } from 'react-bootstrap';

export function UserMenu() {
  const { user, profile, signOut } = useAuth();

  if (!user) return null;

  const avatarContent = profile?.avatar_url ? (
    <Image
      src={profile.avatar_url}
      alt="Profile"
      roundedCircle
      style={{ width: '32px', height: '32px', objectFit: 'cover' }}
    />
  ) : (
    <div 
      className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
      style={{ width: '32px', height: '32px' }}
    >
      <span className="small fw-medium">
        {profile?.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
      </span>
    </div>
  );

  return (
    <Dropdown align="end">
      <Dropdown.Toggle 
        variant="light" 
        id="user-menu-dropdown"
        className="d-flex align-items-center gap-2 border-0 bg-transparent"
      >
        {avatarContent}
        <span className="small fw-medium text-secondary">
          {profile?.username || user.email?.split('@')[0] || 'User'}
        </span>
      </Dropdown.Toggle>

      <Dropdown.Menu className="shadow">
        <div className="px-3 py-2 border-bottom">
          <p className="mb-0 small fw-medium">
            {profile?.username || user.email?.split('@')[0]}
          </p>
          <p className="mb-0 small text-muted">{user.email}</p>
        </div>
        <Dropdown.Item onClick={signOut}>Sign Out</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
