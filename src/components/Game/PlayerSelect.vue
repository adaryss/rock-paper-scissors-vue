<template>
	<div class="input-group">
		<SelectIcon />
		<select :value="value" @input="$emit('update:value', $event.target.value)" class="form-select"
			:class="{ 'cursor-block': disabledSelect }" :disabled="disabledSelect">
			<option value="" disabled>Choose player...</option>
			<option v-for="player in players" :value="player.id" :key="player.id">{{player.name}}</option>
		</select>
	</div>
</template>
<script>
import SelectIcon from './SelectIcon.vue';

export default {
	name: "PlayerSelect",
	props: { players: Array, value: String, disabledSelect: Boolean, },
	components: { SelectIcon },
}
</script>

<style>
.cursor-block {
	cursor: not-allowed;
	pointer-events: all !important;
}
</style>