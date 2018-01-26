interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'iF0joSMV3MhFB4Rt51qUf3mCg7urJZU0',
  domain: 'firewood.auth0.com',
  callbackURL: 'http://localhost:4200/admin'
};
