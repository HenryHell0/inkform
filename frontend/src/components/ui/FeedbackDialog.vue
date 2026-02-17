<script setup lang="ts">
import { useSessionStore } from '@/stores/useSessionStore'
import { reactive } from 'vue'
const sessionStore = useSessionStore()
const API_BASE = import.meta.env.VITE_API_BASE

const data = reactive({
	userInfo: "",
	message: ""
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

	alert("Yay! Thanks so much!")
	sessionStore.inputMode = "idle"
}
</script>
<template>
	<div v-show="sessionStore.inputMode == 'feedback'" class="backdrop">
		<div class="container" @mouseup.stop >
			<h1>Give Feedback!</h1>


			<div class="form">
				<input v-model="data.userInfo" type="text" placeholder="Name or Email" />
				<textarea v-model="data.message" class="message" type="text" placeholder="Your feedback"></textarea>
				<button @click="handleSubmit"><b>Send</b></button>
			</div>
		</div>
	</div>
</template>
<style>
.backdrop {
	z-index: 1000;

	position: absolute;
	left: 0px;
	top: 0px;
	width: 100%;
	height: 100%;
	display: flex;

	justify-content: center;
	align-items: center;

	backdrop-filter: blur(3px);
	background-color: rgba(177, 177, 177, 0.5);
}

.container {
	width: 400px;
	min-width: 10em;
	border: 2px solid var(--color-zinc-500);
	border-radius: 5px;
	background: var(--color-bg-0);

	text-align: center;
	padding: 20px;
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
	height: 2em;

	color: white;
}
</style>
``
