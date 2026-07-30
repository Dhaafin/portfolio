const encoder = new TextEncoder();

async function getCryptoKey(secret) {
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function base64UrlEncode(str) {
  // Edge runtime safe base64url encoding
  const base64 = btoa(str);
  return base64
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str) {
  // Edge runtime safe base64url decoding
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

// Signs a JWT payload using HMAC SHA-256 (Edge compatible)
export async function signJWT(payload, secret, expiresInSeconds = 7 * 24 * 3600) {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload = { ...payload, exp };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const message = `${encodedHeader}.${encodedPayload}`;
  const key = await getCryptoKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message)
  );

  const signatureArray = new Uint8Array(signatureBuffer);
  let signatureString = "";
  for (let i = 0; i < signatureArray.length; i++) {
    signatureString += String.fromCharCode(signatureArray[i]);
  }
  
  const encodedSignature = base64UrlEncode(signatureString);
  return `${message}.${encodedSignature}`;
}

// Verifies a JWT token using HMAC SHA-256 (Edge compatible)
export async function verifyJWT(token, secret) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const message = `${encodedHeader}.${encodedPayload}`;
    const key = await getCryptoKey(secret);

    const decodedSignature = base64UrlDecode(signature);
    const signatureBytes = new Uint8Array(decodedSignature.length);
    for (let i = 0; i < decodedSignature.length; i++) {
      signatureBytes[i] = decodedSignature.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      encoder.encode(message)
    );

    if (!isValid) return null;

    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null; // Token expired
    }

    return payload;
  } catch {
    return null;
  }
}

// PBKDF2 Salted Hashing helper (Standard High-Security)
export async function hashPassword(password, salt) {
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-256"
    },
    passwordKey,
    256 // 256 bits = 32 bytes
  );

  return Array.from(new Uint8Array(derivedBits))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
