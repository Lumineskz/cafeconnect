// This is the main JavaScript file for the project.
// It contains all the functions and event listeners for the project.

// These are the global variables used in the project
// They are used to store the elements in the HTML and the data from the JSON file.
const hamburgerMenu = document.querySelector('.hamburger-menu');
const mobileNav = document.querySelector('.mobile-nav');
const mobileIconCart = mobileNav.querySelector('.icon-cart');
let iconCart = document.querySelector('.icon-cart');
let body = document.querySelector('body');
let listProductHTML = document.querySelector('.menu-items');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');
let listProducts = [];
let cart = [];
const cartItemsDiv = document.querySelector('.cart-items');



/* For navbar menu (hamburger) */
hamburgerMenu.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
});


/* For menu items image clicking in mobile */
function toggleFontSize(menuImg) {
    let desc = menuImg.parentElement.querySelector('.desc');
    desc.style.fontSize = desc.style.fontSize === '0.8em' ? '0em' : '0.8em';
}


// For menu items sorting default
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".menu-item").forEach(item => {
        item.style.display = "block";
    });
});
// Menu Items sorting by category
document.querySelectorAll('.cat-row .cat').forEach(category => {
    category.addEventListener('click', () => {
        const selectedCategory = category.getAttribute("data-category");

        document.querySelectorAll('.menu-item').forEach(item => {
            item.style.display = (selectedCategory === "all" || item.getAttribute("data-category") === selectedCategory) ? "block" : "none";
        });
    });
});


// Log in function for admin
function validatePassword(event) {
    event.preventDefault();
    const password = document.getElementById("password").value;

    if (password === "123") {
        window.location.href = "admin.html";
    } else {
        alert("Incorrect password!");
    }

    return false; // Prevent form submission
}


// For Cart Window
// For Cart Window close and open
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

let closeCart = document.querySelector('.close');
closeCart.addEventListener('click', () => {
    body.classList.remove('showCart');
});

// For Cart Window close and open (mobile specific)
mobileIconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.remove('showCart');
});

// Adding data from JSON file to HTML
// This function is called when the page loads
// and it fetches the data from the JSON file and adds it to the HTML.
const initApp = () => {
    fetch('Products.json')
        .then(response => response.json())
        .then(data => {
            listProducts = data;
            addDataToHTML();
            // Check if cart is in local storage
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        });
}
// Calling the init app function to load the datafrom JSON as the site loads
// and also check if the cart is in local storage.
// If it is, then it will load the cart from local storage.
initApp();

// THis function is used to add menu data from JSON file to HTML
const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if (listProducts.length > 0) {
        listProducts.forEach((product) => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('menu-item');
            newProduct.setAttribute('data-category', product.category);
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <div class="menu-img" onclick="toggleFontSize(this)">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <h2>${product.name}</h2>
                <p class="desc">${product.description}</p>
                <p><b>Price:</b> Rs. ${product.price}</p>
                <button class="order-button" id="order" data-product-id="${product.id}">Add to Cart</button>
            `;
            listProductHTML.appendChild(newProduct);
        });
    }
}

// Add to cart function
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('order-button')) {
        let product_id = positionClick.dataset.productId; // Use dataset
        addToCart(product_id);
    }
});

// This function is used to add product_id and quantity to the cart
// and also update the cart in the HTML by calling the add cart to the html function.
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if (cart.length === 0) {
        cart = [{ product_id: product_id, quantity: 1 }];
    } else if (positionThisProductInCart < 0) {
        cart.push({ product_id: product_id, quantity: 1 });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
    document.cookie
};

// This function is used to add the cart to the HTML
// and also update the cart count in the icon.
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (cart.length > 0) {
        cart.forEach((cartItem) => {
            totalQuantity += cartItem.quantity;
            let product = listProducts.find((p) => p.id == cartItem.product_id);
            let newCart = document.createElement('div');
            newCart.dataset.id = cartItem.product_id;
            newCart.classList.add('item');
            newCart.innerHTML = `
                <div class="image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="name">${product.name}</div>
                <div class="totalPrice"><b>Rs. ${cartItem.quantity * product.price}</b></div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${cartItem.quantity}</span>
                    <span class="plus">></span>
                </div>`;
            listCartHTML.appendChild(newCart);
        });
    }
    iconCartSpan.textContent = totalQuantity; // Update cart count
};

// This function is used to add the cart to the local storage
// so that it can be accessed later when the page is reloaded or closed and reopened.
// It converts the cart array to a string and stores it in the local storage.
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// For adding or subtracting quantity in cart
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('plus') || positionClick.classList.contains('minus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        changeQuantity(product_id, type);
    }
});

// This function is used to change the quantity of the product in the cart
// and also remove the product from the cart if the quantity is 0.
const changeQuantity = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity += 1;
                break;
            default:
                let valueChange = cart[positionItemInCart].quantity - 1;
                if (valueChange > 0) {
                    cart[positionItemInCart].quantity = valueChange;
                } else {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToMemory();
    addCartToHTML();
};

// Redirec to checkout page after clicking "Checkout" on cart
function goToCheckOutPage(){
    if (cart.length > 0) {
        window.location.href = "CheckOut.html";
    } else {
        alert("Your cart is empty. Please add items to the cart before proceeding to checkout.");
    }
}
