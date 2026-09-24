import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

/**
 * Tiny hash router (#/shop?cat=Shirts). Hash URLs work on any static host
 * without server rewrites.
 */
interface Route {
  path: string;
  query: URLSearchParams;
}

interface RouterContextValue extends Route {
  navigate: (to: string, options?: { replace?: boolean }) => void;
  back: (fallback?: string) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function readHash(): Route {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [pathname, search = ''] = raw.split('?');
  const path = (pathname.startsWith('/') ? pathname : `/${pathname}`).replace(/\/+$/, '') || '/';
  return { path, query: new URLSearchParams(search) };
}

const toHash = (to: string) => `#${to.startsWith('/') ? to : `/${to}`}`;

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<Route>(readHash);
  const scrollPositions = useRef(new Map<string, number>());
  const pushedByApp = useRef(false);
  const inAppPushes = useRef(0);
  const pendingScroll = useRef<number | null>(null);

  useEffect(() => {
    const onHashChange = () => {
      const next = readHash();
      // Back/forward restores where you were; new pages start at the top.
      pendingScroll.current = pushedByApp.current ? 0 : scrollPositions.current.get(window.location.hash) ?? 0;
      pushedByApp.current = false;
      setRoute(next);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useLayoutEffect(() => {
    if (pendingScroll.current === null) return;
    const y = pendingScroll.current;
    pendingScroll.current = null;
    window.scrollTo(0, y);
    // Images may still be loading; try once more after layout settles.
    if (y > 0) requestAnimationFrame(() => window.scrollTo(0, y));
  }, [route]);

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    const hash = toHash(to);
    if (hash === window.location.hash) return;
    scrollPositions.current.set(window.location.hash, window.scrollY);
    pushedByApp.current = true;
    if (options?.replace) {
      const url = new URL(window.location.href);
      url.hash = hash;
      window.location.replace(url.toString());
    } else {
      inAppPushes.current++;
      window.location.hash = hash;
    }
  }, []);

  /** Go back inside the site, or to `fallback` if the visitor landed directly on this page. */
  const back = useCallback(
    (fallback = '/') => {
      if (inAppPushes.current > 0) {
        inAppPushes.current--;
        window.history.back();
      } else {
        navigate(fallback, { replace: true });
      }
    },
    [navigate],
  );

  const value = useMemo(() => ({ ...route, navigate, back }), [route, navigate, back]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used inside RouterProvider');
  return ctx;
}

/** matchPath('/product/:id', '/product/abc') → { id: 'abc' } */
export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const p = pattern.split('/').filter(Boolean);
  const a = path.split('/').filter(Boolean);
  if (p.length !== a.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(a[i]);
    else if (p[i] !== a[i]) return null;
  }
  return params;
}

interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({ to, replace, onClick, children, ...rest }) => {
  const { navigate } = useRouter();
  return (
    <a
      href={toHash(to)}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(to, { replace });
      }}
      {...rest}
    >
      {children}
    </a>
  );
};
