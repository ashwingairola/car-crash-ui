class CrashReportService {
	fetchCrashData(filters) {
		const { date, limit } = filters;

		let url = 'https://data.cityofnewyork.us/resource/h9gi-nx95.json?';
		let params = {};

		if (date) {
			params.crash_date = date;
		}

		if (limit) {
			params.$offset = 0;
			params.$limit = limit;
		}

		let paramString = '';

		Object.keys(params).forEach((key, index) => {
			const value = params[key];
			if (index === 0) {
				paramString += `${key}=${value}`;
			} else {
				paramString += `&${key}=${value}`;
			}
		});

		url += paramString;

		return fetch(url).then((response) => response.json());
	}
}

const crashReportService = new CrashReportService();
const STATE = {
	crashes: [],
};

initFilterForm();
fetchCrashes({});

function initFilterForm() {
	const filterForm = document.getElementById('filter-form');
	const dateFilterInput = document.getElementById('date-filter-input');
	const limitFilterInput = document.getElementById('limit-filter-input');

	filterForm.addEventListener('submit', (e) => {
		e.preventDefault();

		const filters = {};

		const date = dateFilterInput.value;
		const limit = limitFilterInput.value;

		if (date) {
			filters.date = date;
		}

		if (limit) {
			filters.limit = limit;
		}

		fetchCrashes(filters);
	});

	const today = new Date();
	const todayFormatted = today.toISOString().split('T')[0];

	dateFilterInput.setAttribute('max', todayFormatted);

	// dateFilterInput.addEventListener('change', (e) => {
	// 	const value = e.target.value;
	// 	fetchCrashes(value);
	// });
}

function fetchCrashes(filters) {
	crashReportService
		.fetchCrashData(filters)
		.then((crashes) => {
			STATE.crashes = crashes;
			renderCrashDetails();
		})
		.catch((e) => {
			console.error(e);
		});
}

function renderCrashDetails() {
	const crashCardContainer = document.getElementById('crash-card-container');
	const crashes = STATE.crashes;

	crashCardContainer.innerHTML = '';

	const crashCards = crashes.map((crash) => {
		const card = document.createElement('div');
		card.className = 'card';

		const cardBody = document.createElement('div');
		cardBody.className = 'card-body';

		const vehicle1Container = document.createElement('div');
		const vehicle1Header = document.createElement('strong');
		vehicle1Header.innerText = 'Vehicle 1: ';
		const vehicle1Value = document.createElement('span');
		vehicle1Value.innerText = crash.vehicle_type_code1;

		vehicle1Container.appendChild(vehicle1Header);
		vehicle1Container.appendChild(vehicle1Value);

		const vehicle2Container = document.createElement('div');
		const vehicle2Header = document.createElement('strong');
		vehicle2Header.innerText = 'Vehicle 2: ';
		const vehicle2Value = document.createElement('span');
		vehicle2Value.innerText = crash.vehicle_type_code2;

		vehicle2Container.appendChild(vehicle2Header);
		vehicle2Container.appendChild(vehicle2Value);

		const crashDateContainer = document.createElement('div');
		const crashDateHeader = document.createElement('strong');
		crashDateHeader.innerText = 'Date: ';
		const crashDateValue = document.createElement('span');
		crashDateValue.innerText = new Date(crash.crash_date).toString();

		crashDateContainer.appendChild(crashDateHeader);
		crashDateContainer.appendChild(crashDateValue);

		const crashTimeContainer = document.createElement('div');
		const crashTimeHeader = document.createElement('strong');
		crashTimeHeader.innerText = 'Time: ';
		const crashTimeValue = document.createElement('span');
		crashTimeValue.innerText = crash.crash_time;

		crashTimeContainer.appendChild(crashTimeHeader);
		crashTimeContainer.appendChild(crashTimeValue);

		cardBody.appendChild(vehicle1Container);
		cardBody.appendChild(vehicle2Container);
		cardBody.appendChild(crashDateContainer);
		cardBody.appendChild(crashTimeContainer);

		card.appendChild(cardBody);

		return card;
	});

	crashCards.forEach((card) => {
		crashCardContainer.appendChild(card);
	});
}
