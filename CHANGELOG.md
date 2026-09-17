# Changelog

## [Unreleased]

### Changed

- **Authentication:** Made the session cookie protocol-aware so temporary HTTP IP login works while HTTPS remains Secure.
- **Homepage:** Renamed the header, ticker, and featured-carousel labels and moved the carousel label to the upper-left corner.
- **Ecran News Promo:** Increased the Instagram button's horizontal spacing for improved readability.
- **Ecran News Promo:** Fixed the button's desktop grid width and added responsive tablet/mobile sizing.
- **Ecran News Promo:** Reduced the desktop button width and padding to a more balanced size.
- **Footer:** Removed "اکران نیوز" reference from the site description in `site-footer.tsx`.
- **About Page:** Removed "اکران نیوز" reference from the editorial intro in `about/page.tsx`.
- **Site Settings:** Added database-backed footer and about-page copy editable from the admin panel.
- **Footer:** Simplified secondary content and hid category links on mobile while retaining them on desktop.
- **Categories:** Renamed the `screenings` display title from «نمایش» to «گزارش» across the site.
- **About Page:** Added dedicated layout spacing that is not overridden by the global reset.
