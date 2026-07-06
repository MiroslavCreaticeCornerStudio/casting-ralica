# Image Manifest — Home2U „Стани звезда"

All assets downloaded from Figma (`zC2fj9ygaCKgnemwpd4Bln`) to `public/assets/images/`. Served at `/assets/images/<file>`. **39 of 39 downloaded OK · 0 failed.** Content-type verified per file.

> **Optimization pass**: the heavy raster backgrounds/photos were resized to their real display sizes and converted to **WebP** (hero/cta/teammate/lookfor/info/footer-deco), cutting the image payload from **~22.7 MB → ~0.3 MB** with no visible quality loss. A 1200×630 `og-image.jpg` (61 KB) was generated for social sharing. The original heavy `.png`/`.jpg` source files were removed; the table below documents the original Figma exports.

## ⚠️ Notes / flags

- **`info-image.png` exported BLANK from Figma** (4KB, near-empty transparent raster — the real "stack of documents" photo did not render). **Fallback used**: I re-rendered the composite node `2454:8708` via `get_screenshot` → **`info-document.png`** (530KB), which the Info section uses. It includes the papers + red "?" card + "Одобрен кандидат" label baked in. **Action for you**: if you have the real layered photo, drop it in and swap the `<img src>` in `src/components/InfoSection.astro`.
- **`hero-logo-by.png`** — the Figma export was **fully transparent/blank** (the "по NOVA" channel logo never rendered, same failure class as `info-image`). **Fixed**: re-rendered the NOVA logo node from Figma and converted it to white-on-transparent so it shows on the dark hero.
- **Large background photos** (`cta-background.png` 8.4MB, `hero-background.png` 6.5MB, `teammate-video-overlay.png` 4.3MB) are full-resolution Figma exports. They work as-is but are heavy — recommend optimizing/compressing before production (see post-build note).

## Hero (`2454:8638`)
| File | Type | Size | Description |
|------|------|------|-------------|
| hero-background.png | PNG 4096-wide | 6.5MB | Dark photographic hero background |
| logo-icon.svg | SVG | 2.5KB | Home2U logo mark (navbar) |
| logo-text.svg | SVG | 3.4KB | Home2U wordmark (navbar) |
| hero-logo-by.png | PNG (transp) | 1.2KB | White Home2U wordmark for "по Home2U" on dark hero |
| hero-line.svg | SVG | 285B | Decorative short line beside "по Home2U" |

## Section Tabs (`2454:8683`)
| File | Type | Size | Description |
|------|------|------|-------------|
| tabs-divider.svg | SVG | 263B | Vertical divider between columns |
| tabs-icon-briefcase.svg | SVG | 2.3KB | Briefcase icon ("1 свободно място") |
| tabs-icon-user.svg | SVG | 1.6KB | User-circle icon ("Отворено за настоящи и бъдещи брокери") |

## Info / Challenge (`2454:8702`)
| File | Type | Size | Description |
|------|------|------|-------------|
| info-image.png | PNG (white graphic) | 4KB | White "document" graphic on red container |
| info-ellipses.svg | SVG | 34.6KB | Decorative dashed ellipses background |
| info-icon-arrow.svg | SVG | 1.9KB | Hand-drawn arrow over image |
| divider-line.svg | SVG | 282B | 40px accent line under heading |

## What You Get (`2454:8725`)
| File | Type | Size | Description |
|------|------|------|-------------|
| benefits-line.svg | SVG | 282B | 40px accent line |
| benefits-icon-1…6.svg | SVG | 1–2.8KB | 6 benefit icons (TrendUp, UserCircle, AddressBook, ChalkboardTeacher, TelevisionSimple, CheckSquare) |

## Teammate / Ралица (`2473:1009`)
| File | Type | Size | Description |
|------|------|------|-------------|
| teammate-video.jpg | JPEG 1880×1255 | 134KB | Video thumbnail (Ралица) |
| teammate-video-overlay.png | PNG | 4.3MB | Video frame overlay layer |
| teammate-bg.png | PNG | 828KB | Bottom background strip |
| teammate-ellipse.svg | SVG | 897B | Blur ellipse glow |
| teammate-line.svg | SVG | 282B | 40px accent line |
| teammate-logo-text.svg / teammate-logo-icon.svg | SVG | ~3KB | Home2U logo inline in heading |
| teammate-play.svg | SVG | 1.3KB | Play button on video |

## What We Look For (`2544:64`)
| File | Type | Size | Description |
|------|------|------|-------------|
| lookfor-image.jpg | JPEG 1200×1600 | 225KB | Person photo (right column) |
| lookfor-line.svg | SVG | 303B | 40px accent line |
| lookfor-icon-check.svg | SVG | 1KB | Check icon (reused on all 6 criteria) |
| lookfor-button-arrow.svg | SVG | 1.7KB | Arrow icon on CTA |

## CTA / Application (`2454:8841`)
| File | Type | Size | Description |
|------|------|------|-------------|
| cta-background.png | PNG 4096×1636 | 8.4MB | Full-bleed photographic background |

## Footer (`2454:8893`)
| File | Type | Size | Description |
|------|------|------|-------------|
| footer-logo-text.svg / footer-logo-icon.svg | SVG | ~3KB | Large Home2U logo |
| footer-deco-1.png / footer-deco-2.png | PNG | 750KB / 1.65MB | Decorative tile images in deco squares |
| footer-arrow.svg | SVG | 1.9KB | Hand-drawn arrow |
| footer-icon-phone.svg / footer-icon-email.svg | SVG | <1KB | Contact icons |
