const WISHLIST_KEY = "mysteryTravel_wishlist";
const BOOKED_TRIPS_KEY = "mysteryTravel_bookedTrips";
const PENDING_BOOKING_KEY = "mysteryTravel_pendingBooking";
const PREFS_KEY = "mysteryTravel_prefs";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getWishlist() {
  return readJSON(WISHLIST_KEY, []);
}

function addToWishlist(packageId) {
  const list = getWishlist();
  if (!list.includes(packageId)) {
    list.push(packageId);
    writeJSON(WISHLIST_KEY, list);
    return true;
  }
  return false;
}

function removeFromWishlist(packageId) {
  const list = getWishlist().filter((id) => id !== packageId);
  writeJSON(WISHLIST_KEY, list);
}

function getBookedTrips() {
  return readJSON(BOOKED_TRIPS_KEY, []);
}

function addBookedTrip(trip) {
  const trips = getBookedTrips();
  trips.unshift(trip);
  writeJSON(BOOKED_TRIPS_KEY, trips);
}

function getPendingBooking() {
  try {
    const raw = sessionStorage.getItem(PENDING_BOOKING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setPendingBooking(booking) {
  sessionStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(booking));
}

function clearPendingBooking() {
  sessionStorage.removeItem(PENDING_BOOKING_KEY);
}

function savePrefs(prefs) {
  writeJSON(PREFS_KEY, prefs);
}

function getPrefs() {
  return readJSON(PREFS_KEY, null);
}
