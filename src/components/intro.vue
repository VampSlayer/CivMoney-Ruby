<template>
	<div class="container">
		<div class="row text-center">
			<div class="col">
				<img src="https://i.imgur.com/pTFJ7Rg.png" />
			</div>
		</div>
		<div class="row text-center">
			<div class="col">
				<h2 class="mt-3">
					Welcome to CivMoney
				</h2>
				<p>To get started add your monthly Incomes and
					Expense here or simply create Sample Data. Once added the visuals begin!
				</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Intro",
}
</script>

<style scoped>
img {
	width: 250px;
}

h2 {
	color: var(--cm-input-text-color);
	text-decoration: underline;
}

p {
	font-size: 1.3em;
	color: var(--cm-input-text-color);
	font-family: "Raleway" !important;
}
</style>
