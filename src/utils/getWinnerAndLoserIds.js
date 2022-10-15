const findPlayerById = (players, id) =>
	players.find((player) => player.id === id);

export const getWinnerAndLoserIds = (gameInfo) => {
	const firstPlayerId = gameInfo.players[0];
	const secondPlayerId = gameInfo.players[1];
	const mergedPlayersWins = [
		{ id: firstPlayerId, wins: 0 },
		{ id: secondPlayerId, wins: 0 },
	];
	let winnerCount = 0;
	let winnerId = null;

	gameInfo.results.forEach((result) => {
		const first = result[firstPlayerId];
		const second = result[secondPlayerId];

		if (first.win) {
			const mergedFirstPlayer = findPlayerById(
				mergedPlayersWins,
				firstPlayerId
			);
			mergedFirstPlayer.wins = mergedFirstPlayer.wins + 1;
		}

		if (second.win) {
			const mergedSecondPlayer = findPlayerById(
				mergedPlayersWins,
				secondPlayerId
			);
			mergedSecondPlayer.wins = mergedSecondPlayer.wins + 1;
		}
	});

	mergedPlayersWins.forEach((playersData) => {
		if (playersData.wins > winnerCount) {
			winnerCount = playersData.wins;
			winnerId = playersData.id;
		}
	});

	return {
		winnerId,
		loserId: mergedPlayersWins.find((player) => player.id !== winnerId).id,
	};
};
