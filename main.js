// Mobile Menu Toggle
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

// Smooth scrolling for navigation links
const navLinks = document.querySelectorAll('a[href^="#"]');
if (navLinks && navLinks.length > 0) {
  navLinks.forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId) return;
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      event.preventDefault();

      // Close mobile menu if open
      if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
      }

      const header = document.querySelector("nav");
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition =
        targetElement.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight;

      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    });
  });
}

// Simple Add to Cart functionality with robust notification handling
const addToCartButtons = document.querySelectorAll(".add-to-cart");
const cartCount = document.querySelector(".cart-count");
const cartNotification = document.getElementById("cart-notification");
const notificationText = document.getElementById("notification-text");

let cartItems = 0;
let hideNotificationTimerId = null;

function showCartNotification(message) {
  if (!cartNotification || !notificationText) return;

  // Update message
  notificationText.textContent = message;

  // Ensure it's visible for animation restart
  cartNotification.classList.remove("hidden", "translate-y-4", "opacity-0");

  // Restart animation if already visible by forcing reflow
  // This ensures rapid clicks retrigger the transition
  // eslint-disable-next-line no-unused-expressions
  cartNotification.offsetHeight;

  cartNotification.classList.add("translate-y-0", "opacity-100");

  // Clear any previous timer and set a new one
  if (hideNotificationTimerId !== null) {
    clearTimeout(hideNotificationTimerId);
  }
  hideNotificationTimerId = window.setTimeout(() => {
    hideCartNotification();
  }, 3000);
}

function hideCartNotification() {
  if (!cartNotification) return;
  cartNotification.classList.remove("translate-y-0", "opacity-100");
  cartNotification.classList.add("translate-y-4", "opacity-0");
}

if (cartNotification) {
  cartNotification.addEventListener("transitionend", () => {
    if (cartNotification.classList.contains("opacity-0")) {
      cartNotification.classList.add("hidden");
    }
  });

  // If the tab becomes hidden, don't rely on transitions; hide immediately to avoid stuck state
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") {
      cartNotification.classList.add("hidden");
      cartNotification.classList.remove("translate-y-0", "opacity-100");
      cartNotification.classList.add("translate-y-4", "opacity-0");
      if (hideNotificationTimerId !== null) {
        clearTimeout(hideNotificationTimerId);
        hideNotificationTimerId = null;
      }
    }
  });
}

if (addToCartButtons && addToCartButtons.length > 0 && cartCount) {
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      cartItems += 1;
      cartCount.textContent = String(cartItems);

      const productCard = button.closest(".product-card");
      const productNameElement = productCard
        ? productCard.querySelector("h3")
        : null;
      const productName = productNameElement
        ? productNameElement.textContent || "Item"
        : "Item";

      showCartNotification(`${productName} added to cart!`);
    });
  });
}

