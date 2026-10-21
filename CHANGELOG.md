# Changelog

## [Unreleased]

### Added

- Ecran News apex HTTPS and permanent redirects to the canonical site, preserving paths and query strings. Versioned Nginx redirect config; www DNS and certificate expansion remain pending at the DNS provider.

- Homepage `WebSite` structured data identifying Cinema Namayesh at its canonical root URL.

- Stable ASCII sharing links for existing/new published articles and media, using lossless UUID encoding and a no-store redirect to the current original URL. Admin copy buttons include a manual clipboard fallback; no migration or slug rewrite.

- Automatic public sitemap and robots metadata routes, with lightweight published article URL/date API, canonical domain sharing, and Search Console setup guidance. No migration required.

- Editable Ecran promo text in site settings with a preserving default-column migration, plus visual slider/ad ordering with atomic saves and stale-list protection.

- Confirmed permanent article deletion from the admin list and editor through an authenticated DELETE endpoint, preserving shared uploaded files and retaining archive as the reversible alternative.

- Standalone photo/video posts with ordered albums, covers, draft/publish/archive workflow, a paginated admin panel and fullscreen public reels in the existing photo/film sections.
- Incremental media-post migration and validation/publication tests. Existing articles and shared media are preserved.
- Fixed desktop promotion overflow and removed empty advertising placeholders.
- Inset the Ecran News logo from the banner's right edge and removed the diamond emoji.

- Advertising management with image/GIF/video, destination links, optional text, timed placements, status filters, reactivation and deletion.
- Ordered text and image-group article blocks with a lightweight responsive editor and preserved legacy article content.
- Additive SQLite migration for advertisements and article blocks; validated video uploads and 32 MiB multipart proxy allowance.

### Changed

- Removed the English preparation paragraph; carousel next is now the right arrow, indicators run left to right, and matching slide/swipe direction retains RTL story text. Replaced thin arrows with rounded SVG chevrons in 44px controls.

- Added a preserving data migration for the English editorial category. The seed-only change was already deployed but did not populate production; the category is now available to the admin article dropdown without reseeding content or accounts.

- Removed the visible homepage brand introduction at the owner's request and restored the carousel's original heading levels. Search metadata and snippet exclusions remain in place.

- Aligned the visible homepage heading, introduction, metadata and WebSite description; carousel stories now use h2. Corrected the mobile drawer's brand name and excluded its portaled content, the ticker and homepage ads from snippets. Existing footer exclusion is retained; Google must still reprocess search results.

- Set a distinct homepage title for the exact brand/news query, simplified the About title to avoid competing with it, and refreshed the homepage search description. Google still controls the final title, snippet and ranking.

- Restored the photo category label above images and kept headlines below; downloads retain the larger icon button without visible text.

- Photo albums and legacy photo articles now show photos above the headline, with a larger labeled download button and visible keyboard focus.

- Photo albums render their images before the description with a download action per image; ordinary article/film layout and legacy photo cover downloads are preserved.

- Removed the extra cover from standalone photo album pages while retaining album items, listing/social covers and legacy article images.

- Fixed rich-text rollout build failures by converting media/sample bodies to strings, linked homepage photo cards to individual albums, and excluded shared navigation/footer text from Google snippets without hiding categories. Preserved main's editor, title and version 2.0 updates.

- Category Open Graph/Twitter titles and descriptions now identify their own category instead of inheriting the homepage tagline; existing category HTML titles, favicon and homepage sharing copy are preserved.

- Reverted `43fb626` to restore the previous article layout, then isolated player-first/title-below presentation to published video posts. Added a responsive, uncropped player and ordered album selection; kept author/reading-time removal and the existing photo gallery. No database migration or content deletion.

- Separated homepage SEO description from the shorter Open Graph/Twitter sharing tagline, preserving article-specific metadata and footer copy.

- Added spacing between admin article actions, fixed manual hyphenated slugs, clarified optional SEO fields, and bypassed Next image optimization only for runtime article upload covers.

- Homepage category cards now query the latest published content per category independently of the global article page, including photo/video uploads with their own covers and dates. Removed hardcoded report articles from the homepage and report archive.

- Fixed public upload access for Nginx and bypassed image optimization for runtime gallery covers; added inherited upload ACLs to deployment.
- Added optional HTTP/HTTPS source links to photo/video posts, their editor, gallery cards and reels, with an additive nullable-column migration.
- Removed the photo and film shortcut boxes above the homepage footer, retaining English and all gallery routes/navigation.
- Moved admin categories immediately before the final public-site link; renamed primary article text labels.
- Prevented creation defaults from resetting publication status, tags, sources or featured placement during partial article updates.

- **Promo Blocks & Layout Polish:**
  - Fixed RTL layout order and height constraints for `EcranNewsPromo` to create a perfect square logo box and centered text.
  - Matched `AdvertisementPlaceholder` height and sharp corner styling to align with the promo block.
  - Fixed zero-width non-joiner typo in the promo text ("لحظه‌ای").
  - Removed the red "تازه‌ها" overlay badge from the main featured news carousel to reduce visual clutter.
  - Renamed the main news feed section heading from "خبرها" to "تازه‌ها".
  - Updated the mobile navigation menu version footer from "نسخه ۱.۰" to "نسخه ۱.۱" (and "نسخه ۱.۸").
  - Replaced the "دسته‌بندی‌ها" text divider with a clean, continuous dashed line (`<hr>`) and tightened its bottom margin for better vertical rhythm.
- **Homepage Spacing & Visual Hierarchy:** Optimized vertical spacing and padding (using `!important` modifiers where necessary) for the top articles list (`!py-2 md:!py-3`) and their dashed separators (`!my-4 md:!my-5`). Adjusted the position and padding (`!pt-12 !pb-2`) of the main section divider ("دسته‌بندی‌ها") for optimal visual balance.
- **Category Management & Routing:** Added the "گزارش" (`report`) category to both the frontend mock structure and dynamic routing handlers to prevent 404 errors; ensured all categories dynamically render modern orange badge styling (`bg-orange-100 text-orange-600`).
- **Footer Refinements:** Reduced the font size of the main brand heading "سینما نمایش" in the footer (`text-2xl md:text-3xl`) and tightened the top padding of the dark footer container (`!pt-8 md:!pt-12`) for a more compact and elegant layout.
- **Article Page:** Removed placeholder sharing controls and the redundant category note; enlarged the category label and reduced the headline size on desktop and mobile.

- **Footer Socials:** Moved the icons below the press permit; all six marks gain brand colors and a subtle upward hover motion, while only Instagram navigates.

- **Article Page:** Moved promotions and «مطالب مرتبط» into a left desktop sidebar and hid placeholder photo credits and the old section eyebrow.
- **Footer:** Added six locally hosted white social brand icons; Instagram links to `cinemanamayesh.ir`, with other destinations pending.

- **UI Polish:** Fixed text contrast and removed dark mode conflicts on the "About Us" page.
- **Top Bar:** Corrected the Persian date rendering order to standard format.
- **Mobile Menu:** Fixed sub-menu vertical spacing and margins to prevent items from touching borders.
- **Homepage:** Increased vertical spacing between article lists and securely darkened the horizontal separator lines.

- **Ecran News Promo:** Compacted the mobile card into a horizontal logo-and-copy layout while retaining its description and Instagram action.
- **Admin Categories:** Replaced the overflowing mobile table with readable category cards and full-width edit actions.
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
