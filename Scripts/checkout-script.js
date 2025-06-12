/* For navbar menu (hamburger) */
const mobileNav = document.querySelector('.mobile-nav');
const hamburgerMenu = document.querySelector('.hamburger-menu');
let totalPrice = 0;

// For hamburger menu on phones
hamburgerMenu.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
});

// Loads the data from the cart to checkout Page
function loadCartToOrderSummary() {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    let products = window.listProducts;

    if (!products || products.length === 0) {
        fetch('Products.json') // Assuming Products.json is in the root or correct relative path
            .then(response => response.json())
            .then(data => {
                window.listProducts = data;
                displayOrderSummary(cartData, data);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                const orderSummaryDiv = document.querySelector('.order-summary');
                if(orderSummaryDiv) {
                    orderSummaryDiv.innerHTML = '<p class="error">Could not load product information.</p>';
                }
            });
    } else {
        displayOrderSummary(cartData, products);
    }
}


// Displays the loaded data from the cart
function displayOrderSummary(cartData, products) {
    const orderSummaryDiv = document.querySelector('.order-summary');
    const orderTotalDiv = document.querySelector('.order-total');
    if (!orderSummaryDiv || !orderTotalDiv) {
        console.error("Order summary or total div not found!");
        return;
    }
    // Reset totalPrice before calculation
    totalPrice = 0;
    // Clearing out order summary by default
    orderSummaryDiv.innerHTML = ''; // Clear it out

    
    // Says "your cart is empty if there is nothing in your current cart"
    if (cartData.length === 0) {
        orderSummaryDiv.innerHTML = '<p class="empty">Your cart is empty.</p>';
        orderTotalDiv.innerHTML = '<p class="empty">Total Price: Error, Empty Cart</p>'; // You might want to display "Total: Rs. 0" instead of "Error" here
        return;
    }

    // Optional: Re-add a header row if it was cleared by innerHTML = ''
    const headerDiv = document.createElement('div');
    headerDiv.className = 'order-item order-header'; // Add a class for styling if needed
    headerDiv.innerHTML = `
        <span class="item-name">Item</span>
        <span class="item-qty">Qty</span>
        <span class="item-price">Price</span>
    `;
    orderSummaryDiv.appendChild(headerDiv);

// Get the data from cart and localStorage or JSON, and also calculate total price
    cartData.forEach(cartItem => {
        const product = products.find(p => p.id == cartItem.product_id);
        if (product) {
            const itemTotal = product.price * cartItem.quantity;
            totalPrice += itemTotal;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'order-item';
            itemDiv.innerHTML = `
                <span class="order-item-name">${product.name}</span>
                <span class="order-item-qty"><span class="sub">-</span>x${cartItem.quantity}<span class="add">+</span></span>
                <span class="order-item-price">Rs. ${itemTotal}</span>
            `;
            orderSummaryDiv.appendChild(itemDiv);
        }
    });

    orderTotalDiv.innerHTML = `<b>Total: Rs. ${totalPrice}</b>`;
}

// Validation of the form, clears cart and redirects to thank-you.html upon successful submission
function checkOutConfirmForm(event) {
    event.preventDefault(); // Prevent default form submission initially

    // Basic validation
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.getElementById('payment-method').value;

    if (!name || !email || !address || !paymentMethod || paymentMethod === "Payment Method") {
        alert("Please fill in all required fields and select a valid payment method.");
        return false;
    }

    // If validation passes, clear the cart and redirect
    localStorage.removeItem('cart');

    // Redirect to thank-you page
    window.location.href = 'thank-you.html';
    return false; // This is redundant after redirection, but harmless.
}


// Call loadCartToOrderSummary when the CheckOut.html page loads
document.addEventListener('DOMContentLoaded', loadCartToOrderSummary);


// To add and subtract the amount of items from the checkout menu
document.querySelector('.order-summary').addEventListener('click', function(event) {
    if (event.target.classList.contains('add') || event.target.classList.contains('sub')) {
        const itemDiv = event.target.closest('.order-item');
        if (!itemDiv) return;

        // Get the product name from the DOM
        const nameSpan = itemDiv.querySelector('.order-item-name');
        if (!nameSpan) return;
        const productName = nameSpan.textContent;

        // Find product by name (assuming names are unique)
        const products = window.listProducts || [];
        const product = products.find(p => p.name === productName);
        if (!product) return;

        // Get cart from localStorage
        let cartData = JSON.parse(localStorage.getItem('cart')) || [];
        const cartIndex = cartData.findIndex(item => item.product_id == product.id);
        if (cartIndex === -1) return;
        // Adds or subtracts the items based on user's interaction
        if (event.target.classList.contains('add')) {
            cartData[cartIndex].quantity += 1;
        } else if (event.target.classList.contains('sub')) {
            cartData[cartIndex].quantity -= 1;
            if (cartData[cartIndex].quantity <= 0) {
                cartData.splice(cartIndex, 1);
            }
        }
        //Stores it to local storage
        localStorage.setItem('cart', JSON.stringify(cartData));
        displayOrderSummary(cartData, products);
    }
});