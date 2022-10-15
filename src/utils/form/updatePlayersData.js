import { getWinnerAndLoserIds } from "../getWinnerAndLoserIds";
import { updateStoragePlayersData } from "../localStorage";

export const updatePlayersData = (
	inProgressGame,
	players,
	firstSelectValue,
	secondSelectValue,
	winner
) => {
	const { winnerId, loserId } = getWinnerAndLoserIds(inProgressGame.value);

	const updatedData = players.value.map((player) => {
		if (player.id === parseInt(firstSelectValue.value)) {
			const storageData = { completedGames: [], victories: [] };
			const completedGames = [
				...player.completedGames,
				secondSelectValue.value,
			];
			player.completedGames = completedGames;
			storageData.completedGames = completedGames;

			if (parseInt(winnerId) === player.id) {
				const victories = [...player.victories, loserId];
				player.victories = victories;
				storageData.victories = victories;
			}

			updateStoragePlayersData(player.id, storageData);
		}

		if (player.id === parseInt(secondSelectValue.value)) {
			const storageData = { completedGames: [], victories: [] };
			const completedGames = [...player.completedGames, firstSelectValue.value];
			player.completedGames = completedGames;
			storageData.completedGames = completedGames;

			if (parseInt(winnerId) === player.id) {
				const victories = [...player.victories, loserId];
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
