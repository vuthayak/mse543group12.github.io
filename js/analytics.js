function gtagSafe() {
  if (typeof gtag === "function") {
    gtag.apply(window, arguments);
  }
}

function trackPageView(pagePath) {
  gtagSafe("event", "page_view", {
    page_path: pagePath,
    page_title: document.title
  });
}

function trackSearchPackages({ tripType, days, travelers, budgetTier, resultsCount }) {
  gtagSafe("event", "search_packages", {
    trip_type: tripType,
    days: Number(days),
    travelers: Number(travelers),
    budget_tier: budgetTier,
    results_count: resultsCount
  });
}

function trackBeginCheckout({ packageId, tripType, value, travelers }) {
  gtagSafe("event", "begin_checkout", {
    item_id: packageId,
    trip_type: tripType,
    value: value,
    currency: "CAD",
    travelers: Number(travelers)
  });
}

function trackCheckoutStarted({ packageId, tripType, value, travelers }) {
  gtagSafe("event", "checkout_started", {
    item_id: packageId,
    trip_type: tripType,
    value: value,
    currency: "CAD",
    travelers: Number(travelers)
  });
}

function trackCheckoutAbandoned({ packageId, tripType, value, travelers }) {
  gtagSafe("event", "checkout_abandoned", {
    item_id: packageId,
    trip_type: tripType,
    value: value,
    currency: "CAD",
    travelers: Number(travelers)
  });
}

function trackAddToWishlist(packageId, tripType) {
  gtagSafe("event", "add_to_wishlist", {
    item_id: packageId,
    trip_type: tripType
  });
}

function trackCheckoutComplete({ tripType, budgetTier, totalPrice, packageId }) {
  gtagSafe("event", "purchase_complete", {
    trip_type: tripType,
    budget_tier: budgetTier,
    value: totalPrice,
    currency: "CAD",
    item_id: packageId
  });
}
