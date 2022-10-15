<template>
	<div class="col-12 text-center">
		<span class="fw-bolder">Runs:</span>
		<span v-for="(result, index) in currentResult" :key="result.item + index"
			:class="{'text-success': result.win, 'text-danger': !result.win}">
			{{ (index === 0 ? '' : ',') }}{{' '}}{{ result.item }}</span>
	</div>
</template>
<script>
export default {
	name: 'RunsInfo',
	props: { currentResult: Array }
}
</script>