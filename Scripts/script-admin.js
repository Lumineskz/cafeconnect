/* For navbar menu (hamburger) */
const mobileNav = document.querySelector('.mobile-nav');
const hamburgerMenu = document.querySelector('.hamburger-menu');

// For hamburger menu on phones
hamburgerMenu.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
});

// For Making menu add items functional
const addItemButton = document.querySelector('.add-item-btn');

addItemButton.addEventListener('click', (event) => {
    event.preventDefault();
    const menuItem = document.querySelector('#menuItem').value;
    const itemPrice = document.querySelector('#itemPrice').value;
    const itemDescription = document.querySelector('#itemDescription').value;
    const itemImage = document.querySelector('#itemImage').value;
    const itemCategory = document.querySelector('#itemCategory').value;

    // Here you can add your logic to add the item to the menu

    // Optionally, clear the form fields
    document.querySelector('#menuItem').value = '';
    document.querySelector('#itemPrice').value = '';
    document.querySelector('#itemDescription').value = '';
    document.querySelector('#itemImage').value = '';
    document.querySelector('#itemCategory').value = '';

    console.log('Adding item:', {
        menuItem,
        itemPrice,
        itemDescription,
        itemImage,
        itemCategory
    });
});

// Listen for new orders using localStorage as a simple communication channel
window.addEventListener('storage', (event) => {
    if (event.key === 'newOrder') {
        displayOrders();
    }
});

// Function to display orders on the admin orders panel
function displayOrders() {
    const ordersPanel = document.querySelector('#admin-orders-panel');
    if (!ordersPanel) return;
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    ordersPanel.innerHTML = '';
    orders.forEach((order, idx) => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order';
        orderDiv.innerHTML = `
            <h4>Order #${idx + 1}</h4>
            <p><strong>Name:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> ${order.customerEmail}</p>
            <p><strong>Items:</strong> ${order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</p>
            <p><strong>Total:</strong> $${order.total}</p>
            <hr>
        `;
        ordersPanel.appendChild(orderDiv);
    });
}

// Initial display of orders when admin page loads
displayOrders();
