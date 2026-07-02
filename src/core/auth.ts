import { createPrivateKey, sign } from "node:crypto";

interface SystemJwtOptions {
  audience: string;
  subject: string;
  key: string;
}

export function signSystemJwt({ audience, subject, key }: SystemJwtOptions): string {
  const privateKey = createPrivateKey(key);
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = { iss: subject, sub: subject, aud: audience, iat: now, exp: now + 3600 };

  const headerB64 = b64url(JSON.stringify(header));
  const payloadB64 = b64url(JSON.stringify(payload));
  const toSign = `${headerB64}.${payloadB64}`;
  const sig = sign(null, Buffer.from(toSign), privateKey);

  return `${toSign}.${b64url(sig)}`;
}

function b64url(buf: string | Buffer): string {
  const b = typeof buf === "string" ? Buffer.from(buf) : buf;
  return b.toString("base64url");
}
