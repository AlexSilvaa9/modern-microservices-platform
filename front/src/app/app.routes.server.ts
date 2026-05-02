import { RenderMode, ServerRoute, ServerRoutePrerender } from '@angular/ssr';
import { routes } from './app.routes';
import { Route } from '@angular/router';

function collectLangPaths(routesArr: Route[]): string[] {
  const langRoutes = routesArr.filter(
    r => typeof r.path === 'string' && /^[a-z]{2}$/.test(r.path),
  );
  if (!langRoutes.length) return [];

  const paths: string[] = [];

  function traverse(children: Route[] | undefined, prefix: string) {
    if (!children) return;
    for (const c of children) {
      const p = c.path ?? '';
      const full = prefix + (p === '' ? '' : `/${p}`);
      paths.push(full);
      if (c.children) traverse(c.children, full);
    }
  }

  for (const lr of langRoutes) {
    const lang = lr.path as string;
    paths.push(lang);
    traverse(lr.children, lang);
  }

  return Array.from(new Set(paths)).map(p => p.replace(/^\//, ''));
}

const esPaths = collectLangPaths(routes as Route[]);

const prerenderRoutes: ServerRoutePrerender[] = esPaths.map(
  p => ({ path: p, renderMode: RenderMode.Prerender } as ServerRoutePrerender),
);

export const serverRoutes: ServerRoute[] = [
  // prerender only routes that start with `es` and are defined in the normal router
  ...prerenderRoutes,

  // everything else: client-side SPA
  { path: '**', renderMode: RenderMode.Client }
];