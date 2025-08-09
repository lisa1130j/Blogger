import { Product } from '../types/Product'
import { Tag } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.imageUrl} alt={product.name} />
        {!product.inStock && <div className="out-of-stock">Out of Stock</div>}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-meta">
          <div className="product-category">
            <Tag size={14} />
            <span>{product.category}</span>
          </div>
          {product.series && (
            <div className="product-series">Series: {product.series}</div>
          )}
          {product.releaseDate && (
            <div className="product-release">Release: {product.releaseDate}</div>
          )}
        </div>
        <div className="product-footer">
          <div className="product-price">{formatPrice(product.price)}</div>
          <button 
            className={`btn ${product.inStock ? 'btn-primary' : 'btn-secondary'}`}
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
