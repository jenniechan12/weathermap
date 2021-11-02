export class dataTracker {
	constructor(data) {
		this.data = data;
	}

	// Records a new value into tracker
	insert(value) {
		this.data.push(value);
	}

	// Show the minimum value from the recorded tracker values
	showMin() {
		return Math.min(...this.data);
	}

	// Show the maximum value from the recorded tracker values
	showMax() {
		return Math.max(...this.data);
	}

	// Show the mean value from the recorded tracker values
	showMean() {
		const add = (sum, val) => sum + val;
		let total = this.data.reduce(add, 0);
		let mean = total / this.data.length;
		return mean.toFixed(2);
	}

	// Show the mode value from the recorded tracker values
	showMode() {
		let map = new Map();
		let maxCount = 0;
		this.data.forEach((temperature) => {
			let group = map.get(temperature);
			let value = group;
			if (!group) map.set(temperature, 1);
			else {
				map.set(temperature, value + 1);
				let count = map.get(temperature);
				if (count > maxCount) maxCount = count;
			}
		});

		let array = Array.from(map, ([key, value]) => ({ key, value }));
		let mode = array.filter((x) => x.value === maxCount);
		return mode.map((x) => x.key);
	}
}
