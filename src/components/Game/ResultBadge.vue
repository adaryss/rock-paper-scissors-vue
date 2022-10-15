<template>
	<div v-if="winner" class="col-12 text-center">
		<span class="badge" :class="{'text-bg-success': win, 'text-bg-danger': !win}">
			{{ win ? 'Winner' : 'Loser' }}
		</span>
	</div>
</template>
<script>
export default {
	name: 'ResultBadge',
	props: { win: Boolean, winner: String }
}
</script>
