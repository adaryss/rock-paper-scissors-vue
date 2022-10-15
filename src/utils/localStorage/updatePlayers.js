import { LOCAL_STORAGE_KEYS } from "@/constants/localStorageKeys";
import { hasExistingStorageKey } from "./hasExistingStorageKey";

export const updateStoragePlayersData = (playerId, updatedData) => {
	const isKeyAlreadyExists = hasExistingStorageKey(
		LOCAL_STORAGE_KEYS.playersGamesData
	);

	if (!isKeyAlreadyExists) {
		const storageItem = JSON.stringify({ [playerId]: updatedData });
		localStorage.setItem(LOCAL_STORAGE_KEYS.playersGamesData, storageItem);
	}

	if (isKeyAlreadyExists) {
		const storagePlayersData = JSON.parse(
			localStorage.getItem(LOCAL_STORAGE_KEYS.playersGamesData)
		);
		const userDataExists = Boolean(storagePlayersData[playerId]);

		if (userDataExists) {
			storagePlayersData[playerId] = updatedData;
			localStorage.setItem(
				LOCAL_STORAGE_KEYS.playersGamesData,
				JSON.stringify(storagePlayersData)
			);
		}

		if (!userDataExists) {
			const extendedStorageData = {
				...storagePlayersData,
				[playerId]: updatedData,
			};
			localStorage.setItem(
				LOCAL_STORAGE_KEYS.playersGamesData,
				JSON.stringify(extendedStorageData)
			);
		}
	}
};
