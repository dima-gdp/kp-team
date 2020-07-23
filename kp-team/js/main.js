const burger = document.querySelector('.burger')
const menu = document.querySelector('.header__nav')

// Функция отключения скролла
const disableScroll = () => {
	let pagePosition = window.scrollY;
	document.body.classList.add('disable-scroll');
	document.body.dataset.position = pagePosition;
	document.body.style.top = -pagePosition + 'px';
}

// Функция включения скролла
const enableScroll = () => {
	let pagePosition = parseInt(document.body.dataset.position, 10);
	document.body.style.top = 'auto';
	document.body.classList.remove('disable-scroll');
	window.scroll({ top: pagePosition, left: 0 });
	document.body.removeAttribute('data-position');
}

// Обработчик клика по бургеру
burger.addEventListener('click', function () {
	menu.classList.toggle('active');
	burger.classList.toggle('active');
	document.body.classList.contains('disable-scroll') ? enableScroll() : disableScroll()
});

// Валидации форм
const validateForm = (selector, rules) => {
	new window.JustValidate(selector, {
		rules: rules
	});
}

validateForm('.form-about', {
	name: { required: true },
	tel: { required: true }
});


validateForm('.form-price', {
	name: { required: true },
	tel: { required: true }
});

// Маска телефона
const input = document.querySelectorAll('input[type="tel"]');
const im = new Inputmask('+7 (999) 999-99-99');
im.mask(input);