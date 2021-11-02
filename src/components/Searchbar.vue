<template lang="pug">
div
	//- Search Bar
	v-row(align='center' justify='center' no-gutters)
		v-col#LocationSearchBar(cols='11' sm='8' md='6' )
			v-text-field(v-model='location' :loading='isLoading' placeholder='Search Location by City' dense filled rounded )
				template(v-slot:append)
					v-btn.ma-0(rounded depressed  color='primary' @click='searchWeatherByLocation') Search
	
	//- Error Message for Invalid Search Bar
	v-row(v-if='showError' align='center' justify='center' no-gutters)
		v-col(cols='11' sm='8' md='6' )
			v-alert(border='bottom' dense icon='fa-exclamation-triangle' prominent shaped type='error' transition='scroll-x-transition') {{ errorMessage }}
</template>
<script>
import { fetch5DayForcastByCity } from '../api/weathermap';

export default {
	name: 'LocationSearchBar',
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
			location: '',
			isLoading: false,
			errorMessage:
				'The city that you have entered was either invalid or not found. Please enter try again!',
			showError: false,
		};
	},
	beforeMount() {},
	methods: {
		/**************************************************************
		 * searchWeatherByLocation Function - search weather by
		 * city (this.location)
		 * 1) If valid, update the weatherData Card
		 * 2) Else, show error message
		 *************************************************************/
		searchWeatherByLocation: async function () {
			this.showError = false;
			this.isLoading = true;
			let result = await fetch5DayForcastByCity(this.location);
			if (result) this.$emit('update:weatherData', result);
			else {
				this.showError = true;
				this.$emit('update:weatherData', {});
			}
			this.isLoading = false;
		},
	},
};
</script>
<style>
#LocationSearchBar > div > div > .v-input__slot {
	padding-right: 0;
}
#LocationSearchBar > div > div > .v-input__slot > .v-input__append-inner {
	margin: auto;
}
</style>
