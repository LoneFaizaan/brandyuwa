import React from 'react';
import { SearchX } from 'lucide-react';
import { Link } from '../../lib/router';
import { usePageTitle } from '../../lib/hooks';
import { EmptyState } from '../../components/common/EmptyState';

export const NotFoundView: React.FC<{ title?: string; description?: string }> = ({
  title = 'Page not found',
  description = "The page you're looking for doesn't exist or has moved.",
}) => {
  usePageTitle(title);
  return (
    <div className="page animate-fade-in py-10">
      <EmptyState
        icon={<SearchX size={26} />}
        title={title}
        description={description}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn btn-primary">
              Browse products
            </Link>
            <Link to="/" className="btn btn-secondary">
              Go home
            </Link>
          </div>
        }
      />
    </div>
  );
};
