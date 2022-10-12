import axios from "axios";
import { reactive } from "vue";

const PLAYERS_URL = "https://jsonplaceholder.typicode.com/users";

export const getPlayers = () => {
	const playersState = reactive({ isLoading: false, error: null });
	const loadPlayers = () => axios.get(PLAYERS_URL);

	return { playersState, loadPlayers };
};
