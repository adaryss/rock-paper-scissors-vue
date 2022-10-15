import { getGameItems } from "./getGameItems";

export const playSingleGame = () => {
	const { firstPlayer, secondPlayer } = getGameItems();

	return {
		firstPlayerItem: {
			...firstPlayer,
			winner: firstPlayer.beats === secondPlayer.name,
		},
		secondPlayerItem: {
			...secondPlayer,
			winner: secondPlayer.beats === firstPlayer.name,
		},
	};
};
