<template>
	<div class="row p-2 bg-secondary rounded"
		:class="{'bg-secondary': index % 2 === 0, 'text-light': index % 2 === 0, 'text-light': index % 2 === 0, 'bg-light': index % 2 !== 0}">
		<div class="col-12 col-md-1 text-center">{{ index + 1 }}.</div>
		<div class="col-12 col-md-6 text-center text-md-start">{{ player.name }} from {{ player.address.city }}</div>
		<div class="col-12 col-md-5 text-center">Won <span class="fw-bolder">{{ player.victories.length }} / {{ player.completedGames.length }}</span> game(s)</div>
	</div>
</template>


<script>
export default {
	name: 'ResultItem',
	props: { player: Object, index: Number }
}
</script>
