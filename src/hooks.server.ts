import { env } from '$env/dynamic/private';
import { sequence } from '@sveltejs/kit/hooks';
import { handleSession } from '@svelte-dev/session';
import { Auth } from '@svelte-dev/auth';
import { GitHubStrategy } from '$lib/index.js';

export const handle = sequence(
  handleSession({
    adapter: {
      name: 'cookie',
      options: {
        chunk: true
      }
    },
    session: {
      secrets: ['s3cr3t']
    },
    cookie: {
      secure: !!env.SSO_CALLBACK_URL,
      sameSite: 'lax',
      path: '/',
      httpOnly: !!env.SSO_CALLBACK_URL,
      maxAge: 604800000
    }
  }),
  async function handle({ event, resolve }) {
    const auth = new Auth(event);
    const githubStrategy = new GitHubStrategy(
      {
        clientID: env.GITHUB_ID,
        clientSecret: env.GITHUB_SECRET,
        callbackURL: env.GITHUB_CALLBACK_URL || 'http://localhost:8788/auth/github/callback'
      },
      async ({ profile }) => {
        // Get the user data from your DB or API using the tokens and profile
        return profile;
      }
    );
    auth.use(githubStrategy as any);
    event.locals.auth = auth;
    const user = event.locals.session.get('user');
    event.locals.user = user;
    const response = await resolve(event);

    return response;
  }
);
