const menuIcon = document.querySelector('.menu-icon');

menuIcon.addEventListener('click', function () {
	this.classList.toggle('active');
	document.body.classList.toggle('lock')

})