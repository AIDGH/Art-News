# Changelog

## [Unreleased]

### Added

- Standalone photo/video posts with ordered albums, covers, draft/publish/archive workflow, a paginated admin panel and fullscreen public reels in the existing photo/film sections.
- Incremental media-post migration and validation/publication tests. Existing articles and shared media are preserved.
- Fixed desktop promotion overflow and removed empty advertising placeholders.
- Inset the Ecran News logo from the banner's right edge and removed the diamond emoji.

- Advertising management with image/GIF/video, destination links, optional text, timed placements, status filters, reactivation and deletion.
- Ordered text and image-group article blocks with a lightweight responsive editor and preserved legacy article content.
- Additive SQLite migration for advertisements and article blocks; validated video uploads and 32 MiB multipart proxy allowance.

### Changed

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
