// new Unit().payments
import * as auth0 from 'auth0';

export class Auth0MangementProvider extends auth0.ManagementClient {
  constructor() {
    super({
      domain: process.env.AUTH_DOMAIN,
      clientId: process.env.AUTH_CLIENT,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      scope: 'read:users update:users',
      audience: `https://${process.env.AUTH_TENENT}.auth0.com/api/v2/`,
      tokenProvider: {
        enableCache: true,
        cacheTTLInSeconds: 10,
      },
    });
  }
}
