const hamburgerMenu = document.querySelector('.hamburger-menu');
const mobileNav = document.querySelector('.mobile-nav');

hamburgerMenu.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
});