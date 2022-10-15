import { playSingleGame } from "../game";

export const submitForm = (
	inProgressGame,
	firstSelectValue,
	secondSelectValue,
	disabledFirstSelect,
	disabledSecondSelect
) => {
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
