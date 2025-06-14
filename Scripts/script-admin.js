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

