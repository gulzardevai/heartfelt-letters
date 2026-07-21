import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

// AES-256-GCM encryption at rest for letter content.
// Format: enc:v1:<base64(iv | authTag | ciphertext)>
// If LETTER_ENCRYPTION_KEY is unset, data passes through unchanged so the
// app degrades gracefully rather than corrupting or losing letters.

const PREFIX = 'enc:v1:'

function getKey(): Buffer | null {
  const hex = process.env.LETTER_ENCRYPTION_KEY
  if (!hex || hex.length !== 64) return null
  return Buffer.from(hex, 'hex')
}

export function encryptContent(plaintext: string): string {
  const key = getKey()
  if (!key || !plaintext) return plaintext
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return PREFIX + Buffer.concat([iv, tag, ciphertext]).toString('base64')
}

export function decryptContent(stored: string): string {
  if (!stored || !stored.startsWith(PREFIX)) return stored
  const key = getKey()
  if (!key) return '[This letter is encrypted and cannot be displayed right now.]'
  try {
    const raw = Buffer.from(stored.slice(PREFIX.length), 'base64')
    const iv = raw.subarray(0, 12)
    const tag = raw.subarray(12, 28)
    const ciphertext = raw.subarray(28)
    const decipher = createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(tag)
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8')
  } catch {
    return '[This letter could not be decrypted.]'
  }
}
