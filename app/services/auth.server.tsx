import { GoogleStrategy } from 'remix-auth-google';
import { Authenticator } from 'remix-auth';
import sessionStorage from './session.server';
import { User } from '~/models/User';
import { appConfig } from '~/config/app.config';

const authenticator = new Authenticator<User>(sessionStorage, { sessionKey: '__session' });

let googleStrategy = new GoogleStrategy<User>(
  {
    clientID: appConfig.google.clientID,
    clientSecret: appConfig.google.clientSecret,
    callbackURL: `${appConfig.baseUrl}/auth/google/callback`,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const user: User = {
      email: profile.emails?.[0].value,
      avatar: profile.photos?.[0].value,
      name: profile.displayName,
    };
    if (appConfig.allowedEmails.findIndex((email) => email === user.email) === -1) {
      throw new Error(`User ${user.email} is not allowed to access this application`);
    }
    return user;
  },
);

authenticator.use(googleStrategy);

export { authenticator };
