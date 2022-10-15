<template>
	<form class="form-control" @submit.prevent="submitForm">
		<div class="row">
			<div class="col-12 col-md-5 p-4 d-flex justify-content-center align-items-center flex-column">
				<PlayerSelect :players="availablePlayers" :value="firstSelectValue"
					@input="$emit('update:firstSelectValue', $event.target.value)"
					:disabledSelect="disabledFirstSelect" />
				<RunsInfo :currentResult="currRunsResults.firstPlayer" />
				<ResultBadge :winner="winner" :win="firstSelectValue === winner" />
			</div>
			<div class="col-12 col-md-2 d-flex justify-content-center align-items-center fw-bold">
				VS
			</div>
			<div class="col-12 col-md-5 p-4 d-flex justify-content-center flex-column">
				<PlayerSelect :players="secondSelectPlayers" :value="secondSelectValue"
					@input="$emit('update:secondSelectValue', $event.target.value)"
					:disabledSelect="disabledSecondSelect" />
				<RunsInfo :currentResult="currRunsResults.secondPlayer" />
				<ResultBadge :winner="winner" :win="secondSelectValue === winner" />
			</div>
			<div class="row justify-content-center my-4">
				<button type="submit" class="btn btn-dark w-50" :disabled="disabledSubmit">
					{{ isResetFuntionEnabled ? 'Choose new players' : 'Play'}}
				</button>
			</div>
		</div>
	</form>
	<div v-if="enableClearStorage" class="row justify-content-center my-2">
		<ClearStorageButton />
	</div>
</template>

<script>
import PlayerSelect from "./PlayerSelect.vue";
import RunsInfo from "./RunsInfo.vue";
import ResultBadge from "./ResultBadge.vue";
import ClearStorageButton from "./ClearStorageButton.vue";

export default {
	name: "GameForm",
	props: {
		availablePlayers: Array,
		submitForm: Function,
		secondSelectPlayers: Array,
		disabledFirstSelect: Boolean,
		disabledSecondSelect: Boolean,
		disabledSubmit: Boolean,
		inProgressGame: Object,
		currRunsResults: Object,
		firstSelectValue: String,
		secondSelectValue: String,
		winner: String,
		isResetFuntionEnabled: Boolean,
		enableClearStorage: Boolean,
	},
	components: { PlayerSelect, RunsInfo, ResultBadge, ClearStorageButton },
};
</script>
