(function () {
  let currentPrefs = getPrefs();
  let lastBookingId = null;

  const views = {
    "/": "view-home",
    "/results": "view-results",
    "/wishlist": "view-wishlist",
    "/checkout": "view-checkout",
    "/confirmation": "view-confirmation",
    "/my-trips": "view-my-trips"
  };

  function getRoute() {
    const hash = window.location.hash.slice(1) || "/";
    return hash.startsWith("/") ? hash : `/${hash}`;
  }

  function navigate(route) {
    window.location.hash = route;
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toast.hidden = true;
    }, 2500);
  }

  function updateWishlistBadge() {
    const badge = document.getElementById("wishlist-badge");
    const count = getWishlist().length;
    if (count > 0) {
      badge.textContent = count;
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
  }

  function updateNavActive(route) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      const linkRoute = link.dataset.route;
      link.classList.toggle("active", linkRoute === route);
    });
  }

  function hideAllViews() {
    document.querySelectorAll(".view").forEach((view) => {
      view.hidden = true;
    });
  }

  function renderPackageCard(pkg, travelers, options) {
    const total = pkg.pricePerPerson * travelers;
    const inWishlist = getWishlist().includes(pkg.id);
    const card = document.createElement("article");
    card.className = "package-card";
    card.dataset.packageId = pkg.id;

    const hintsHtml = pkg.hints.map((h) => `<li>${h}</li>`).join("");

    card.innerHTML = `
      <h2>${pkg.name}</h2>
      <p class="package-meta">${formatTripType(pkg.tripType)} · ${pkg.days} days · Destination hidden</p>
      <ul class="package-hints">${hintsHtml}</ul>
      <p class="package-price">
        ${formatPrice(pkg.pricePerPerson)} <span style="font-weight:400;color:#718096">/ person</span>
        <span class="total">Total for ${travelers} traveler${travelers > 1 ? "s" : ""}: ${formatPrice(total)}</span>
      </p>
      <div class="card-actions">
        <button type="button" class="btn btn-secondary btn-small btn-wishlist" data-id="${pkg.id}" ${inWishlist ? "disabled" : ""}>
          ${inWishlist ? "In Wishlist" : "Add to Wishlist"}
        </button>
        <button type="button" class="btn btn-primary btn-small btn-book" data-id="${pkg.id}">Book Now</button>
      </div>
    `;

    if (options && options.showRemove) {
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn btn-secondary btn-small";
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
          btn.textContent = "In Wishlist";
          btn.disabled = true;
          updateWishlistBadge();
        }
      });
    });

    container.querySelectorAll(".btn-book").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pkg = getPackageById(btn.dataset.id);
        if (!pkg) return;
        const prefs = currentPrefs || { travelers: travelers || 1, budget: pkg.budgetTier, tripType: pkg.tripType, days: String(pkg.days) };
        setPendingBooking({ packageId: pkg.id, travelers: Number(prefs.travelers) || travelers || 1, prefs });
        navigate("/checkout");
      });
    });
  }

  function updateDaysDisplay(value) {
    document.getElementById("days-value").textContent = value;
  }

  function renderHome() {
    const form = document.getElementById("quiz-form");
    if (currentPrefs) {
      if (form.tripType.value !== currentPrefs.tripType) {
        const radio = form.querySelector(`input[name="tripType"][value="${currentPrefs.tripType}"]`);
        if (radio) radio.checked = true;
      }
      form.days.value = currentPrefs.days;
      updateDaysDisplay(currentPrefs.days);
      form.travelers.value = currentPrefs.travelers;
      form.budget.value = currentPrefs.budget;
    }
  }

  function renderResults() {
    if (!currentPrefs) {
      navigate("/");
      return;
    }

    const summary = document.getElementById("results-summary");
    summary.textContent =
      `Showing mystery packages for: ${formatTripType(currentPrefs.tripType)} · ${currentPrefs.days} days · ${currentPrefs.travelers} traveler${currentPrefs.travelers > 1 ? "s" : ""} · ${formatBudgetLabel(currentPrefs.budget)}/person`;

    const grid = document.getElementById("results-grid");
    grid.innerHTML = "";

    const packages = getMatchingPackages(currentPrefs);
    const travelers = Number(currentPrefs.travelers);

    if (packages.length === 0) {
      grid.innerHTML = '<div class="empty-state"><p>No packages found. Try adjusting your preferences.</p><p><a href="#/">Back to quiz</a></p></div>';
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
      container.innerHTML = '<div class="empty-state"><p>Your wishlist is empty.</p><p><a href="#/">Find mystery packages</a></p></div>';
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
      <h2>Order Summary</h2>
      <dl>
        <dt>Package</dt>
        <dd>${pkg.name}</dd>
        <dt>Trip Type</dt>
        <dd>${formatTripType(pkg.tripType)}</dd>
        <dt>Duration</dt>
        <dd>${pkg.days} days</dd>
        <dt>Travelers</dt>
        <dd>${travelers}</dd>
        <dt>Total</dt>
        <dd>${formatPrice(total)} CAD</dd>
      </dl>
    `;
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
      `${pkg ? pkg.name : "Mystery trip"} · ${trip.travelers} traveler${trip.travelers > 1 ? "s" : ""} · ${formatPrice(trip.totalPrice)} CAD total · Booked ${new Date(trip.bookedAt).toLocaleDateString("en-CA")}`;
  }

  function renderMyTrips() {
    const container = document.getElementById("my-trips-content");
    const trips = getBookedTrips();

    if (trips.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>You haven\'t booked any trips yet.</p><p><a href="#/">Plan a mystery trip</a></p></div>';
      return;
    }

    const list = document.createElement("div");
    list.className = "trip-list";

    trips.forEach((trip) => {
      const pkg = getPackageById(trip.packageId);
      const card = document.createElement("article");
      card.className = "trip-card";
      card.innerHTML = `
        <h2>${pkg ? pkg.name : "Mystery Package"}</h2>
        <p class="trip-destination">Destination: ${trip.destination}</p>
        <p class="trip-meta">
          ${formatTripType(trip.tripType)} · ${trip.travelers} traveler${trip.travelers > 1 ? "s" : ""} ·
          ${formatPrice(trip.totalPrice)} CAD · Booked ${new Date(trip.bookedAt).toLocaleDateString("en-CA")}
        </p>
      `;
      list.appendChild(card);
    });

    container.innerHTML = "";
    container.appendChild(list);
  }

  function renderRoute() {
    const route = getRoute();
    updateNavActive(route);
    updateWishlistBadge();
    hideAllViews();

    const viewId = views[route];
    if (!viewId) {
      navigate("/");
      return;
    }

    document.getElementById(viewId).hidden = false;

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
    }
  }

  document.getElementById("days").addEventListener("input", (e) => {
    updateDaysDisplay(e.target.value);
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
    const trip = {
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
    };

    addBookedTrip(trip);
    removeFromWishlist(pkg.id);
    trackCheckoutComplete({
      tripType: pkg.tripType,
      budgetTier: prefs.budget || pkg.budgetTier,
      totalPrice,
      packageId: pkg.id
    });

    lastBookingId = bookingId;
    clearPendingBooking();
    updateWishlistBadge();
    navigate("/confirmation");
  });

  window.addEventListener("hashchange", renderRoute);
  window.addEventListener("DOMContentLoaded", () => {
    if (!window.location.hash) {
      window.location.hash = "#/";
    }
    renderRoute();
  });
})();
