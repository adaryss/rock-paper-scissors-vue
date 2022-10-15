export const hasExistingStorageKey = (key) => {
	return Boolean(localStorage.getItem(key));
}