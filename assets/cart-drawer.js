
// Cart drawer functionality
document.addEventListener('DOMContentLoaded', function() {
  // Cart drawer functionality will be implemented here
  const cartDrawer = document.getElementById('cart-drawer');
  
  // Function to open cart drawer
  window.openCartDrawer = function() {
    if (cartDrawer) {
      cartDrawer.classList.add('active');
      document.body.classList.add('drawer-open');
    }
  };
  
  // Function to close cart drawer
  window.closeCartDrawer = function() {
    if (cartDrawer) {
      cartDrawer.classList.remove('active');
      document.body.classList.remove('drawer-open');
    }
  };
  
  // Listen for add to cart events
  document.addEventListener('click', function(event) {
    if (event.target.closest('form[action="/cart/add"]')) {
      // Prevent default form submission and handle with AJAX later
      // For now, just open the cart drawer
      setTimeout(function() {
        window.openCartDrawer();
      }, 300);
    }
  });
});
