
// Theme initialization
document.addEventListener('DOMContentLoaded', function() {
  console.log('Gelatico theme initialized');
  
  // Cart Drawer functionality
  setupCartDrawer();
  
  // Product page functionalities
  if (document.querySelector('.product-info')) {
    setupProductPage();
  }
  
  // Add any other initialization here
});

// Cart Drawer functionality
function setupCartDrawer() {
  const cartButtons = document.querySelectorAll('.js-open-cart');
  const cartDrawer = document.getElementById('cart-drawer');
  
  if (!cartDrawer) return;
  
  // Setup cart open/close functionality
  cartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Fetch the cart contents via AJAX
      fetch('/cart?view=drawer')
        .then(response => response.text())
        .then(html => {
          cartDrawer.innerHTML = html;
          cartDrawer.classList.add('open');
          document.body.classList.add('drawer-open');
          
          // Setup close button
          const closeButton = cartDrawer.querySelector('.js-close-cart');
          if (closeButton) {
            closeButton.addEventListener('click', function() {
              cartDrawer.classList.remove('open');
              document.body.classList.remove('drawer-open');
            });
          }
          
          // Setup click outside to close
          document.addEventListener('click', function closeCartOnClickOutside(e) {
            if (cartDrawer.classList.contains('open') && !cartDrawer.contains(e.target) && !e.target.closest('.js-open-cart')) {
              cartDrawer.classList.remove('open');
              document.body.classList.remove('drawer-open');
              document.removeEventListener('click', closeCartOnClickOutside);
            }
          });
        })
        .catch(error => {
          console.error('Error loading cart drawer:', error);
        });
    });
  });
}

// Product page functionality
function setupProductPage() {
  // Handle variant selection
  const variantSelects = document.querySelectorAll('[data-variant-select]');
  const priceElement = document.querySelector('[data-product-price]');
  const addToCartButton = document.getElementById('AddToCart');
  const productForm = document.getElementById('AddToCartForm');
  
  if (variantSelects.length > 0 && priceElement) {
    variantSelects.forEach(select => {
      select.addEventListener('change', function() {
        // Get selected variant
        const selectedOptions = [];
        variantSelects.forEach(select => {
          selectedOptions.push(select.value);
        });
        
        // Find the variant based on selected options
        // This would typically come from a structured JSON object representing the product
        // For simplicity, we're using a data attribute pattern
        const variantId = select.options[select.selectedIndex].getAttribute('data-variant-id');
        const variantPrice = select.options[select.selectedIndex].getAttribute('data-variant-price');
        const variantAvailable = select.options[select.selectedIndex].getAttribute('data-variant-available') === 'true';
        
        // Update price
        if (variantPrice && priceElement) {
          priceElement.textContent = variantPrice;
        }
        
        // Update hidden variant ID input
        const variantInput = document.querySelector('input[name="id"]');
        if (variantInput && variantId) {
          variantInput.value = variantId;
        }
        
        // Update add to cart button state
        if (addToCartButton) {
          if (variantAvailable) {
            addToCartButton.removeAttribute('disabled');
            addToCartButton.textContent = 'Add to Cart';
          } else {
            addToCartButton.setAttribute('disabled', 'disabled');
            addToCartButton.textContent = 'Sold Out';
          }
        }
      });
    });
  }
  
  // Handle quantity selector
  const quantityInput = document.getElementById('Quantity');
  const quantityDecrease = document.getElementById('QuantityDecrease');
  const quantityIncrease = document.getElementById('QuantityIncrease');
  
  if (quantityInput && quantityDecrease && quantityIncrease) {
    quantityDecrease.addEventListener('click', function() {
      let quantity = parseInt(quantityInput.value);
      if (quantity > 1) {
        quantityInput.value = quantity - 1;
      }
    });
    
    quantityIncrease.addEventListener('click', function() {
      let quantity = parseInt(quantityInput.value);
      quantityInput.value = quantity + 1;
    });
  }
  
  // Handle product image gallery
  const featuredImage = document.getElementById('ProductFeaturedImage');
  const thumbnails = document.querySelectorAll('.product-thumbnail');
  
  if (featuredImage && thumbnails.length > 0) {
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
        const imageUrl = this.getAttribute('data-image-url');
        featuredImage.setAttribute('src', imageUrl);
        
        // Update active state
        thumbnails.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
  
  // Add to cart functionality with AJAX
  if (productForm) {
    productForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const addToCartButton = this.querySelector('[type="submit"]');
      const originalButtonText = addToCartButton.textContent;
      
      addToCartButton.textContent = 'Adding...';
      addToCartButton.setAttribute('disabled', 'disabled');
      
      const formData = new FormData(this);
      
      fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        addToCartButton.textContent = originalButtonText;
        addToCartButton.removeAttribute('disabled');
        
        // Show success notification
        showNotification('Product added to cart', 'success');
        
        // Open cart drawer
        const cartButtonEvent = new Event('click');
        document.querySelector('.js-open-cart').dispatchEvent(cartButtonEvent);
        
        // Update cart count
        updateCartCount();
      })
      .catch(error => {
        addToCartButton.textContent = originalButtonText;
        addToCartButton.removeAttribute('disabled');
        
        // Show error notification
        showNotification('Could not add product to cart', 'error');
        console.error('Error adding to cart:', error);
      });
    });
  }
}

// Helper function to show notifications
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Add show class after a slight delay for animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Setup close button
  const closeButton = notification.querySelector('.notification-close');
  closeButton.addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Auto dismiss after 4 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 4000);
}

// Helper function to update cart count in the header
function updateCartCount() {
  fetch('/cart.js')
    .then(response => response.json())
    .then(cart => {
      const cartCountElements = document.querySelectorAll('.cart-count');
      
      cartCountElements.forEach(element => {
        element.textContent = cart.item_count;
        
        // Add animation effect
        element.classList.add('animate-ping');
        setTimeout(() => {
          element.classList.remove('animate-ping');
        }, 1000);
      });
    })
    .catch(error => {
      console.error('Error updating cart count:', error);
    });
}
