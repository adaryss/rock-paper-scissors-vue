import { gameItems } from "./gameItems";

const MAX_COUNT = 3;
const getRandomGameItemIndex = (max) =>
	Math.floor(Math.random() * max);

export const getGameItems = () => {
	const arrayOfIdx = Array.from(Array(MAX_COUNT).keys());
	const firstItemIndex = getRandomGameItemIndex(MAX_COUNT);
	const secondItemPosition = getRandomGameItemIndex(MAX_COUNT - 1);
	const arrayWihoutFirstItem = arrayOfIdx.filter(number => number !== firstItemIndex);
	const secondItemIndex = arrayWihoutFirstItem[secondItemPosition];

	return {
		firstPlayer: gameItems[firstItemIndex],
		secondPlayer: gameItems[secondItemIndex],
	};
};
