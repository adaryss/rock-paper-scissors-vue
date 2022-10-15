import { LOCAL_STORAGE_KEYS } from "@/constants/localStorageKeys";
import { hasExistingStorageKey } from "./hasExistingStorageKey";

export const syncPlayersWithStorage = (players) => {
	const isKeyAlreadyExists = hasExistingStorageKey(
		LOCAL_STORAGE_KEYS.playersGamesData
	);

	if (!isKeyAlreadyExists) {
		return players;
	}

	const storagePlayersData = JSON.parse(
		localStorage.getItem(LOCAL_STORAGE_KEYS.playersGamesData)
	);
	const storageDataKeys = Object.keys(storagePlayersData);

	const syncedPlayersData = storageDataKeys.map((playerId) => {
		const player = players.find(
			(player) => player.id === parseInt(playerId)
		);
		const storagePlayerVictories = storagePlayersData[playerId].victories;
		const storagePlayerCompletedGames =
			storagePlayersData[playerId].completedGames;

		return {
			...player,
			completedGames: storagePlayerCompletedGames,
			victories: storagePlayerVictories,
		};
	});

	const allInSyncPlayers = players.map(player => {
		const hasStorageDataForCurrPlayer = storageDataKeys.includes(player.id.toString());

		if (hasStorageDataForCurrPlayer) {
			return syncedPlayersData.find(syncedPlayer => syncedPlayer.id === player.id);
		}

		return player;
	})

	return allInSyncPlayers;
};
