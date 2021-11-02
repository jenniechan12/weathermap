<template lang="pug">
v-row.ma-5(align='center' justify='center')
    v-col(cols='11' sm='10' md='8' lg='6')
        //- Current Overview
        v-row()
            //- Weather's Info
            v-col(cols='6')
                v-row(justify='center')
                    v-col(cols='2')
                        v-icon() {{ icons[overviewWeather.icon] }} 
                    v-col(cols='2')
                        h3 {{ Math.round(overviewWeather.temp) }}&#176;
                    v-col(cols='8')
                        div.text-caption Precipitation: {{ overviewWeather.precipitation }}%
                        div.text-caption Humidity: {{ overviewWeather.humidity }}%
                        div.text-caption Wind: {{ overviewWeather.wind }}mph
            //- City's Info
            v-col(cols='6')
                v-row()
                    v-col.text-right(cols='12')
                        h3.my-0 {{ fullLocation }}
                        div.text-caption {{ day }}
                        div.text-caption {{ overviewWeather.description }}

        //- Graph of Temperature
        v-row()
            v-card(flat width='100%')
                v-sheet.v-sheet--offset.mx-auto(color='white' max-width='100%')
                    v-sparkline(:labels='times' :value='values' fill :gradient='["orange", "yellow"]' :smooth='12' line-width='2' show-labels)

        //- Overview of 5-Day Forecast
        v-row(align='center' justify='center')
            v-col(v-for='n in dates' :key='n[0]' cols='4' sm='2')
                v-tooltip(bottom)
                    template(v-slot:activator='{ on, attrs }')
                        v-card(flat v-on='on' v-bind='attrs' @click='setUpGraph(n[0])')
                            v-card-title.justify-center {{ formatDay(n[0]) }} 
                            v-card-text
                                v-row(align='center' justify='center')
                                    v-icon {{ getIcon(n[0]) }}
                                    //- v-icon.fas.fa-cloud-sun 
                                v-row(align='center' justify='center')
                                    div.my-4.text-subtitle-2 <b>{{ getTemperatureMax(n[0]) }}&#176;</b> {{ getTemperatureMin(n[0]) }}&#176;
                    div Min: {{ getTemperatureMin(n[0]) }}&#176
                    div Max: {{ getTemperatureMax(n[0]) }}&#176
                    div Mean: {{ getTemperatureMean(n[0]) }}&#176
                    div Mode: {{ getTemperatureMode(n[0]) }}


                


</template>
<script>
import { dataTracker } from '../classes/dataTracker';
import date from '../helpers/date';

export default {
	props: {
		weatherData: {
			type: Object,
			default() {
				return {};
			},
		},
	},

	data() {
		return {
			day: 'Monday',
			overviewWeather: {
				description: '',
				icon: '',
				temp: 0,
				precipitation: 0,
				humidity: 0,
				wind: 0,
			},
			icons: {
				'01d': 'fa-sun',
				'01n': 'fa-sun',
				'02d': 'fa-cloud-sun',
				'02n': 'fa-cloud-sun',
				'03d': 'fa-cloud',
				'03n': 'fa-cloud-sun',
				'04d': 'fa-cloud-meatball',
				'04n': 'fa-cloud-meatball',
				'09d': 'fa-cloud-showers-heavy',
				'09n': 'fa-cloudflare',
				'10d': 'fa-cloud-rain-sun',
				'10n': 'fa-cloudflare',
				'11d': 'fa-bolt',
				'11n': 'fa-cloudflare',
				'13d': 'fa-snowflake',
				'13n': 'fa-cloudflare',
				'50d': 'fa-smog',
				'50n': 'fa-smog',
			},
			dates: [],
			trackers: [],
			times: [],
			values: [],
		};
	},
	computed: {
		fullLocation: function () {
			let city = this.weatherData.city;
			return `${city.name}, ${city.country}`;
		},
	},
	watch: {
		weatherData: {
			handler: function (newVal) {
				if (newVal) this.setUpWeatherForecast();
			},
			immediate: true,
		},
	},
	methods: {
		setUpWeatherForecast: function () {
			this.dates = this.groupByDate();
			this.dates.forEach((value, key) => {
				let time = value.map((x) => date.formatHour(x.dt));
				let temperatures = value.map((x) => Math.round(x.main.temp));
				let weather = value.map((x) => {
					return {
						description: x.weather[0].description,
						icon: x.weather[0].icon,
						temp: x.main.temp,
						precipitation: x.pop,
						humidity: x.main.humidity,
						wind: x.wind.speed,
					};
				});
				const tracker = new dataTracker(temperatures);

				this.trackers.push({ key, time, weather, tracker });
			});

			this.setUpGraph(this.trackers[0].key);
		},
		setUpGraph: function (key) {
			this.day = date.getDay(key);
			let index = this.trackers.findIndex((x) => x.key === key);
			if (index > -1) {
				this.times = this.trackers[index].time;
				this.values = this.trackers[index].tracker.data;
				this.overviewWeather = this.trackers[index].weather[0];
			} else {
				this.times = [];
				this.values = [];
				this.overviewWeather = {
					description: '',
					icon: '',
					temp: 0,
					precipitation: 0,
					humidity: 0,
					wind: 0,
				};
			}
		},
		groupByDate: function () {
			let weatherList = this.weatherData.list;
			const map = new Map();
			weatherList.forEach((x) => {
				const key = date.getDate(x.dt);
				const group = map.get(key);
				if (!group) {
					map.set(key, [x]);
				} else {
					group.push(x);
				}
			});
			return map;
		},
		formatDay: function (timestamp) {
			return date.getDay(timestamp).substring(0, 3);
		},
		getIcon: function (key) {
			let index = this.trackers.findIndex((x) => x.key === key);
			if (index > -1 && this.icons[this.trackers[index].weather[0].icon])
				return this.icons[this.trackers[index].weather[0].icon];
			else return this.icons['01d'];
		},
		getTemperatureMin: function (key) {
			let index = this.trackers.findIndex((x) => x.key === key);
			if (index > -1) return this.trackers[index].tracker.showMin();
			else return 0;
		},
		getTemperatureMax: function (key) {
			let index = this.trackers.findIndex((x) => x.key === key);
			if (index > -1) return this.trackers[index].tracker.showMax();
			else return 0;
		},
		getTemperatureMean: function (key) {
			let index = this.trackers.findIndex((x) => x.key === key);
			if (index > -1) return this.trackers[index].tracker.showMean();
			else return 0;
		},
		getTemperatureMode: function (key) {
			let index = this.trackers.findIndex((x) => x.key === key);
			if (index > -1) {
				let modes = this.trackers[index].tracker.showMode();
				if (modes.length > 0) {
					let str = '';
					modes.forEach((x) => {
						str += x.toString() + ', ';
					});
					return str.substring(0, str.length - 2);
				}
			}
			return 'N/A';
		},
	},
};
</script>
