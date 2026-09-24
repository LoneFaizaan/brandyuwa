import React from 'react';
import { Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Link } from '../../lib/router';
import { usePageTitle } from '../../lib/hooks';
import { EmptyState } from '../../components/common/EmptyState';
import { PRODUCT_GRID, ProductCard } from '../../components/storefront/ProductCard';

export const SavedView: React.FC = () => {
  usePageTitle('Saved items');
  const { saved, liveProducts } = useStore();
  const items = saved.map((id) => liveProducts.find((p) => p.id === id)).filter((p) => p !== undefined).reverse();

  return (
    <div className="page animate-fade-in py-5 md:py-8">
      <h1 className="text-2xl font-bold tracking-tight">
        Saved items {items.length > 0 && <span className="font-medium text-muted">({items.length})</span>}
      </h1>

      {items.length === 0 ? (
        <EmptyState
          icon={<Heart size={26} />}
          title="Nothing saved yet"
          description="Tap the heart on any product to keep it here for later."
          action={
            <Link to="/shop" className="btn btn-primary">
              Browse products
            </Link>
          }
        />
      ) : (
        <div className={`mt-5 ${PRODUCT_GRID}`}>
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
