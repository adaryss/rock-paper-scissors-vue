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
					:availablePlayers="availablePlayers" :submitForm="isResetFuntionEnabled ? resetForm : submitForm"
					:secondSelectPlayers="secondSelectPlayers" :disabledFirstSelect="disabledFirstSelect"
					:disabledSecondSelect="disabledSecondSelect" :disabledSubmit="disabledSubmit"
					:inProgressGame="inProgressGame" :currRunsResults="currRunsResults" :winner="winner"
					:isResetFuntionEnabled="isResetFuntionEnabled" :enableClearStorage="enableClearStorage" />
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
import { playSingleGame } from "@/utils/game";
import { getWinnerAndLoserIds } from '@/utils/getWinnerAndLoserIds';
import { formStateInitValues } from '@/constants/formStateInitValues';
import { LOCAL_STORAGE_KEYS } from '@/constants/localStorageKeys';
import { hasExistingStorageKey, updateStoragePlayersData, syncPlayersWithStorage } from '@/utils/localStorage';

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

				availablePlayers.value = filteredPlayers;
			}
		});

		const submitForm = () => {
			const results = playSingleGame();

			inProgressGame.value.results = [
				...inProgressGame.value.results,
				{
					[firstSelectValue.value]: {
						item: results.firstPlayerItem.name,
						win: results.firstPlayerItem.winner,
					},
					[secondSelectValue.value]: {
						item: results.secondPlayerItem.name,
						win: results.secondPlayerItem.winner,
					},
				},
			];

			if (inProgressGame.value.rounds === 0) {
				disabledFirstSelect.value = true;
				disabledSecondSelect.value = true;

				inProgressGame.value.players = [
					firstSelectValue.value,
					secondSelectValue.value,
				];
				inProgressGame.value.rounds = 1;
			} else {
				inProgressGame.value.rounds++;
			}

		};

		const resetForm = () => {
			inProgressGame.value.players = formStateInitValues.gamePlayers;
			inProgressGame.value.rounds = formStateInitValues.gameRounds;
			inProgressGame.value.results = formStateInitValues.gameResults;

			firstSelectValue.value = formStateInitValues.firstSelectValue;
			secondSelectValue.value = formStateInitValues.secondSelectValue;
			winner.value = formStateInitValues.winner;

			disabledSubmit.value = formStateInitValues.disabledSubmit;
			disabledFirstSelect.value = formStateInitValues.disabledFirstSelect;
			disabledSecondSelect.value = formStateInitValues.disabledSecondSelect;
			secondSelectPlayers.value = formStateInitValues.secondSelectOptions;

			isResetFuntionEnabled.value = formStateInitValues.isReset;
		}

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

		const updatePlayersData = (gameInfo, firstSelectValue, secondSelectValue) => {
			const { winnerId, loserId } = getWinnerAndLoserIds(gameInfo);

			const updatedData = players.value.map((player) => {
				if (player.id === parseInt(firstSelectValue)) {
					const storageData = { completedGames: [], victories: [] };
					const completedGames = [
						...player.completedGames,
						secondSelectValue,
					];
					player.completedGames = completedGames;
					storageData.completedGames = completedGames;

					if (parseInt(winnerId) === player.id) {
						const victories = [
							...player.victories,
							loserId,
						];
						player.victories = victories;
						storageData.victories = victories;
					}

					updateStoragePlayersData(player.id, storageData);
				}

				if (player.id === parseInt(secondSelectValue)) {
					const storageData = { completedGames: [], victories: [] };
					const completedGames = [
						...player.completedGames,
						firstSelectValue,
					];
					player.completedGames = completedGames;
					storageData.completedGames = completedGames;

					if (parseInt(winnerId) === player.id) {
						const victories = [
							...player.victories,
							loserId,
						];
						player.victories = victories;
						storageData.victories = victories;
					}

					updateStoragePlayersData(player.id, storageData);
				}
				return player;
			});

			players.value = updatedData;
			winner.value = winnerId;
		};

		// Handling 3 rounds matches
		watchEffect(() => {
			if (inProgressGame.value.rounds === 3) {
				updatePlayersData(
					inProgressGame.value,
					firstSelectValue.value,
					secondSelectValue.value
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

		return {
			playersState,
			availablePlayers,
			submitForm,
			resetForm,
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
		};
	},
};
</script>
