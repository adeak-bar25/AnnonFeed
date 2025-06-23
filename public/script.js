document.querySelector('.logo').addEventListener('click', (e) => {
    window.location.href = './'
})

const sidebar = document.getElementById('sidebar')
const navBar = document.querySelector('nav.navbar')
const navBarHeight = window.getComputedStyle(navBar)['height']
const hidder = document.getElementById('hider')
const hamburgerBtn = document.getElementById('hamburger-btn')

navBar.style.height = navBarHeight
document.querySelector('.main').style.paddingTop = navBarHeight
sidebar.style.top = navBarHeight
hidder.style.top = navBarHeight


hamburgerBtn.addEventListener('click', (e) => {
    hidder.classList.toggle('hidden')
    console.log(this)
    hamburgerBtn.classList.toggle('hamburger-btn-clicked');
    setTimeout(() => {
        sidebar.classList.toggle('sidebar-opened')
    }, 200)
});

hidder.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target)) {
        hamburgerBtn.classList.toggle('hamburger-btn-clicked');
        sidebar.classList.toggle('sidebar-opened')
        setTimeout(() => {
            hidder.classList.toggle('hidden')
        }, 200)

    }
})
