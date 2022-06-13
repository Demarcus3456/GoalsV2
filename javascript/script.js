// Menu

const list = document.querySelectorAll('.list');
function activeLink() {
    list.forEach((item) =>
        item.classList.remove('active'));
    this.classlist.add('active');
}
list.forEach((item) =>
    item.addEventListener('click', activeLink));