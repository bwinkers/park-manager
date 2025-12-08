#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

function usage() {
  console.log('Usage: node scripts/anonymize-backup.mjs <input.json> [output.json]')
  console.log('If output is omitted, appends -anonymized to the input filename.')
}

const [, , inArg, outArg] = process.argv
if (!inArg) {
  usage()
  process.exit(1)
}

const inputPath = path.resolve(inArg)
const outputPath = outArg ? path.resolve(outArg) : (() => {
  const { dir, name, ext } = path.parse(inputPath)
  return path.join(dir, `${name}-anonymized${ext || '.json'}`)
})()

function isObject(x) { return x && typeof x === 'object' && !Array.isArray(x) }

const nameKeys = new Set(['firstName','lastName','name'])
const phoneKeys = new Set(['phone','contactPhone'])
const emailKeys = new Set(['email','primaryEmail'])
const textKeysForDeepRedaction = new Set(['notes','description'])

const PHONE_RE = /(?<!\w)(?:\+?\d[\d .-]{7,}\d)(?!\w)/g
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi

function redactText(s) {
  if (!s || typeof s !== 'string') return s
  return s
    .replace(EMAIL_RE, 'redacted@example.com')
    .replace(PHONE_RE, '000-000-0000')
}

// Pseudo-random but stable generator based on string hash
function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
    h >>>= 0
  }
  return h >>> 0
}

const FIRST_NAMES = ['Alex','Taylor','Jordan','Casey','Morgan','Drew','Riley','Quinn','Sam','Jamie','Avery','Cameron','Emerson','Hayden','Skyler','Rowan','Reese','Peyton','Kendall','Elliot']
const LAST_NAMES = ['Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee']

function fakeFirst(seed) { return FIRST_NAMES[seed % FIRST_NAMES.length] }
function fakeLast(seed)  { return LAST_NAMES[seed % LAST_NAMES.length] }
function fakePhone(seed) {
  // Format: 555-<seedDigits>
  const a = 555
  const b = (100 + (seed % 900))
  const c = (1000 + (Math.floor(seed / 10) % 9000))
  return `${a}-${b}-${c}`
}
function fakeEmail(seed, baseName) {
  const local = (baseName && baseName.replace(/[^a-z0-9]/gi, '').toLowerCase()) || 'user'
  const num = 100 + (seed % 900)
  return `${local}${num}@example.com`
}

function scrubObject(obj) {
  for (const key of Object.keys(obj)) {
    const val = obj[key]
    if (isObject(val)) {
      scrubObject(val)
      continue
    }
    if (Array.isArray(val)) {
      val.forEach((v) => { if (isObject(v)) scrubObject(v) })
      continue
    }
    if (nameKeys.has(key)) {
      if (!val) { continue }
      const seed = hashString(String(val))
      if (key === 'firstName') obj[key] = fakeFirst(seed)
      else if (key === 'lastName') obj[key] = fakeLast(seed)
      else {
        // Split to first/last if possible, otherwise pick combined
        const parts = String(val).split(/\s+/)
        const f = fakeFirst(seed)
        const l = fakeLast(seed)
        obj[key] = parts.length > 1 ? `${f} ${l}` : `${f} ${l}`
      }
      continue
    }
    if (phoneKeys.has(key)) {
      obj[key] = val ? fakePhone(hashString(String(val))) : val
      continue
    }
    if (emailKeys.has(key)) {
      const seed = hashString(String(val || ''))
      const base = (isObject(obj) && (obj.firstName || obj.name)) ? String(obj.firstName || obj.name) : 'user'
      obj[key] = val ? fakeEmail(seed, base) : val
      continue
    }
    if (textKeysForDeepRedaction.has(key) && typeof val === 'string') {
      obj[key] = redactText(val)
    }
  }
  return obj
}

try {
  const raw = fs.readFileSync(inputPath, 'utf8')
  const json = JSON.parse(raw)

  if (Array.isArray(json)) {
    json.forEach((item) => { if (isObject(item)) scrubObject(item) })
  } else if (isObject(json)) {
    scrubObject(json)
  }

  fs.writeFileSync(outputPath, JSON.stringify(json, null, 2), 'utf8')
  console.log(`Anonymized file written: ${outputPath}`)
} catch (err) {
  console.error('Failed to anonymize backup:', err)
  process.exit(1)
}
