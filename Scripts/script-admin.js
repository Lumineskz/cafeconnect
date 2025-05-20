/* For navbar menu (hamburger) */
const mobileNav = document.querySelector('.mobile-nav');
const hamburgerMenu = document.querySelector('.hamburger-menu');

// For hamburger menu on phones
hamburgerMenu.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
});
