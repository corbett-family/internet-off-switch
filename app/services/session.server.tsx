import { createCookie, createFileSessionStorage } from '@remix-run/node'; // or cloudflare/deno
import { appConfig } from '~/config/app.config';

const sessionCookie = createCookie('__session', {
  secrets: [appConfig.cookie.secret],
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 30, // 30 days
  //sameSite: true,
  sameSite: 'lax',
});

export default createFileSessionStorage({
  dir: `${appConfig.storage.basePath}/sessions`,
  cookie: sessionCookie,
});
