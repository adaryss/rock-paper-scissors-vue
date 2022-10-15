<template>
		<button type="button" @click="clearLocalStorage" class="btn btn-outline-secondary w-25 mt-2">
			Clear previous results
		</button>
</template>
<script>
import { clearLocalStorage } from '@/utils/localStorage/clearLocalStorage';

export default {
	name: 'ClearStorageButton',
	setup: () => {
		return { clearLocalStorage }
	}
}
</script>