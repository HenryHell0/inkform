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
		<div class="container">
			<h1>Give Feedback</h1>
			<div class="text">I appreciate any and all feedback!</div>
			<hr class="line-1"/>

			<div class="form">
				<input v-model="data.userInfo" type="text" placeholder="Name or Email" />
				<textarea
					v-model="data.message"
					class="message"
					type="text"
					placeholder="Your feedback"
				></textarea>
			</div>

			<hr class="line-2"/>

			<div class="text">
				Or, contact me at
				<a href="mailto:henry@inkform.io?subject=Inkform%20Feedback">henry@inkform.io</a>
			</div>
			<button @click="handleSubmit"><b>Send</b></button>
		</div>
	</FullscreenDialog>
</template>
<style scoped>
.container {
	margin: 0px;
	margin-top: 30px;
	margin-bottom: 30px;
	font-size: 110%;
}

h1 {
	margin: 0px;
}

hr {
	width: 80%;
	height: 0px;
	border: 1px solid var(--color-gray-400);
	margin-top: 20px;
	margin-bottom: 20px;
}

.line-1 {
	margin-top: 2px;

}

.line-2 {
	margin-bottom: 2px;
}

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
	height: 2.3em;
	margin-top: 10px;

	color: white;

	transition: transform 0.2s ease;
}

button:hover {
	transform: scale(1.05);
}

button:active {
	transform: scale(0.9);
}

.text {
	font-size: 90%;
	color: var(--color-zinc-700);
}
</style>
