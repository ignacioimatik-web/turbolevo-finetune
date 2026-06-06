# TurboLevo Finetune — Catálogo e-MTB

Aplicación catálogo de bicicletas eléctricas de enduro con recomendador determinista, comparador, garaje personal y calculadora de setup de suspensión.

**Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router 7  
**Despliegue:** Vercel → `turbolevo-finetune-2026.vercel.app`

---

## Funcionalidades

- **Catálogo** — 12 e-MTB con filtros por marca, motor, uso, precio, recorrido, batería, peso y par
- **Ficha detalle** — Especificaciones, geometría, autonomía por modo, setup base
- **Comparador** — Hasta 4 modelos lado a lado
- **Garaje** — Colección personal guardada en localStorage
- **Setup** — Presión de suspensión, sag, rebote y compresión para cada modelo
- **Recomendación** — Motor determinista con 8 factores ponderados (terreno, estilo, presupuesto, autonomía, peso)
- **Rutas** — Contextos de terreno con consejos de configuración
- **Terrains** — Guías por tipo de terreno (rocoso, senderos, subidas, bajadas, barro, seco)

---

## Imágenes

### Política de uso

Las imágenes de bicicletas en este proyecto se utilizan **exclusivamente como referencia visual y con fines de catálogo**. Este es un proyecto de demostración/portfolio. **No está autorizado para uso comercial ni despliegue público sin verificar las licencias de cada imagen.**

### Procedencia

| Marca | Modelo | Fuente | Tipo de fuente | Coincidencia |
|-------|--------|--------|---------------|-------------|
| Canyon | Strive:ON CFR | [Canyon Media Centre](https://media-centre.canyon.com) | Press kit oficial | exact |
| Cannondale | Moterra SL 1 | [Cannondale Widen DAM](https://embed.widencdn.net) | Gestor activos oficial | same-family (SL 2) |
| Giant | Reign E+ 1 | [Giant CDN](https://images2.giant-bicycles.com) | CDN oficial | exact |
| Mondraker | Crafty XR | [Mondraker CDN](https://cdn.mondraker.com) | CDN oficial | exact |
| Santa Cruz | Heckler 3 XO | [santacruzbicycles.com](https://www.santacruzbicycles.com) | Tienda oficial | exact |
| Focus | Jam² 9.9 | [focus-bikes.com](https://www.focus-bikes.com) | CDN oficial (catálogo) | same-family (6.9) |
| Orbea | Wild M-LTD | Dales Cycles (retailer) | Retailer — **no oficial** | exact |
| Specialized | Turbo Levo Pro | sefiles.net (retailer CDN) | Retailer — **no oficial** | same-family |
| Trek | Rail 9.9 XTR | sefiles.net (retailer CDN) | Retailer — **no oficial** | exact |
| Commencal | Meta Power TR Race | VitalMTB (review) | Tercero — **no oficial** | same-family |
| Cube | Stereo Hybrid 160 HPC | Cube Store Brilon (retailer) | Retailer — **no oficial** | same-family |
| YT Industries | Decoy Core 4 | Upway (retailer) | Retailer — **no oficial** | exact |

**Leyenda:**
- **exact** — La imagen corresponde exactamente al modelo anunciado
- **same-family** — La imagen es del mismo cuadro/familia pero distinto trim o año

### Imágenes pendientes de migrar a fuentes oficiales

Las siguientes imágenes provienen de fuentes no oficiales (retailers, terceros) y deberían reemplazarse por imágenes de press kit o CDN oficial del fabricante para uso en producción:

1. **Specialized Turbo Levo Pro** → Buscar en specialized.com o media centre
2. **Trek Rail 9.9 XTR** → Buscar en trekbikes.com o media centre
3. **Orbea Wild M-LTD** → Buscar en orbea.com
4. **Commencal Meta Power TR Race** → Buscar en commencal.com (crítico: fuente actual es foto de fotógrafo)
5. **Cube Stereo Hybrid 160 HPC SLX** → Buscar en cube.eu
6. **YT Decoy Core 4** → Buscar en yt-industries.com (el CDN oficial `cdn-prod.yt-industries.com` es viable)

---

## Desarrollo

```bash
npm install
npm run dev       # desarrollo
npm run build     # producción
npx tsc -b        # typecheck
```

## Despliegue

```bash
vercel --prod
```

## Licencia

Código: MIT  
Imágenes: Cada imagen pertenece a su respectivo fabricante. Ver README > Imágenes > Política de uso.
