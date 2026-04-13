<script setup lang="ts">
import FullscreenDialog from '@/components/ui/FullscreenDialog.vue'
import { useRouteDialogs } from '@/composables/useRouteDialogs'
import { useHead } from '@unhead/vue'

const { close } = useRouteDialogs()

useHead({
	title: 'About',
	meta: [
		{
			name: 'description',
			content: 'Learn more about Inkform, an interactive math whiteboard with handwriting recognition input, making writing and solving math feel natural. Inkform aims to help both student and teachers in presenting and understanding math using advanced mathematics tools like Desmos.',
		},
	],
})
</script>

<template>
	<FullscreenDialog class="dialog" @close="close">
		<div class="about">
			<header class="header">
				<h1>About Inkform</h1>
				<p class="tagline">
					A digital whiteboard designed to make writing and solving math feel natural.
				</p>
			</header>

			<section>
				<p>
					Inkform is a digital whiteboard that uses handwriting recognition designed to assist in
					both teaching and learning math.
				</p>

				<p>
					It merges handwriting recognition with digital mathematics tools so that users can write,
					manipulate, and solve mathematical problems more naturally. Inkform puts handwriting and
					solving in one place, accelerating how quickly a problem can be worked out.
				</p>
			</section>

			<section>
				<p>
					I aim to someday help teachers comply with ADA guidelines that require the digitization of
					mathematical expressions or graphs.
				</p>

				<p>
					Inkform is in its infancy as of writing this, but I work on it daily with the goal of
					eventually making it available on iOS, Android, and potentially implementing it in schools
					and universities.
				</p>
			</section>

			<section class="features">
				<h3>Currently working on</h3>

				<ul>
					<li>Converting expressions back to handwriting ✍️</li>

					<li>
						Editable expressions with
						<a href="http://mathquill.com/" target="_blank">MathQuill</a>
						✏️
					</li>

					<li>
						Solving with
						<a href="https://mathjs.org/" target="_blank">MathJS</a>
						and
						<a href="https://nerdamer.com/" target="_blank">Nerdamer</a>
					</li>

					<li>Importing and recognition of images 🖼️</li>

					<li>Exporting whiteboards and expressions 📦</li>
				</ul>
			</section>

			<section>
				<p>
					I’m aiming to make something easy to use, fun, and helpful for both students and teachers.
				</p>

				<p>
					Check out the
					<a href="https://github.com/henryhell0/inkform" target="_blank">GitHub</a>! Feedback,
					suggestions, and contributions are always welcome.
				</p>

				<p class="enjoy">Enjoy! 🎉</p>
			</section>

			<footer class="legal">
				<p>
					&copy; 2026 Henry Holton - Inkform&trade;<br />
					Licensed under AGPL-3.0
				</p>
			</footer>
		</div>
	</FullscreenDialog>
</template>

<style scoped>
/* make internal dialog bigger */
.dialog > * {
	width: 40em;
}

.about {
	max-width: 40em;
	text-align: center;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	padding: 0px 1.5em;

	/* adds the scrollability */
	max-height: 80vh;
	overflow-y: auto;
}

.header h1 {
	margin-bottom: -1rem;
}

.tagline {
	font-size: 0.9rem;
	color: var(--color-zinc-500);
}

section {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.features h3 {
	margin-bottom: 0rem;
}

ul {
	list-style: none;
	padding: 0;
	margin: 0;
	margin-bottom: 0.2em;

	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

li {
	background: var(--color-bg-1);
	padding: 6px 10px;
	margin: 0px 5em;
	border-radius: 4px;
	border: 1px solid var(--color-zinc-400);
}

.footer {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.enjoy {
	font-weight: bold;
}

.legal {
	font-size: 75%;
	color: var(--color-zinc-600);
}
</style>
