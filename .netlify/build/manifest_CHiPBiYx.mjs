import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import 'es-module-lexer';
import { n as NOOP_MIDDLEWARE_HEADER, o as decodeKey } from './chunks/astro/server_exSZKgt7.mjs';
import 'clsx';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/Bissck/Desktop/anisanar/Anisanar/","adapterName":"@astrojs/netlify","routes":[{"file":"404.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/book","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/book\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"book","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/book.ts","pathname":"/api/book","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://anisanar.com","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/Bissck/Desktop/anisanar/Anisanar/src/pages/404.astro",{"propagation":"none","containsHead":true}],["C:/Users/Bissck/Desktop/anisanar/Anisanar/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/Bissck/Desktop/anisanar/Anisanar/src/pages/servicios/[id].astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/api/book@_@ts":"pages/api/book.astro.mjs","\u0000@astro-page:src/pages/servicios/[id]@_@astro":"pages/servicios/_id_.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_CHiPBiYx.mjs","@components/react/ServiceCarousel":"_astro/ServiceCarousel.Cl97Sato.js","C:/Users/Bissck/Desktop/anisanar/Anisanar/src/components/react/MasonryGallery.jsx":"_astro/MasonryGallery.DqSxnJWa.js","@components/react/Marquee":"_astro/Marquee.Bw8ZOJy4.js","/astro/hoisted.js?q=0":"_astro/hoisted.BsQwG-Jn.js","/astro/hoisted.js?q=1":"_astro/hoisted.BgMcsfh1.js","@components/react/BlurText":"_astro/BlurText.D8EU6vF2.js","C:/Users/Bissck/Desktop/anisanar/Anisanar/src/components/react/VideoGallery.jsx":"_astro/VideoGallery.D6AvEui1.js","C:/Users/Bissck/Desktop/anisanar/Anisanar/src/components/react/TiltedCard.jsx":"_astro/TiltedCard.Dc2kL1Ul.js","@astrojs/react/client.js":"_astro/client.CVKrBgru.js","C:/Users/Bissck/Desktop/anisanar/Anisanar/src/components/react/ContactStepper":"_astro/ContactStepper.CUT7sx85.js","/astro/hoisted.js?q=2":"_astro/hoisted.BjAOt8pS.js","@components/react/CardNav.jsx":"_astro/CardNav.D7kTF7R6.js","C:/Users/Bissck/Desktop/anisanar/Anisanar/src/components/react/CardNav.jsx":"_astro/CardNav.BJUaL6P1.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/logo-anisanar.CNf_t5d3.png","/_astro/lexend-latin-ext-wght-normal.B6JQhE1e.woff2","/_astro/plus-jakarta-sans-latin-ext-wght-normal.DmpS2jIq.woff2","/_astro/lexend-vietnamese-wght-normal.RvljkFvg.woff2","/_astro/lexend-latin-wght-normal.ci0D1wrL.woff2","/_astro/plus-jakarta-sans-vietnamese-wght-normal.qRpaaN48.woff2","/_astro/plus-jakarta-sans-latin-ext-wght-italic.DJWiFoht.woff2","/_astro/plus-jakarta-sans-latin-wght-normal.eXO_dkmS.woff2","/_astro/plus-jakarta-sans-vietnamese-wght-italic.CPBsCcxN.woff2","/_astro/plus-jakarta-sans-latin-wght-italic.DnD1KgkH.woff2","/logo-anisanar.png","/og-image.jpg","/robots.txt","/site.webmanifest","/anisanar/about-cuidado-con-carino-400w.webp","/anisanar/about-cuidado-con-carino-560w.webp","/anisanar/about-cuidado-con-carino-800w.webp","/anisanar/gallery-bienvenida-entrada.webp","/anisanar/gallery-cachorros-doberman.webp","/anisanar/gallery-cachorros-recien-nacidos.webp","/anisanar/gallery-carino-cachorro.webp","/anisanar/gallery-cirugia-felina.webp","/anisanar/gallery-consulta-campo.webp","/anisanar/gallery-equipo-quirurgico.webp","/anisanar/gallery-equipo-reunion.webp","/anisanar/gallery-fachada-clinica.webp","/anisanar/gallery-farmacia.webp","/anisanar/gallery-fisioterapia-pelota.webp","/anisanar/gallery-golden-dormido.webp","/anisanar/gallery-mascota-feliz.webp","/anisanar/gallery-michi-gerente.webp","/anisanar/gallery-microcirugia-ocular.webp","/anisanar/gallery-monitoreo-anestesia.webp","/anisanar/gallery-mural-instalaciones.webp","/anisanar/gallery-tienda-accesorios.webp","/anisanar/hero-equipo-veterinario.jpg","/anisanar/servicio-cirugia.jpg","/anisanar/servicio-diagnostico-imagen.jpg","/anisanar/servicio-hospitalizacion.jpg","/anisanar/servicio-medicina-general.jpg","/anisanar/servicio-nutricion-clinica.jpg","/anisanar/servicio-rehabilitacion.jpg","/anisanar/servicio-vacunacion.jpg","/anisanar/video-bienvenida-equipo.mp4","/anisanar/video-consulta-veterinaria.mp4","/anisanar/video-entrada-clinica.mp4","/anisanar/video-instalaciones-anisanar.mp4","/anisanar/video-mascota-feliz.mp4","/anisanar/video-nuestros-servicios.mp4","/icons/icon-192.png","/icons/icon-512.png","/_astro/BlurText.D8EU6vF2.js","/_astro/CardNav.BJUaL6P1.js","/_astro/CardNav.D7kTF7R6.js","/_astro/client.CVKrBgru.js","/_astro/ContactStepper.CUT7sx85.js","/_astro/hoisted.BgMcsfh1.js","/_astro/hoisted.BjAOt8pS.js","/_astro/hoisted.BsQwG-Jn.js","/_astro/index.C3G1kOzI.js","/_astro/index.C8pce-KX.js","/_astro/index.DsLAZKOT.js","/_astro/index.faugSMe2.css","/_astro/index.mlrKrAns.js","/_astro/jsx-runtime.BjG_zV1W.js","/_astro/Marquee.Bw8ZOJy4.js","/_astro/MasonryGallery.DqSxnJWa.js","/_astro/proxy.Cg_olB9I.js","/_astro/ServiceCarousel.Cl97Sato.js","/_astro/stethoscope.CbBQlNu-.js","/_astro/TiltedCard.Dc2kL1Ul.js","/_astro/VideoGallery.D6AvEui1.js","/_astro/_id_.wabiO4cI.css","/team/carolina-martinez.webp","/404.html","/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"aThE6IEZdyc4tvw6fzh9ejjnLITF3XfRRMOHIM22kvQ=","experimentalEnvGetSecretEnabled":false});

export { manifest };
