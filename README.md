# volt-trust-website / Print-on-Demand Pipeline

Dieses Repository enthält die **Volt Trust Website** sowie eine vollständige **Print-on-Demand-Pipeline** für Etsy, Amazon Merch on Demand und KDP.

---

## POD-Pipeline: Ordnerstruktur

```
/designs/           → Originale ablegen (werden NIE überschrieben)
/processed/         → Druckfertige Exportvarianten je Design
/mockups/           → Vorschaubilder für Listings
/listings/<name>/   → etsy.md · amazon.md · redbubble.md je Design
tracking.csv        → Statusübersicht aller Designs
```

## Workflow

1. **Design ablegen**: Original-PNG/SVG/PDF in `/designs/` kopieren.
2. **Pipeline starten**: Claude analysiert das Design und durchläuft alle Schritte automatisch.
3. **Ergebnis prüfen**: Druckdateien in `/processed/`, Texte in `/listings/<design>/`.
4. **Hochladen**: Listing-Texte direkt in die Plattform kopieren, Druckdateien aus `/processed/` hochladen.
5. **Status pflegen**: `tracking.csv` wird automatisch aktualisiert.

---

## Plattform-Specs (geprüft Juni 2026)

### Amazon Merch on Demand
| Produkt | Maße | DPI | Format | Max. Größe |
|---------|------|-----|--------|------------|
| T-Shirt | 4500×5400 px | 300 | PNG, transparent, RGB | 25 MB |
| Hoodie | 4500×5400 px | 300 | PNG, transparent, RGB | 25 MB |
| Tote Bag | 4500×4500 px | 300 | PNG, transparent, RGB | 25 MB |

### Etsy (via Printful / Printify)
| Produkt | Maße | DPI | Format |
|---------|------|-----|--------|
| Poster 18×24" | 5400×7200 px | 300 | PNG / PDF |
| Poster 24×36" | 7200×10800 px | 300 | PNG / PDF |
| T-Shirt | 4500×5400 px | 300 | PNG |

### KDP – Notizbuch / Tagebuch
- Innenseiten: 6×9" → 1800×2700 px bei 300 DPI
- Cover-Breite: `(6" + Rücken + 0,13" Leerseite) × 300 DPI` + je 0,125" Anschnitt rundum
- Rücken: `0,002252" × Seitenzahl` (bei Standard-Weißpapier 60#)

---

## Preislogik (Richtwerte)

| Produkt | Produktionskosten (ca.) | Empf. VK | Royalty/Marge |
|---------|------------------------|----------|---------------|
| Merch T-Shirt | ~$8–9 (trägt Amazon) | $19.99–24.99 | ~$2–5 |
| Etsy Poster (Printful) | ~€4–8 | €15–25 | ~€7–17 |
| KDP Notizbuch | $0–2 | $6.99–9.99 | ~$2–4 |

> Alle Zahlen sind Richtwerte. Aktuelle Gebühren und Royalties immer direkt auf der Plattform prüfen.

---

## Markenrecht & Content-Richtlinien – Checkliste

- [ ] Keine eingetragenen Marken in Bild, Titel, Tags oder Bullets
- [ ] Keine Promi-Namen, Figuren, Logos, Vereins-/Sportmarken
- [ ] Kein "Inspired by …"-Wording im Listing
- [ ] Keine anstößigen, politisch polarisierenden oder gewalthaltigen Motive
- [ ] KDP: Kein Plagiat von Stichwörtern in Titel/Untertitel, Autor ≠ bekannte Marke

---

*Pipeline betrieben mit Claude Code.*
