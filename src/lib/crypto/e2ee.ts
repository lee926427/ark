import type { EncryptedPayload } from './types'

// PBKDF2 configuration
const ITERATIONS = 100000
const HASH_ALGO = 'SHA-256'

// AES-GCM configuration
const AES_ALGO = 'AES-GCM'
const KEY_LENGTH_BITS = 256
const IV_LENGTH_BYTES = 12 // 96 bits for GCM
const SALT_LENGTH_BYTES = 16

/**
 * Converts an ArrayBuffer to a Base64 encoded string.
 */
function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

/**
 * Converts a Base64 encoded string to an ArrayBuffer.
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryStr = atob(base64)
  const len = binaryStr.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i)
  }
  return bytes.buffer
}

/**
 * Generates a random Base64-encoded salt string.
 * @returns {string} Base64 representation of a random 16-byte salt
 */
export function generateSalt(): string {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH_BYTES))
  return arrayBufferToBase64(salt)
}

/**
 * Derives a CryptoKey suitable for AES-GCM encryption using PBKDF2.
 * @param password The user's encryption password
 * @param base64Salt The Base64 encoded salt string
 * @returns {Promise<CryptoKey>} The derived symmetric encryption key
 */
export async function deriveKey(
  password: string,
  base64Salt: string,
): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: base64ToArrayBuffer(base64Salt),
      iterations: ITERATIONS,
      hash: HASH_ALGO,
    },
    passwordKey,
    { name: AES_ALGO, length: KEY_LENGTH_BITS },
    false,
    ['encrypt', 'decrypt'],
  )
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * A new salt and IV are securely generated for every encryption operation.
 * @param plaintext The string data to encrypt (UTF-8 supported)
 * @param password The password to use for encryption
 * @returns {Promise<EncryptedPayload>} The encrypted payload containing ciphertext, salt, and IV
 */
export async function encrypt(
  plaintext: string,
  password: string,
): Promise<EncryptedPayload> {
  const salt = generateSalt()
  const key = await deriveKey(password, salt)
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTES))

  const enc = new TextEncoder()
  const encodedPlaintext = enc.encode(plaintext)

  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: AES_ALGO, iv },
    key,
    encodedPlaintext,
  )

  return {
    ciphertext: arrayBufferToBase64(ciphertextBuffer),
    iv: arrayBufferToBase64(iv),
    salt,
  }
}

/**
 * Decrypts an EncryptedPayload back into plaintext using AES-256-GCM.
 * @param payload The EncryptedPayload containing ciphertext, salt, and IV
 * @param password The password to use for decryption
 * @returns {Promise<string>} The decrypted plaintext string
 * @throws Will throw an error if decryption fails (e.g. invalid password or corrupted data)
 */
export async function decrypt(
  payload: EncryptedPayload,
  password: string,
): Promise<string> {
  const key = await deriveKey(password, payload.salt)
  const ivBuffer = base64ToArrayBuffer(payload.iv)
  const ciphertextBuffer = base64ToArrayBuffer(payload.ciphertext)

  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: AES_ALGO, iv: ivBuffer },
      key,
      ciphertextBuffer,
    )
    const dec = new TextDecoder()
    return dec.decode(decryptedBuffer)
  } catch (err) {
    throw new Error('Decryption failed: incorrect password or corrupted data')
  }
}
