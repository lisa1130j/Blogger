import { useState } from 'react'
import { products, ProductCategory } from '../types/Product'
import ProductCard from './ProductCard'
import { Filter } from 'lucide-react'

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all')

  const categories: { value: ProductCategory | 'all', label: string }[] = [
    { value: 'all', label: 'All Products' },
    { value: 'blind-box', label: 'Blind Box' },
    { value: 'plush', label: 'Plush Toys' },
    { value: 'figure', label: 'Figures' },
    { value: 'limited-edition', label: 'Limited Edition' }
  ]

  const filteredProducts = selectedCategory === 'all' 
    ? products
    : products.filter(product => product.category === selectedCategory)

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Labubu Products</h1>
        <p>Discover our adorable collection of Labubu toys and collectibles</p>
      </div>

      <div className="products-filter">
        <div className="filter-header">
          <Filter size={20} />
          <span>Filter by Category</span>
        </div>
        <div className="filter-options">
          {categories.map(category => (
            <button
              key={category.value}
              className={`filter-btn ${selectedCategory === category.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try selecting a different category</p>
        </div>
      )}
    </div>
  )
}

export default Products
