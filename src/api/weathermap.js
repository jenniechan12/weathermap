import axios from 'axios';
const apiKey = '773f102b13cb00e26efedfdd25b6ece1';

async function fetch5DayForcastByCity(city) {
	try {
		let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		console.log(error);
	}
}

export { fetch5DayForcastByCity };
