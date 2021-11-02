const days = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
];

/**
 * @param {Date} date - in Unix timestamp
 * @returns the day of the week
 */
function getDay(date) {
	let index = new Date(date).getDay();
	return days[index];
}

/**
 * @param {Date} date - in Unix timestamp
 * @returns the date in comma format
 */
function getDate(date) {
	date = new Date(date * 1000);

	const [month, day, year] = [
		date.getMonth() + 1,
		date.getDate(),
		date.getFullYear(),
	];
	return `${month},${day},${year}`;
}

/**
 * @param {Date} date - in Unix timestamp
 * @returns the hour formatted [1-12][AM/PM]
 */
function formatHour(date) {
	let hour = new Date(date * 1000).getHours();
	if (hour > 12) return `${hour % 12}PM`;
	else if (hour === 12) return `12PM`;
	else return `${hour}AM`;
}

module.exports = { getDay, getDate, formatHour };
