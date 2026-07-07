import { useState } from 'react'
import type { Category, Product } from '../data/catalog'

// Art-directed fallback wash per vertical — used while a photo loads, or when none exists.
const TILE: Record<Category, string> = {
  restaurants: 'radial-gradient(120% 120% at 30% 20%, #E9EFE8 0%, #D8E3D6 55%, #C7D6C4 100%)',
  groceries: 'radial-gradient(120% 120% at 30% 20%, #FBF3E4 0%, #F1E4CC 55%, #E7D6B8 100%)',
  alcohol: 'radial-gradient(120% 120% at 30% 20%, #F4E3DF 0%, #E9CFC9 55%, #DDB9B2 100%)',
  medicine: 'radial-gradient(120% 120% at 30% 20%, #E6F0EC 0%, #D3E5DD 55%, #C0D8CD 100%)',
}

export function ProductImage({
  product,
  className = '',
  emojiSize = 'text-5xl',
}: {
  product: Product
  className?: string
  emojiSize?: string
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const showPhoto = product.image && !failed

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: TILE[product.category] }}
    >
      {/* Fallback / loading tile — always present underneath */}
      <div
        className={`absolute inset-0 grid place-items-center transition-opacity duration-500 ${
          showPhoto && loaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span className={`${emojiSize} drop-shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}>
          {product.emoji}
        </span>
      </div>

      {showPhoto && (
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`relative h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}
