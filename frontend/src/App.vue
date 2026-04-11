<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'

onMounted(() => {
	document.title = 'Inkform'
})
</script>

<template>
	<RouterView></RouterView>
</template>
