<template>
	<Title text="Rock x Paper x Scissors" />
	<div v-if="playersState.isLoading" class="d-flex justify-content-center">
		<div class="spinner-border" role="status"></div>
	</div>
	<div v-if="playersState.error !== null" class="alert alert-danger" role="alert">
		{{ playersState.error.message }}
	</div>
	<div v-if="players !== null && playersState.error === null">
		<Game />
		<Results />
	</div>
</template>

<script>
import Title from './Title.vue';
import Game from './Game/Game.vue';
import Results from './Results/Results.vue';
import { getPlayers } from '@/api/getPlayers';
import { onMounted, ref } from 'vue';

export default {
	name: "PageContent",
	components: { Title, Game, Results },
	setup: () => {
		const players = ref(null)
		const { playersState, loadPlayers } = getPlayers();

		onMounted(async () => {
			try {
				playersState.isLoading = true;
				const res = await loadPlayers();
				players.value = res.data;
			} catch (err) {
				playersState.error = err;
				console.error(err);
			} finally {
				playersState.isLoading = false;
			}
		})

		return { playersState, players }
	}

}
</script>

