import config = require('tiny-conf');
import btoa = require('./btoa');

// augment tiny-conf with some utility methods:
export function token(): string {
  const token = config.get('user.access_token');
  if (token) {
    return token;
  }
  throw new Error('Unable to find a valid token');
}

export function isTokenExpired() {
  const user = config.get('user');
  return !user || !user.access_token || !user.expires_at || user.expires_at <= Date.now();
}

export function baseUrl() {
  const conf = config.get('registry');
  return `${conf.ssl ? 'https' : 'http'}://${conf.host}:${conf.port}`;
}

export function clientAuthorization() {
  const clientId = config.get('registry.oauth.client_id');
  const clientSecret = config.get('registry.oauth.client_secret');
  return btoa(`${clientId}:${clientSecret}`);
}

export default config;
