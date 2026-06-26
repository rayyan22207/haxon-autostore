const upsert = (selector, attrs) => { let el = document.head.querySelector(selector); if (!el) { el = document.createElement(attrs.property || attrs.name ? 'meta' : 'link'); document.head.appendChild(el) } Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k, v || '')) }
export function useSeo(meta = {}) {
  const site = 'Haxon Autostore'
  const title = meta.title ? `${meta.title} | ${site}` : site
  document.title = title
  const description = meta.description || 'Premium automotive accessories, lighting, car care, multimedia upgrades, fitment support and catalogs by Haxon Autostore.'
  const url = meta.url || window.location.href
  const image = meta.image || `${window.location.origin}/image/haxon-logo.png`
  upsert('meta[name="description"]', { name: 'description', content: description })
  upsert('meta[property="og:title"]', { property: 'og:title', content: title })
  upsert('meta[property="og:description"]', { property: 'og:description', content: description })
  upsert('meta[property="og:image"]', { property: 'og:image', content: image })
  upsert('meta[property="og:url"]', { property: 'og:url', content: url })
  upsert('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
  upsert('link[rel="canonical"]', { rel: 'canonical', href: url })
  document.querySelectorAll('script[data-haxon-schema]').forEach((node) => node.remove())
  ;[meta.schema, { '@context':'https://schema.org', '@type':'Organization', name: site, url: window.location.origin, logo: `${window.location.origin}/image/haxon-logo.png` }].filter(Boolean).forEach((schema) => { const s=document.createElement('script'); s.type='application/ld+json'; s.dataset.haxonSchema='true'; s.textContent=JSON.stringify(schema); document.head.appendChild(s) })
}
