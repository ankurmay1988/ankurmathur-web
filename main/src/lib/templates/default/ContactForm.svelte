<script lang="ts">
	let name = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');
	let status = $state<'idle' | 'sending' | 'success' | 'error'>('idle');
	let errorMsg = $state('');

	function validate(): boolean {
		if (!name.trim()) { errorMsg = 'Name is required.'; return false; }
		if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errorMsg = 'Valid email is required.'; return false; }
		if (!subject.trim()) { errorMsg = 'Subject is required.'; return false; }
		if (!message.trim()) { errorMsg = 'Message is required.'; return false; }
		return true;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!validate()) return;

		status = 'sending';
		errorMsg = '';

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, subject, message, _gotcha: '' })
			});

			if (res.ok) {
				status = 'success';
				name = ''; email = ''; subject = ''; message = '';
			} else {
				const data = await res.json();
				status = 'error';
				errorMsg = data.error || 'Something went wrong. Please try again.';
			}
		} catch {
			status = 'error';
			errorMsg = 'Network error. Please try again later.';
		}
	}
</script>

<form class="contact-form" onsubmit={handleSubmit}>
	{#if status === 'success'}
		<div class="alert alert-success">Message sent successfully! I'll get back to you soon.</div>
	{/if}

	{#if status === 'error'}
		<div class="alert alert-error">{errorMsg}</div>
	{/if}

	<!-- Honeypot -->
	<input type="text" name="_gotcha" class="honeypot" tabindex="-1" autocomplete="off" />

	<div class="form-group">
		<label for="name" class="form-label">Name <span class="required">*</span></label>
		<input id="name" type="text" class="form-input" bind:value={name} required placeholder="Your name" />
	</div>

	<div class="form-group">
		<label for="email" class="form-label">Email <span class="required">*</span></label>
		<input id="email" type="email" class="form-input" bind:value={email} required placeholder="your@email.com" />
	</div>

	<div class="form-group">
		<label for="subject" class="form-label">Subject <span class="required">*</span></label>
		<input id="subject" type="text" class="form-input" bind:value={subject} required placeholder="What's this about?" />
	</div>

	<div class="form-group">
		<label for="message" class="form-label">Message <span class="required">*</span></label>
		<textarea id="message" class="form-input form-textarea" bind:value={message} required rows="5" placeholder="Your message..."></textarea>
	</div>

	<button type="submit" class="btn btn-primary" disabled={status === 'sending'}>
		{status === 'sending' ? 'Sending...' : 'Send Message'}
	</button>
</form>

<style>
	.honeypot { display: none; }
</style>
