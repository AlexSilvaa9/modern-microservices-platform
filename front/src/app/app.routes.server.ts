/** Prerendering: genera HTML estático para rutas de idioma (es, en, de, fr) */

import { RenderMode, ServerRoute, ServerRoutePrerender } from '@angular/ssr';
import { routes } from './app.routes';
import { Route } from '@angular/router';

/** Detecta rutas con path = exactamente 2 letras y extrae sus subrutas */
function collectLangPaths(routesArr: Route[]): string[] {
  const langRoutes = routesArr.filter(
    r => typeof r.path === 'string' && /^[a-z]{2}$/.test(r.path),
  );
  if (!langRoutes.length) return [];

  const paths: string[] = [];

  /** Recorre recursivamente children para construir paths completos */
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

/** Rutas de idioma: prerenderizdas | Otras rutas: renderizadas en cliente */
export const serverRoutes: ServerRoute[] = [
  ...prerenderRoutes,
  { path: '**', renderMode: RenderMode.Client }
];