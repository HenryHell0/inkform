<script setup lang="ts">
import { reactive } from 'vue'
import FullscreenDialog from '@/components/ui/FullscreenDialog.vue'
import { useRouteDialogs } from '@/composables/useRouteDialogs'
import { useHead } from '@unhead/vue'
const { close } = useRouteDialogs()
const API_BASE = import.meta.env.VITE_API_BASE

useHead({
	title: 'Feedback',
	meta: [
		{
			name: 'description',
			content: 'Give feedback on Inkform. I appreciate all feedback whether positive or negative and try to improve Inkform every day. Give feedback on uptime, tooling, UI, or general suggestions!',
		},
	],
})

const data = reactive({
	userInfo: '',
	message: '',
})

function handleSubmit() {
	const body = JSON.stringify(data)

	console.log(`Sending feedback: \n ${body}`)

	fetch(`${API_BASE}/feedback`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body,
	})

	alert('Yay! Thanks so much!')
	close()
}
</script>
<template>
	<FullscreenDialog @close="close">
		<h1>Give Feedback!</h1>

		<div class="form">
			<input v-model="data.userInfo" type="text" placeholder="Name or Email" />
			<textarea v-model="data.message" class="message" type="text" placeholder="Your feedback"></textarea>
			<button @click="handleSubmit"><b>Send</b></button>
		</div>
	</FullscreenDialog>
</template>
<style scoped>
.form {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	gap: 5px;
}

.message {
	resize: none;
	overflow: hidden;
	field-sizing: content;

	width: 60%;
	min-height: 8em;
}

button {
	background-color: var(--color-submit);
	border: none;
	border-radius: 5px;
	width: 10em;
	height: 2em;

	color: white;

	transition: transform 0.2s ease;
}

button:hover {
	transform: scale(1.05);
}

button:active {
	transform: scale(0.9);
}
</style>
