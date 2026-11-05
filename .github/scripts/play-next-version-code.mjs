// Prints the next free Android versionCode for a Play app: highest code Play has seen + 1.
// EAS tracked version codes remotely, so app.json's versionCode can't be trusted.
// Usage: PLAY_SERVICE_ACCOUNT_JSON='{...}' node play-next-version-code.mjs com.example.app
import crypto from 'node:crypto';

const pkg = process.argv[2];
const sa = JSON.parse(process.env.PLAY_SERVICE_ACCOUNT_JSON ?? '');
if (!pkg || !sa.client_email) throw new Error('Need a package name and PLAY_SERVICE_ACCOUNT_JSON');

const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({
  iss: sa.client_email,
  scope: 'https://www.googleapis.com/auth/androidpublisher',
  aud: 'https://oauth2.googleapis.com/token',
  iat: now,
  exp: now + 600,
})}`;
const jwt = `${unsigned}.${crypto.sign('RSA-SHA256', Buffer.from(unsigned), sa.private_key).toString('base64url')}`;

async function call(url, init = {}) {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${url} -> ${res.status} ${await res.text()}`);
  return res.status === 204 ? {} : res.json();
}

const { access_token } = await call('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
});
const auth = { Authorization: `Bearer ${access_token}` };
const base = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${pkg}/edits`;

const edit = await call(base, { method: 'POST', headers: auth });
try {
  const { tracks = [] } = await call(`${base}/${edit.id}/tracks`, { headers: auth });
  const { bundles = [] } = await call(`${base}/${edit.id}/bundles`, { headers: auth });
  const codes = [
    ...tracks.flatMap((t) => (t.releases ?? []).flatMap((r) => r.versionCodes ?? [])),
    ...bundles.map((b) => b.versionCode),
  ].map(Number);
  console.log(Math.max(0, ...codes) + 1);
} finally {
  await call(`${base}/${edit.id}`, { method: 'DELETE', headers: auth }).catch(() => {});
}
