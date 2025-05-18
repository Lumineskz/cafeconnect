/* For navbar menu (hamburger) */
const mobileNav = document.querySelector('.mobile-nav');
const hamburgerMenu = document.querySelector('.hamburger-menu');

// For hamburger menu on phones
hamburgerMenu.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
});
// Load orders from localStorage or initialize empty array
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// Listen for new order data from checkout page via localStorage
window.addEventListener('storage', (event) => {
    if (event.key === 'newOrder' && event.newValue) {
        try {
            const newOrder = JSON.parse(event.newValue);
            // Add new order to orders array
            orders.push({
                id: orders.length ? orders[orders.length - 1].id + 1 : 1,
                customer: newOrder.customer,
                items: newOrder.items,
                status: "Pending"
            });
            // Save updated orders to localStorage
            localStorage.setItem('orders', JSON.stringify(orders));
            // Remove the newOrder key to prevent duplicate processing
            localStorage.removeItem('newOrder');
            // Re-render orders
            renderOrders();
        } catch (e) {
            // Ignore malformed data
        }
    }
});

        function renderOrders() {
        const ordersList = document.getElementById('ordersList');
        ordersList.innerHTML = '';
        orders.forEach((order, idx) => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order';
            orderDiv.setAttribute('tabindex', '0');
            orderDiv.setAttribute('aria-label', `Order #${order.id} for ${order.customer}, status: ${order.status}`);

            // Checkbox for completion
            const checked = order.status === "Completed" ? "checked" : "";
            const disabled = order.status === "Completed" ? "disabled" : "";
            let statusHTML = `
            <label>
                <input type="checkbox" data-order-idx="${idx}" ${checked} ${disabled} aria-label="Mark order as completed">
                Mark as Completed
            </label>
            <strong>Status:</strong> ${order.status}
            ${order.status === "Completed" ? ' <span aria-label="Completed" title="Completed" style="color:green;font-size:1.2em;">&#10003;</span>' : ''}
            `;

            orderDiv.innerHTML = `
            <h2>Order #${order.id}</h2>
            <p><strong>Customer:</strong> ${order.customer}</p>
            <ul>
                ${order.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <p>${statusHTML}</p>
            `;
            ordersList.appendChild(orderDiv);
        });

        // Add event listeners for checkboxes
        document.querySelectorAll('input[type="checkbox"][data-order-idx]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
            const idx = this.getAttribute('data-order-idx');
            if (this.checked) {
                orders[idx].status = "Completed";
                renderOrders();
            }
            });
        });
        }

        document.addEventListener('DOMContentLoaded', renderOrders);