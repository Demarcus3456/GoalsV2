'use strict'

const agreement = document.querySelector('.agreement');
const agreeBtn = document.querySelector('.agreebtn');
const content = document.querySelector('.content');

/* Showing content after agreement */
agreeBtn.addEventListener('click', function(){
    agreement.classList.add('hidden');
    content.classList.remove('hidden');
});