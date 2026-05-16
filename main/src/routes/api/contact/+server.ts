import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = false;

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const body = await request.json();
		const { name, email, subject, message, _gotcha } = body;

		// Honeypot check
		if (_gotcha) {
			// Bot filled hidden field — silently accept but don't send
			return json({ ok: true });
		}

		// Validate required fields
		if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
			return json({ error: 'All fields are required.' }, { status: 400 });
		}

		// Validate email format
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return json({ error: 'Invalid email address.' }, { status: 400 });
		}

		// Send email via Cloudflare sendEmail binding
		if (platform?.env?.SEND_EMAIL) {
			// The sendEmail binding accepts a SendEmail object
			// See: https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/
			const sendEmail = platform.env.SEND_EMAIL as {
				send: (msg: { to: string; from: string; subject: string; html?: string; text?: string }) => Promise<unknown>;
			};

			await sendEmail.send({
				to: 'ankurakaet@gmail.com', // Sends to yourself
				from: email, // The visitor's email as reply-to
				subject: `[Contact] ${subject}`,
				text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
			});
		} else {
			// Fallback when no sendEmail binding (local dev) — log instead
			console.log('Contact form submission (no sendEmail binding):', { name, email, subject, message });
		}

		return json({ ok: true });
	} catch (err) {
		console.error('Contact form error:', err);
		return json({ error: 'Failed to send message. Please try again later.' }, { status: 500 });
	}
};
