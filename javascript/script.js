'use strict'

const agreement = document.querySelector('.agreement');
const agreeBtn = document.querySelector('.agreebtn');
const content = document.querySelector('.content');
const step = document.querySelector('.container')
const navbar = document.querySelector('.navbar');
const menu = document.querySelector('.menu');

/* Showing content after agreement */
agreeBtn.addEventListener('click', function(){
    agreement.classList.add('hidden');
    content.classList.remove('hidden');
});

/* Opens menu */
menu.addEventListener('click', function(){
    step.classList.add('hidden');
    navbar.classList.remove('hidden');
});