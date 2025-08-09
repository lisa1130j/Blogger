export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  inStock: boolean
  releaseDate?: string
  series?: string
}

export type ProductCategory = 'blind-box' | 'plush' | 'figure' | 'limited-edition'

export const products: Product[] = [
  {
    id: '1',
    name: 'Labubu Blind Box Series 3',
    description: 'Collect all 12 adorable Labubu characters from Series 3, including one secret rare design! Each box contains one random figure.',
    price: 14.99,
    imageUrl: 'https://placehold.co/400x400/FFE6EE/FF6B9C?text=Labubu+Blind+Box',
    category: 'blind-box',
    inStock: true,
    series: 'Series 3'
  },
  {
    id: '2',
    name: 'Labubu Plush Toy - Pink',
    description: 'Super soft and huggable Labubu plush toy in signature pink color. Perfect for cuddling!',
    price: 29.99,
    imageUrl: 'https://placehold.co/400x400/FFE6EE/FF6B9C?text=Labubu+Plush',
    category: 'plush',
    inStock: true
  },
  {
    id: '3',
    name: 'Labubu Art Figure - Starry Night',
    description: 'Limited edition Labubu art figure inspired by Van Gogh\'s Starry Night. A perfect blend of cute and artistic!',
    price: 89.99,
    imageUrl: 'https://placehold.co/400x400/FFE6EE/FF6B9C?text=Labubu+Art+Figure',
    category: 'limited-edition',
    inStock: true,
    releaseDate: '2025-08'
  },
  {
    id: '4',
    name: 'Labubu Classic Figure',
    description: 'The original Labubu figure that started it all. A must-have for any collector!',
    price: 49.99,
    imageUrl: 'https://placehold.co/400x400/FFE6EE/FF6B9C?text=Labubu+Classic',
    category: 'figure',
    inStock: false
  },
  {
    id: '5',
    name: 'Labubu Blind Box Series 2',
    description: 'Series 2 of the popular Labubu blind box collection featuring 8 unique designs.',
    price: 14.99,
    imageUrl: 'https://placehold.co/400x400/FFE6EE/FF6B9C?text=Labubu+Blind+Box+2',
    category: 'blind-box',
    inStock: true,
    series: 'Series 2'
  },
  {
    id: '6',
    name: 'Labubu Holiday Special Edition',
    description: 'Festive Labubu figure dressed in holiday attire. Perfect for the holiday season!',
    price: 59.99,
    imageUrl: 'https://placehold.co/400x400/FFE6EE/FF6B9C?text=Labubu+Holiday',
    category: 'limited-edition',
    inStock: true,
    releaseDate: '2025-12'
  }
]
