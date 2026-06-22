(function () {
  let currentPrefs = getPrefs();
  let lastBookingId = null;

  const views = {
    "/": "view-home",
    "/results": "view-results",
    "/wishlist": "view-wishlist",
    "/checkout": "view-checkout",
    "/confirmation": "view-confirmation",
    "/my-trips": "view-my-trips",
    "/trip-detail": "view-trip-detail"
  };

  const tripTypeIcons = {
    beach: "🏖",
    city: "🏙",
    nature: "🏔"
  };

  let previousRoute = null;
  let lastCheckoutStartedKey = null;

  function getBasePath() {
    const segment = window.location.pathname.split("/").filter(Boolean)[0];
    if (segment && segment.includes(".github.io")) {
      return `/${segment}`;
    }
    return "";
  }

  function toAppRoute(pathname) {
    const base = getBasePath();
    let path = pathname || "/";
    if (base && path.startsWith(base)) {
      path = path.slice(base.length) || "/";
    }
    if (path.length > 1 && path.endsWith("/")) {
      path = path.slice(0, -1);
    }
    return path || "/";
  }

  function toFullPath(appRoute) {
    const base = getBasePath();
    if (appRoute === "/") {
      return `${base}/`;
    }
    return `${base}${appRoute}`;
  }

  function getRoute() {
    return toAppRoute(window.location.pathname);
  }

  function parseRoute() {
    const route = getRoute();
    if (route.startsWith("/my-trips/") && route.length > "/my-trips/".length) {
      return {
        route: "/trip-detail",
        bookingId: decodeURIComponent(route.slice("/my-trips/".length))
      };
    }
    return { route, bookingId: null };
  }

  function getPagePath(route, bookingId) {
    if (route === "/trip-detail" && bookingId) {
      return `/my-trips/${bookingId}`;
    }
    return route;
  }

  function maybeTrackCheckoutAbandonment(nextRoute) {
    const { route } = parseRoute();
    if (route !== "/checkout" || nextRoute === "/checkout") return;

    const pending = getPendingBooking();
    if (!pending) return;

    const pkg = getPackageById(pending.packageId);
    if (!pkg) return;

    trackCheckoutAbandoned({
      packageId: pkg.id,
      tripType: pkg.tripType,
      value: pkg.pricePerPerson * pending.travelers,
      travelers: pending.travelers
    });
  }

  function navigate(route, { replace = false } = {}) {
    const normalized = route === "/" ? "/" : route.replace(/\/+$/, "") || "/";
    const fullPath = toFullPath(normalized);

    if (replace) {
      history.replaceState(null, "", fullPath);
    } else if (toAppRoute(window.location.pathname) !== normalized) {
      history.pushState(null, "", fullPath);
    }

    renderRoute();
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.hidden = true;
    toast.textContent = message;
    requestAnimationFrame(() => {
      toast.hidden = false;
    });
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toast.hidden = true;
    }, 2800);
  }

  function updateWishlistBadge() {
    const badge = document.getElementById("wishlist-badge");
    const count = getWishlist().length;

    badge.textContent = count > 0 ? String(count) : "";
    badge.hidden = count === 0;
  }

  function updateNavActive(route) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      const linkRoute = link.dataset.route;
      const isMyTrips = linkRoute === "/my-trips" &&
        (route === "/my-trips" || route === "/trip-detail");
      link.classList.toggle("active", linkRoute === route || isMyTrips);
    });
  }

  function hideAllViews() {
    document.querySelectorAll(".view").forEach((view) => {
      view.hidden = true;
    });
  }

  function emptyStateHTML({ icon, title, message, ctaText, ctaHref }) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon" aria-hidden="true">${icon}</div>
        <h2>${title}</h2>
        <p>${message}</p>
        <a href="${ctaHref}" class="btn btn-primary">${ctaText}</a>
      </div>
    `;
  }

  function renderPackageCard(pkg, travelers, options) {
    const total = pkg.pricePerPerson * travelers;
    const inWishlist = getWishlist().includes(pkg.id);
    const card = document.createElement("article");
    card.className = "package-card";
    card.dataset.packageId = pkg.id;

    const hintsHtml = pkg.hints.map((h) => `<li>${h}</li>`).join("");

    card.innerHTML = `
      <div class="package-card-header">
        <h2>${pkg.name}</h2>
        <div class="package-badges">
          <span class="badge-tag badge-tag--type">${formatTripType(pkg.tripType)}</span>
          <span class="badge-tag badge-tag--mystery">Mystery</span>
        </div>
      </div>
      <p class="package-meta">${pkg.days} days · Destination revealed after booking</p>
      <ul class="package-hints">${hintsHtml}</ul>
      <div class="package-price">
        <span class="package-price-main">${formatPrice(pkg.pricePerPerson)}</span>
        <span class="package-price-unit"> / person</span>
        <span class="package-price-total">Total for ${travelers} traveler${travelers > 1 ? "s" : ""}: ${formatPrice(total)}</span>
      </div>
      <div class="card-actions">
        <button type="button" class="btn btn-secondary btn-sm btn-wishlist" data-id="${pkg.id}" ${inWishlist ? "disabled" : ""}>
          ${inWishlist ? "Saved" : "Add to wishlist"}
        </button>
        <button type="button" class="btn btn-primary btn-sm btn-book" data-id="${pkg.id}">Book now</button>
      </div>
    `;

    if (options && options.showRemove) {
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn btn-ghost btn-sm";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        removeFromWishlist(pkg.id);
        updateWishlistBadge();
        renderWishlist();
        showToast("Removed from wishlist");
      });
      card.querySelector(".card-actions").appendChild(removeBtn);
    }

    return card;
  }

  function bindCardActions(container, travelers) {
    container.querySelectorAll(".btn-wishlist").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pkg = getPackageById(btn.dataset.id);
        if (!pkg) return;
        const added = addToWishlist(pkg.id);
        if (added) {
          trackAddToWishlist(pkg.id, pkg.tripType);
          showToast("Added to wishlist");
          btn.textContent = "Saved";
          btn.disabled = true;
          updateWishlistBadge();
        }
      });
    });

    container.querySelectorAll(".btn-book").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pkg = getPackageById(btn.dataset.id);
        if (!pkg) return;
        const prefs = currentPrefs || {
          travelers: travelers || 1,
          budget: pkg.budgetTier,
          tripType: pkg.tripType,
          days: String(pkg.days)
        };
        setPendingBooking({
          packageId: pkg.id,
          travelers: Number(prefs.travelers) || travelers || 1,
          prefs
        });
        trackBeginCheckout({
          packageId: pkg.id,
          tripType: pkg.tripType,
          value: pkg.pricePerPerson * (Number(prefs.travelers) || travelers || 1),
          travelers: Number(prefs.travelers) || travelers || 1
        });
        navigate("/checkout");
      });
    });
  }

  function updateDaysDisplay(value) {
    const days = Number(value);
    const label = days === 1 ? "1 day" : `${days} days`;
    const output = document.getElementById("days-value");
    const slider = document.getElementById("days");
    output.textContent = label;
    slider.setAttribute("aria-valuenow", value);
  }

  function renderHome() {
    const form = document.getElementById("quiz-form");
    if (currentPrefs) {
      const radio = form.querySelector(`input[name="tripType"][value="${currentPrefs.tripType}"]`);
      if (radio) radio.checked = true;
      form.days.value = currentPrefs.days;
      updateDaysDisplay(currentPrefs.days);
      form.travelers.value = currentPrefs.travelers;
      form.budget.value = currentPrefs.budget;
    }
  }

  function renderResultsSummary() {
    const summary = document.getElementById("results-summary");
    const days = Number(currentPrefs.days);
    const dayLabel = days === 1 ? "1 day" : `${days} days`;

    summary.innerHTML = `
      <span class="pill">${tripTypeIcons[currentPrefs.tripType] || ""} <strong>${formatTripType(currentPrefs.tripType)}</strong></span>
      <span class="pill"><strong>${dayLabel}</strong></span>
      <span class="pill"><strong>${currentPrefs.travelers}</strong> traveler${currentPrefs.travelers > 1 ? "s" : ""}</span>
      <span class="pill"><strong>${formatBudgetLabel(currentPrefs.budget)}</strong> / person</span>
    `;
  }

  function renderResults() {
    if (!currentPrefs) {
      navigate("/");
      return;
    }

    renderResultsSummary();

    const grid = document.getElementById("results-grid");
    grid.innerHTML = "";

    const packages = getMatchingPackages(currentPrefs);
    const travelers = Number(currentPrefs.travelers);

    if (packages.length === 0) {
      grid.innerHTML = emptyStateHTML({
        icon: "🔍",
        title: "No packages found",
        message: "Try adjusting your trip type, duration, or budget to see more options.",
        ctaText: "Edit preferences",
        ctaHref: "./"
      });
      return;
    }

    packages.forEach((pkg) => {
      grid.appendChild(renderPackageCard(pkg, travelers));
    });

    bindCardActions(grid, travelers);
  }

  function renderWishlist() {
    const container = document.getElementById("wishlist-content");
    const ids = getWishlist();

    if (ids.length === 0) {
      container.innerHTML = emptyStateHTML({
        icon: "♡",
        title: "Your wishlist is empty",
        message: "Save mystery packages while browsing — they'll appear here until you're ready to book.",
        ctaText: "Find packages",
        ctaHref: "./"
      });
      return;
    }

    const grid = document.createElement("div");
    grid.className = "card-grid";

    ids.forEach((id) => {
      const pkg = getPackageById(id);
      if (pkg) {
        const travelers = currentPrefs ? Number(currentPrefs.travelers) : 1;
        grid.appendChild(renderPackageCard(pkg, travelers, { showRemove: true }));
      }
    });

    container.innerHTML = "";
    container.appendChild(grid);
    bindCardActions(grid, currentPrefs ? Number(currentPrefs.travelers) : 1);
  }

  function renderCheckout() {
    const pending = getPendingBooking();
    if (!pending) {
      navigate("/");
      return;
    }

    const pkg = getPackageById(pending.packageId);
    if (!pkg) {
      clearPendingBooking();
      navigate("/");
      return;
    }

    const travelers = pending.travelers;
    const total = pkg.pricePerPerson * travelers;

    const summary = document.getElementById("checkout-summary");
    summary.innerHTML = `
      <h2>Order summary</h2>
      <dl>
        <dt>Package</dt>
        <dd>${pkg.name}</dd>
        <dt>Trip type</dt>
        <dd>${formatTripType(pkg.tripType)}</dd>
        <dt>Duration</dt>
        <dd>${pkg.days} days</dd>
        <dt>Travelers</dt>
        <dd>${travelers}</dd>
        <dt>Total</dt>
        <dd class="checkout-total">${formatPrice(total)} CAD</dd>
      </dl>
    `;

    const checkoutKey = `${pkg.id}:${travelers}`;
    if (lastCheckoutStartedKey !== checkoutKey) {
      lastCheckoutStartedKey = checkoutKey;
      trackCheckoutStarted({
        packageId: pkg.id,
        tripType: pkg.tripType,
        value: total,
        travelers
      });
    }
  }

  function renderConfirmation() {
    const trips = getBookedTrips();
    const trip = lastBookingId
      ? trips.find((t) => t.bookingId === lastBookingId)
      : trips[0];

    if (!trip) {
      navigate("/my-trips");
      return;
    }

    const pkg = getPackageById(trip.packageId);
    const heading = document.getElementById("confirmation-heading");
    const details = document.getElementById("confirmation-details");

    heading.textContent = `You're going to ${trip.destination}!`;
    details.textContent =
      `${pkg ? pkg.name : "Mystery trip"} · ${trip.travelers} traveler${trip.travelers > 1 ? "s" : ""} · ${formatPrice(trip.totalPrice)} CAD total · Booked ${new Date(trip.bookedAt).toLocaleDateString("en-CA", { dateStyle: "medium" })}`;

    const viewLink = document.querySelector("#view-confirmation .btn-primary");
    if (viewLink) {
      viewLink.href = toFullPath(`/my-trips/${encodeURIComponent(trip.bookingId)}`);
    }
  }

  function renderMyTrips() {
    const container = document.getElementById("my-trips-content");
    const trips = getBookedTrips();

    if (trips.length === 0) {
      container.innerHTML = emptyStateHTML({
        icon: "✈",
        title: "No trips yet",
        message: "Book a mystery package to unlock your destination — it'll show up here after checkout.",
        ctaText: "Plan a trip",
        ctaHref: "./"
      });
      return;
    }

    const list = document.createElement("div");
    list.className = "trip-list";

    trips.forEach((trip) => {
      const pkg = getPackageById(trip.packageId);
      const card = document.createElement("button");
      card.type = "button";
      card.className = "trip-card";
      card.dataset.bookingId = trip.bookingId;
      card.innerHTML = `
        <div class="trip-card-header">
          <h2>${pkg ? pkg.name : "Mystery Package"}</h2>
          <span class="trip-status">Confirmed</span>
        </div>
        <p class="trip-destination">${trip.destination}</p>
        <p class="trip-meta">
          <span>${tripTypeIcons[trip.tripType] || ""} ${formatTripType(trip.tripType)}</span>
          <span>${trip.travelers} traveler${trip.travelers > 1 ? "s" : ""}</span>
          <span>${formatPrice(trip.totalPrice)} CAD</span>
          <span>Booked ${new Date(trip.bookedAt).toLocaleDateString("en-CA", { dateStyle: "medium" })}</span>
        </p>
        <p class="trip-card-hint">Tap to view full details</p>
      `;
      card.addEventListener("click", () => {
        navigate(`/my-trips/${encodeURIComponent(trip.bookingId)}`);
      });
      list.appendChild(card);
    });

    container.innerHTML = "";
    container.appendChild(list);
  }

  function renderTripDetail(bookingId) {
    const container = document.getElementById("trip-detail-content");
    const trip = getBookedTripById(bookingId);

    if (!trip) {
      navigate("/my-trips");
      return;
    }

    const pkg = getPackageById(trip.packageId);
    const hintsHtml = pkg
      ? pkg.hints.map((h) => `<li>${h}</li>`).join("")
      : "";
    const pricePerPerson = pkg
      ? pkg.pricePerPerson
      : Math.round(trip.totalPrice / trip.travelers);

    container.innerHTML = `
      <article class="trip-detail-card panel">
        <div class="trip-detail-header">
          <h1>${pkg ? pkg.name : trip.packageName || "Mystery Package"}</h1>
          <div class="package-badges">
            <span class="badge-tag badge-tag--type">${formatTripType(trip.tripType)}</span>
            <span class="trip-status">Confirmed</span>
          </div>
        </div>

        <div class="trip-detail-destination">
          <span aria-hidden="true">📍</span>
          <span>Destination: ${trip.destination}</span>
        </div>

        ${pkg ? `<ul class="package-hints trip-detail-section">${hintsHtml}</ul>` : ""}

        <div class="trip-detail-section">
          <h2>Booking details</h2>
          <dl class="trip-detail-meta-grid">
            <div class="trip-detail-meta-item">
              <dt>Duration</dt>
              <dd>${trip.days || (pkg ? pkg.days : "—")} days</dd>
            </div>
            <div class="trip-detail-meta-item">
              <dt>Travelers</dt>
              <dd>${trip.travelers}</dd>
            </div>
            <div class="trip-detail-meta-item">
              <dt>Price per person</dt>
              <dd>${formatPrice(pricePerPerson)}</dd>
            </div>
            <div class="trip-detail-meta-item">
              <dt>Total paid</dt>
              <dd>${formatPrice(trip.totalPrice)} CAD</dd>
            </div>
            <div class="trip-detail-meta-item">
              <dt>Passenger</dt>
              <dd>${trip.passengerName || "—"}</dd>
            </div>
            <div class="trip-detail-meta-item">
              <dt>Booked on</dt>
              <dd>${new Date(trip.bookedAt).toLocaleDateString("en-CA", { dateStyle: "medium" })}</dd>
            </div>
          </dl>
        </div>

        <div class="trip-detail-actions">
          <button type="button" class="btn btn-danger" id="cancel-booking-btn">Cancel booking</button>
        </div>
      </article>
    `;

    document.getElementById("cancel-booking-btn").addEventListener("click", () => {
      const confirmed = window.confirm(
        "Cancel this booking? This will remove the trip from My Trips."
      );
      if (!confirmed) return;

      removeBookedTrip(trip.bookingId);
      if (lastBookingId === trip.bookingId) {
        lastBookingId = null;
      }
      showToast("Booking cancelled");
      navigate("/my-trips");
    });
  }

  function renderRoute() {
    const { route, bookingId } = parseRoute();

    if (previousRoute === "/checkout" && route !== "/checkout") {
      maybeTrackCheckoutAbandonment(route);
    }
    previousRoute = route;

    updateNavActive(route);
    updateWishlistBadge();
    hideAllViews();

    const viewId = views[route];
    if (!viewId) {
      navigate("/");
      return;
    }

    document.getElementById(viewId).hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });

    switch (route) {
      case "/":
        renderHome();
        break;
      case "/results":
        renderResults();
        break;
      case "/wishlist":
        renderWishlist();
        break;
      case "/checkout":
        renderCheckout();
        break;
      case "/confirmation":
        renderConfirmation();
        break;
      case "/my-trips":
        renderMyTrips();
        break;
      case "/trip-detail":
        renderTripDetail(bookingId);
        break;
    }

    trackPageView(getPagePath(route, bookingId));
  }

  function adjustTravelers(delta) {
    const input = document.getElementById("travelers");
    const next = Math.min(8, Math.max(1, Number(input.value) + delta));
    input.value = next;
  }

  document.getElementById("days").addEventListener("input", (e) => {
    updateDaysDisplay(e.target.value);
  });

  document.getElementById("travelers-decrease").addEventListener("click", () => {
    adjustTravelers(-1);
  });

  document.getElementById("travelers-increase").addEventListener("click", () => {
    adjustTravelers(1);
  });

  document.getElementById("quiz-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    currentPrefs = {
      tripType: form.tripType.value,
      days: form.days.value,
      travelers: Number(form.travelers.value),
      budget: form.budget.value
    };
    savePrefs(currentPrefs);
    const resultsCount = getMatchingPackages(currentPrefs).length;
    trackSearchPackages({
      tripType: currentPrefs.tripType,
      days: currentPrefs.days,
      travelers: currentPrefs.travelers,
      budgetTier: currentPrefs.budget,
      resultsCount
    });
    navigate("/results");
  });

  document.getElementById("checkout-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const pending = getPendingBooking();
    if (!pending) return;

    const pkg = getPackageById(pending.packageId);
    if (!pkg) return;

    const form = e.target;
    const travelers = pending.travelers;
    const totalPrice = pkg.pricePerPerson * travelers;
    const prefs = pending.prefs || currentPrefs || {};

    const bookingId = `booking-${Date.now()}`;
    addBookedTrip({
      bookingId,
      packageId: pkg.id,
      packageName: pkg.name,
      travelers,
      budgetTier: prefs.budget || pkg.budgetTier,
      tripType: pkg.tripType,
      days: pkg.days,
      totalPrice,
      bookedAt: new Date().toISOString(),
      passengerName: form.passengerName.value.trim(),
      destination: pkg.destination
    });

    removeFromWishlist(pkg.id);
    trackCheckoutComplete({
      tripType: pkg.tripType,
      budgetTier: prefs.budget || pkg.budgetTier,
      totalPrice,
      packageId: pkg.id
    });

    lastBookingId = bookingId;
    clearPendingBooking();
    lastCheckoutStartedKey = null;
    updateWishlistBadge();
    navigate("/confirmation");
  });

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link || link.target === "_blank") return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:")) {
      return;
    }

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;

    e.preventDefault();
    navigate(toAppRoute(url.pathname));
  });

  window.addEventListener("popstate", renderRoute);
  window.addEventListener("DOMContentLoaded", () => {
    const savedPath = sessionStorage.getItem("spa-path");
    if (savedPath) {
      sessionStorage.removeItem("spa-path");
      const [pathname, search = ""] = savedPath.split("?");
      history.replaceState(null, "", toFullPath(pathname) + (search ? `?${search}` : ""));
    }
    renderRoute();
  });
})();
