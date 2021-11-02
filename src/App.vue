<template lang="pug">
v-app
	v-app-bar(app color='primary' dark)
		v-icon.mr-4.fas.fa-cloud-sun(color='white')
		v-toolbar-title Weather Forecast 
	v-main
		v-container(fluid)
			LocationSearchbar(:weatherData.sync='weathers')
			Weather(v-if='Object.entries(weathers).length > 0' :weatherData.sync='weathers')
</template>

<script>
import LocationSearchbar from './components/Searchbar';
import Weather from './components/Weather';

export default {
	name: 'App',

	components: {
		LocationSearchbar,
		Weather,
	},

	data: () => ({
		weathers: {},
	}),
};
</script>
<style>
html {
	overflow-y: auto;
}
</style>
