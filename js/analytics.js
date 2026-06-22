function gtagSafe() {
  if (typeof gtag === "function") {
    gtag.apply(window, arguments);
  }
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
