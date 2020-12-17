<template>
	<span :class="{ on: status }" @click="toggle">
		<transition name="fade-fast" mode="out-in">
			<p :key="status">{{ status ? onText : offText }}</p>
		</transition>
		<span class="toggle-slider">
			<svg
				class="toggle-switch"
				viewBox="0 0 100 100"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle cx="50" cy="50" r="50"></circle>
			</svg>
		</span>
	</span>
</template>

<script>
export default {
	name: "Toggle",
	props: {
		onText: String,
		offText: String,
		transaction: Object,
	},
	data() {
		return {
			status: true,
		}
	},
	methods: {
		toggle() {
			this.status = !this.status
			if (this.transaction) this.transaction.income = this.status
			this.$emit("toggle", this.status)
		},
	},
}
</script>

<style scoped>
.toggle-slider {
	height: 20px;
	width: 33px;
	position: relative;
	float: left;
	background: var(--cm-background);
	border-radius: 30px;
}

.toggle-switch {
	height: 12px;
	width: 12px;
	position: relative;
	top: 4px;
	left: 3px;
	display: inline-block;
	transform-origin: 50% 50%;
	transition: transform 0.15s ease;
	vertical-align: top;
}

.toggle-switch circle {
	fill: var(--cm-year-line-color);
	opacity: 1;
}

.on .toggle-slider {
	background: var(--cm-background) !important;
}

.on.has-toggle:hover .toggle-slider {
	background: var(--cm-background) !important;
}

.on .toggle-switch {
	transform: translateX(14px);
}

.on .toggle-switch circle {
	opacity: 1 !important;
}
</style>
