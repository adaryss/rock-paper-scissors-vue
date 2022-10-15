<template>
	<div class="container d-flex flex-column justify-content-between h-100">
		<div class="container">
			<Title text="Rock x Paper x Scissors" />
			<div v-if="playersState.isLoading" class="d-flex justify-content-center">
				<div class="spinner-border" role="status"></div>
			</div>
			<div v-if="playersState.error !== null" class="alert alert-danger" role="alert">
				{{ playersState.error.message }}
			</div>

			<div class="container" v-if="availablePlayers !== null && playersState.error === null">
				<GameForm v-model:firstSelectValue="firstSelectValue" v-model:secondSelectValue="secondSelectValue"
					:availablePlayers="availablePlayers"
					:submitForm="isResetFuntionEnabled ? handleResetForm : handleSubmitForm"
					:secondSelectPlayers="secondSelectPlayers"
					:disabledFirstSelect="disabledFirstSelect || noAvailablePlayers"
					:disabledSecondSelect="disabledSecondSelect || noAvailablePlayers" :disabledSubmit="disabledSubmit"
					:inProgressGame="inProgressGame" :currRunsResults="currRunsResults" :winner="winner"
					:isResetFuntionEnabled="isResetFuntionEnabled" :enableClearStorage="enableClearStorage"
					:noAvailablePlayers="noAvailablePlayers" />
			</div>
		</div>
		<div class="container d-flex flex-column align-self-end">
			<Results :players="players" />
		</div>
	</div>
</template>

<script>
import Title from "@/components/Title.vue";
import Results from "@/components/Results/Results.vue";
import GameForm from "@/components/Game/GameForm.vue";
import { getPlayers } from "@/api/getPlayers";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { formStateInitValues } from '@/constants/formStateInitValues';
import { LOCAL_STORAGE_KEYS } from '@/constants/localStorageKeys';
import { hasExistingStorageKey, syncPlayersWithStorage } from '@/utils/localStorage';
import { submitForm, resetForm, updatePlayersData } from '@/utils/form';

export default {
	name: "PageContent",
	components: { Title, Results, GameForm },
	setup: () => {
		const players = ref(null);
		const availablePlayers = ref(null);
		const firstSelectValue = ref(formStateInitValues.firstSelectValue);
		const secondSelectValue = ref(formStateInitValues.secondSelectValue);
		const secondSelectPlayers = ref(formStateInitValues.secondSelectOptions);
		const winner = ref(formStateInitValues.winner);
		const noAvailablePlayers = ref(false);

		const disabledSubmit = ref(formStateInitValues.disabledSubmit);
		const disabledFirstSelect = ref(formStateInitValues.disabledFirstSelect);
		const disabledSecondSelect = ref(formStateInitValues.disabledSecondSelect);

		const isResetFuntionEnabled = ref(formStateInitValues.isReset);
		const inProgressGame = ref({
			players: formStateInitValues.gamePlayers,
			rounds: formStateInitValues.gameRounds,
			results: formStateInitValues.gameResults,
		});
		const enableClearStorage = ref(false);
		const { playersState, loadPlayers } = getPlayers();

		// Call players API
		onMounted(async () => {
			try {
				playersState.isLoading = true;
				const res = await loadPlayers();
				const extendedPlayersData = res.data.map((player) => {
					return {
						...player,
						victories: [],
						completedGames: [],
					};
				});
				const playersSyncedWithStorage = syncPlayersWithStorage(extendedPlayersData);

				players.value = playersSyncedWithStorage;
			} catch (err) {
				playersState.error = err;
				console.error(err);
			} finally {
				playersState.isLoading = false;
				enableClearStorage.value = hasExistingStorageKey(LOCAL_STORAGE_KEYS.playersGamesData);
			}
		});

		// Keeping only players with any incomplete matches
		watchEffect(() => {
			if (players.value != null && players.value.length > 0 && inProgressGame.value.rounds === 0) {
				const numOfAllPlayers = players.value.length;
				const filteredPlayers = players.value.filter((player) => {
					return player.completedGames.length !== numOfAllPlayers - 1;
				});
				if (filteredPlayers.length === 0) {
					noAvailablePlayers.value = true;
				}
				availablePlayers.value = filteredPlayers;
			}
		});

		const currRunsResults = computed(() => {
			return {
				firstPlayer: inProgressGame.value.results.map(
					(result) => result[firstSelectValue.value]
				),
				secondPlayer: inProgressGame.value.results.map(
					(result) => result[secondSelectValue.value]
				),
			};
		});

		// Handling 3 rounds matches
		watchEffect(() => {
			if (inProgressGame.value.rounds === 3) {
				updatePlayersData(
					inProgressGame,
					players,
					firstSelectValue,
					secondSelectValue,
					winner
				);
				isResetFuntionEnabled.value = true;
				enableClearStorage.value = hasExistingStorageKey(LOCAL_STORAGE_KEYS.playersGamesData);
			}
		});

		watch(firstSelectValue, (newValue, prevValue) => {
			if (newValue !== prevValue) {
				disabledSecondSelect.value = false;
				secondSelectValue.value = formStateInitValues.secondSelectValue;

				const playersWithoutAlreadySelectedPlayer =
					availablePlayers.value.filter(
						(player) =>
							player.id !== parseInt(firstSelectValue.value)
					);

				const availablePlayersForCurrentPlayer =
					playersWithoutAlreadySelectedPlayer.filter(
						(player) =>
							!player.completedGames.includes(
								firstSelectValue.value
							)
					);

				secondSelectPlayers.value = availablePlayersForCurrentPlayer;
			}
		});

		// Handling enabled submit state based on selected values
		watchEffect(() => {
			if (secondSelectValue.value.length !== 0) {
				disabledSubmit.value = false;
			} else {
				disabledSubmit.value = true;
			}
		});

		const handleResetForm = () => {
			resetForm(
				inProgressGame,
				firstSelectValue,
				secondSelectValue,
				winner,
				disabledSubmit,
				disabledFirstSelect,
				disabledSecondSelect,
				secondSelectPlayers,
				isResetFuntionEnabled
			);
		}

		const handleSubmitForm = () => {
			submitForm(
				inProgressGame,
				firstSelectValue,
				secondSelectValue,
				disabledFirstSelect,
				disabledSecondSelect
			);
		}

		return {
			playersState,
			availablePlayers,
			handleSubmitForm,
			handleResetForm,
			firstSelectValue,
			secondSelectValue,
			secondSelectPlayers,
			disabledFirstSelect,
			disabledSecondSelect,
			disabledSubmit,
			inProgressGame,
			currRunsResults,
			winner,
			isResetFuntionEnabled,
			players,
			enableClearStorage,
			noAvailablePlayers,
		};
	},
};
</script>
