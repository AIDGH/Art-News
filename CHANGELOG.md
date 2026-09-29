# Changelog

## [Unreleased]

### Changed

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
