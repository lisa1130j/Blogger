import React, { useState } from 'react'
import { Heart, Copy, Twitter, Facebook, Instagram } from 'lucide-react'
import { Button, ButtonGroup } from 'react-bootstrap'

interface SocialShareProps {
  title: string
  url: string
  onLike: () => void
  likes: number
  isLiked: boolean
}

const SocialShare: React.FC<SocialShareProps> = ({ title, url, onLike, likes, isLiked }) => {
  const [showCopySuccess, setShowCopySuccess] = useState(false)

  const handleShare = async (platform: string) => {
    const shareUrl = encodeURIComponent(url)
    const shareTitle = encodeURIComponent(title)

    let shareLink = ''
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`
        break
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
        break
      case 'instagram':
        shareLink = 'https://www.instagram.com'
        break
      case 'copy':
        try {
          await navigator.clipboard.writeText(url)
          setShowCopySuccess(true)
          setTimeout(() => setShowCopySuccess(false), 2000)
          return
        } catch {
          // no-op
        }
        break
    }
    if (shareLink) window.open(shareLink, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="social-share">
      {/* Use custom styled button so .like-button/.liked CSS applies */}
      <button
        type="button"
        aria-pressed={isLiked}
        aria-label={isLiked ? 'Unlike' : 'Like'}
        className={`like-button ${isLiked ? 'liked' : ''}`}
        onClick={onLike}
      >
        <Heart
          className="heart-icon"
          size={18}
          strokeWidth={2}
          fill={isLiked ? 'currentColor' : 'none'}
        />
        <span className="like-count">{likes}</span>
      </button>

      <ButtonGroup>
        <Button variant="outline-secondary" onClick={() => handleShare('twitter')} aria-label="Share on X/Twitter">
          <Twitter size={20} />
        </Button>
        <Button variant="outline-secondary" onClick={() => handleShare('facebook')} aria-label="Share on Facebook">
          <Facebook size={20} />
        </Button>
        <Button variant="outline-secondary" onClick={() => handleShare('instagram')} aria-label="Share on Instagram">
          <Instagram size={20} />
        </Button>
        <Button variant="outline-secondary" onClick={() => handleShare('copy')} aria-label="Copy link">
          {showCopySuccess ? <span className="text-success">Copied!</span> : <Copy size={20} />}
        </Button>
      </ButtonGroup>
    </div>
  )
}

export default SocialShare