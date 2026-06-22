# Mystery Travel Booking

A bare-bones prototype for a university course project. Users take a preference quiz, browse mystery packages, save wishlist items, and book trips — destinations are revealed only after checkout.

**Live site:** https://mse543group12.github.io/

**Run locally:** `python3 -m http.server 8000` then open http://localhost:8000

Use in-app navigation (nav links, buttons) when testing locally. Direct URLs like `/wishlist` work on GitHub Pages via `404.html`; a simple local static server may not support those without starting from `/`.

**Analytics events:** `page_view`, `search_packages`, `begin_checkout`, `checkout_started`, `checkout_abandoned`, `add_to_wishlist`, `purchase_complete`
