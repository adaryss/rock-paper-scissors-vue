<template>
	<div class="container mb-4">
		<h2 class="py-3 text-center">Score Board</h2>
		<div v-if="sortedPlayers.length > 0" class="container">
			<ResultsItem v-for="(player, index) in sortedPlayers" :key="player.id" :player="player" :index="index" />
		</div>
		<div v-else class="text-center fst-italic pb-4">Score board is empty..</div>
	</div>
</template>

<script>
import { computed, toRef } from "vue";
import ResultsItem from "./ResultsItem.vue";

export default {
	name: "ResultsSection",
	props: {
		players: Array,
	},
	components: { ResultsItem },
	setup: (props) => {
		const players = toRef(props, "players");
		const sortedPlayers = computed(() => {
			if (players.value && players.value.length > 0) {
				const playersWithAnyMatches = players.value.filter((player) => player.victories.length > 0);
				return playersWithAnyMatches.sort((playerA, playerB) => {
					return (playerB.victories.length - playerA.victories.length);
				});
			}
			return [];
		});

		return { sortedPlayers };
	},
};
</script>
