<template>
	<Title text="Rock x Paper x Scissors" />
	<Game />
	<Results />
</template>

<script>
import Title from './Title.vue';
import Game from './Game/Game.vue';
import Results from './Results/Results.vue';

export default {
    name: "PageContent",
    components: { Title, Game, Results }
}
</script>

