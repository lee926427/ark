import { describe, it, expect } from 'vitest'
import { deriveKey, encrypt, decrypt, generateSalt } from '@/lib/crypto/e2ee'
import { generateFingerprint, hashFingerprint } from '@/lib/crypto/fingerprint'
import type { HealthMetrics } from '@/lib/crypto/types'

describe('E2EE Encryption Module', () => {
  const password = 'CorrectHorseBatteryStaple_#1234'

  it('should encrypt and decrypt roundtrip various UTF-8 strings', async () => {
    const testCases = [
      'Simple ASCII text',
      '包含中文 CJK 文字',
      'Emoji payload 🎉🔥🚀🤷‍♂️',
      '1234567890!@#$%^&*()_+',
      '', // empty string
    ]

    for (const testCase of testCases) {
      const payload = await encrypt(testCase, password)
      expect(payload).toHaveProperty('ciphertext')
      expect(payload).toHaveProperty('iv')
      expect(payload).toHaveProperty('salt')

      const decrypted = await decrypt(payload, password)
      expect(decrypted).toBe(testCase)
    }
  })

  it('should throw error when decrypting with wrong password', async () => {
    const payload = await encrypt('Top Secret Data', password)

    await expect(decrypt(payload, 'Wrong_Password!')).rejects.toThrow(
      /incorrect password or corrupted data/i,
    )
  })

  it('should throw error on corrupted payload', async () => {
    const payload = await encrypt('Top Secret Data', password)

    // Alter one character in ciphertext
    const corruptedPayload = {
      ...payload,
      ciphertext:
        payload.ciphertext.slice(0, 10) +
        (payload.ciphertext.charAt(10) === 'a' ? 'b' : 'a') +
        payload.ciphertext.slice(11),
    }

    await expect(decrypt(corruptedPayload, password)).rejects.toThrow(
      /incorrect password or corrupted data/i,
    )
  })

  it('should produce different ciphertexts and IVs for same plaintext (random IV, random Salt)', async () => {
    const plaintext = 'Consistent Message'

    const payload1 = await encrypt(plaintext, password)
    const payload2 = await encrypt(plaintext, password)

    expect(payload1.ciphertext).not.toBe(payload2.ciphertext)
    expect(payload1.iv).not.toBe(payload2.iv)
    expect(payload1.salt).not.toBe(payload2.salt)
  })

  it('should derive secret CryptoKeys successfully', async () => {
    const salt = generateSalt()

    const key1 = await deriveKey(password, salt)

    expect(key1).toBeDefined()
    expect(key1.type).toBe('secret')
    expect(key1.algorithm.name).toBe('AES-GCM')
    expect(key1.extractable).toBe(false)
  })
})

describe('Data Fingerprint Module', () => {
  const sampleMetrics: HealthMetrics = {
    emergencyFundMonths: 6.5,
    savingsRate: 0.25,
    debtToAssetRatio: 0.1,
    liquidityRatio: 0.4,
    spendingHealthScore: 85,
  }

  it('should generate fingerprint containing no absolute values', () => {
    const fingerprintStr = generateFingerprint(sampleMetrics)

    // Parse JSON back to verify properties
    const parsed = JSON.parse(fingerprintStr)
    const keys = Object.keys(parsed)

    // Ensure it strictly allows defined properties mapped out
    expect(keys).toEqual([
      'debtToAssetRatio',
      'emergencyFundMonths',
      'liquidityRatio',
      'savingsRate',
      'spendingHealthScore',
    ])

    // Make sure we never leak anything beyond ratios and non-absolute scores
    // For example, if we mischievously pass an un-typed absolute field in JS
    const maliciousMetrics = {
      ...sampleMetrics,
      absoluteBalance: 120000,
    } as unknown as HealthMetrics

    const safeFingerprint = generateFingerprint(maliciousMetrics)
    expect(safeFingerprint).not.toContain('absoluteBalance')
    expect(safeFingerprint).not.toContain('120000')
  })

  it('should produce identical fingerprints for identical inputs (determinism)', () => {
    const fp1 = generateFingerprint(sampleMetrics)
    const fp2 = generateFingerprint({ ...sampleMetrics }) // clone object

    expect(fp1).toBe(fp2)
  })

  it('should produce identical fingerprints ignoring key order', () => {
    // JavaScript object key insertion order matters generically in JSON.stringify
    // The generator should properly structure it
    const a = {
      savingsRate: 0.25,
      emergencyFundMonths: 6.5,
      debtToAssetRatio: 0.1,
    }

    const b = {
      debtToAssetRatio: 0.1,
      savingsRate: 0.25,
      emergencyFundMonths: 6.5,
    }

    const fp1 = generateFingerprint(a)
    const fp2 = generateFingerprint(b)
    expect(fp1).toBe(fp2)
  })

  it('should create a 64-char lowercase hex string hash from fingerprint', async () => {
    const str = generateFingerprint(sampleMetrics)
    const hash = await hashFingerprint(str)

    expect(typeof hash).toBe('string')
    expect(hash.length).toBe(64)
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
  })
})
