(function () {
	var container = document.getElementById('rm-container');
	var openBtn = container.querySelector('.rm-button-open');
	var closeBtn = container.querySelector('.rm-close');
	var dishes = container.querySelectorAll('dt');
	var filters = container.querySelectorAll('.rm-filters button');

	function removeModal() {
		var old = container.querySelector('.rm-modal');
		if (old) old.remove();
	}

	function openMenu() {
		container.classList.add('rm-open');
	}

	function closeMenu() {
		container.classList.remove('rm-open', 'rm-nodelay', 'rm-in');
	}

	function el(tag, className, text) {
		var node = document.createElement(tag);
		if (className) node.className = className;
		if (text) node.textContent = text;
		return node;
	}

	function viewDetails(link) {
		container.classList.remove('rm-in');
		removeModal();

		var modal = el('div', 'rm-modal');
		var thumb = el('div', 'rm-thumb');
		thumb.style.backgroundImage = 'url("' + link.dataset.thumb + '")';

		var x = el('button', 'rm-close-modal', '\u00d7');
		x.type = 'button';
		x.setAttribute('aria-label', 'Close');
		x.addEventListener('click', function () { container.classList.remove('rm-in'); });

		modal.append(thumb, el('h5', '', link.textContent), el('p', '', link.parentNode.nextElementSibling.textContent));

		var r = window.RECIPES && window.RECIPES[link.dataset.thumb];
		if (r) {
			var box = el('div', 'rm-recipe');
			box.append(el('p', 'rm-meta', 'Serves ' + r.serves + '. ' + r.time + '.'), el('h6', '', 'Ingredients'));
			var ul = el('ul');
			r.ing.forEach(function (i) { ul.append(el('li', '', i)); });
			var ol = el('ol');
			r.steps.forEach(function (s) { ol.append(el('li', '', s)); });
			box.append(ul, el('h6', '', 'Method'), ol);
			modal.append(box);
		}
		modal.append(x);
		modal.setAttribute('role', 'dialog');
		container.appendChild(modal);

		modal.style.marginTop = -(modal.offsetHeight / 2) + 'px';

		setTimeout(function () {
			container.classList.add('rm-in', 'rm-nodelay');
			x.focus();
		}, 0);
	}

	function applyFilter(name) {
		filters.forEach(function (b) {
			b.setAttribute('aria-pressed', String(b.dataset.filter === name));
		});
		dishes.forEach(function (dt) {
			var tags = (dt.dataset.tags || '').split(' ');
			var dim = name !== 'all' && tags.indexOf(name) === -1;
			dt.classList.toggle('rm-dim', dim);
			dt.nextElementSibling.classList.toggle('rm-dim', dim);
		});
	}

	openBtn.addEventListener('click', openMenu);
	closeBtn.addEventListener('click', closeMenu);

	container.querySelectorAll('a.rm-viewdetails').forEach(function (link) {
		link.addEventListener('click', function (e) {
			e.preventDefault();
			viewDetails(link);
		});
	});

	filters.forEach(function (b) {
		b.addEventListener('click', function () { applyFilter(b.dataset.filter); });
	});

	// Escape closes the dish card first, then the menu
	document.addEventListener('keydown', function (e) {
		if (e.key !== 'Escape') return;
		if (container.classList.contains('rm-in')) container.classList.remove('rm-in');
		else closeMenu();
	});
})();
