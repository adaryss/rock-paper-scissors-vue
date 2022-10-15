<template>
	<h1 class="py-3 text-center">{{ text }}</h1>
</template>

<script>
export default {
	name: 'PageTitle',
	props: {
		text: String,
	}
}
</script>
