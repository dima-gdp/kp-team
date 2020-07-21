const btns = document.querySelectorAll('.btn');
const overlay = document.querySelector('.modals__overlay');
const modals = document.querySelectorAll('.modal');

const showModal = (btns, modals, overlay) => {
	btns.forEach((btn) => {
		btn.addEventListener('click', (ev) => {
			let path = ev.target.getAttribute('data-path');
			modals.forEach((modal) => {
				modal.classList.remove('active');
			});
			overlay.classList.add('active');
			document.querySelector(`[data-target="${path}"]`).classList.add('active');
		})
	});

	overlay.addEventListener('click', (ev) => {
		if (ev.target === overlay) {
			overlay.classList.remove('active');
			modals.forEach((modal) => {
				modal.classList.remove('active');
			});
		}
	})
}

showModal(btns, modals, overlay);


