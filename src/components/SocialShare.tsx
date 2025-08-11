import React, { useState } from 'react'
import { Heart, Share2, Copy, Twitter, Facebook, Instagram } from 'lucide-react'

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
        // Since Instagram doesn't have a direct share URL, we'll open Instagram's home page
        shareLink = 'https://www.instagram.com'
        break
      case 'copy':
        try {
          await navigator.clipboard.writeText(url)
          setShowCopySuccess(true)
          setTimeout(() => setShowCopySuccess(false), 2000)
          return
        } catch (err) {
          console.error('Failed to copy:', err)
        }
        break
    }

    if (shareLink) {
      window.open(shareLink, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="social-share">
      <button 
        className={`like-button ${isLiked ? 'liked' : ''}`}
        onClick={onLike}
        aria-label="Like post"
      >
        <Heart className="heart-icon" />
        <span className="like-count">{likes}</span>
      </button>

      <div className="share-buttons">
        <button
          className="share-button"
          onClick={() => handleShare('twitter')}
          aria-label="Share on Twitter"
        >
          <Twitter size={20} />
        </button>
        <button
          className="share-button"
          onClick={() => handleShare('facebook')}
          aria-label="Share on Facebook"
        >
          <Facebook size={20} />
        </button>
          <button
            className="share-button"
            onClick={() => handleShare('instagram')}
            aria-label="Share on Instagram"
          >
            <Instagram size={20} />
          </button>
        <button
          className="share-button"
          onClick={() => handleShare('copy')}
          aria-label="Copy link"
        >
          {showCopySuccess ? (
            <span className="copy-success">Copied!</span>
          ) : (
            <Copy size={20} />
          )}
        </button>
      </div>
    </div>
  )
}

export default SocialShare
