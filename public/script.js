document.getElementById('title').addEventListener('click', (e) => {
    window.location.href='./'
})

const menu = document.querySelector('nav #menu ul')

document.getElementById('sidebar-btn').addEventListener('click', (e) =>{
    e.currentTarget.classList.toggle('clicked')
    menu.classList.toggle('open')
    // console.log(e.currentTarget)
})