<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
const canonical = computed(() => `https://inkform.io${route.path}`)
useHead({
	titleTemplate: (title) => (title ? 'Inkform | ' + title : 'Inkform'),
	meta: [
		{
			name: 'description',
			content: 'Inkform is an interactive math whiteboard and note-taking app that lets you write expressions by hand and convert them to LaTeX using handwriting recognition. Graph with Desmos, solve equations, and explore math with powerful tools.',
		},
	],
	link: [
		{
			rel: 'canonical',
			href: canonical,
		},
	],
})
</script>

<template>
	<RouterView></RouterView>
</template>
