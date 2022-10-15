import { formStateInitValues } from "@/constants/formStateInitValues";

export const resetForm = (
	inProgressGame,
	firstSelectValue,
	secondSelectValue,
	winner,
	disabledSubmit,
	disabledFirstSelect,
	disabledSecondSelect,
	secondSelectPlayers,
	isResetFuntionEnabled
) => {
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
};
