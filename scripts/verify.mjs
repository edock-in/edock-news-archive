#!/usr/bin/env node
/**
 * Check this record yourself. Needs nothing but Node.js 18 or later.
 *
 *   node scripts/verify.mjs
 *
 * It reads every line of every file in chain/, oldest first, and checks:
 *   1. the lines are numbered 1, 2, 3… with none missing,
 *   2. each line's "prev" is the SHA-256 of the line before it
 *      (the first line's is 64 zeros),
 *   3. each version's file matches the SHA-256 on its line,
 *   4. each copied picture matches the SHA-256 in its own name.
 *
 * If anything was edited, removed or slipped in after it was written, one
 * of these checks fails and says where. It prints the hash of the newest
 * line: compare it with the one stamped on Bitcoin in proofs/.
 */

import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(process.argv[2] ?? path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
const sha256 = (data) => createHash('sha256').update(data).digest('hex');
const fail = (message) => {
  console.error(`✗ ${message}`);
  process.exit(1);
};

const chainDir = path.join(root, 'chain');
const files = existsSync(chainDir) ? readdirSync(chainDir).filter((f) => /^\d{4}-\d{2}\.jsonl$/.test(f)).sort() : [];

let prev = '0'.repeat(64);
let n = 0;
let versions = 0;
let pictures = 0;
const stories = new Set();

for (const file of files) {
  for (const raw of readFileSync(path.join(chainDir, file), 'utf8').split('\n')) {
    if (!raw.trim()) continue;
    n += 1;
    const where = `chain/${file}, line ${n}`;
    let line;
    try {
      line = JSON.parse(raw);
    } catch {
      fail(`${where} is not JSON`);
    }
    if (line.n !== n) fail(`${where} is numbered ${line.n}: a line is missing or out of place`);
    if (line.prev !== prev) fail(`${where} does not point at the line before it: something before it changed`);
    stories.add(line.story);
    if (line.kind === 'version') {
      if (!/^stories\/[A-Za-z0-9-]+\/v\d+\.json$/.test(line.file ?? '')) fail(`${where} names an odd file`);
      const target = path.join(root, line.file);
      if (!existsSync(target)) fail(`${where}: ${line.file} is missing`);
      if (sha256(readFileSync(target)) !== line.sha256) fail(`${where}: ${line.file} was changed after it was written`);
      versions += 1;
      for (const media of line.media ?? []) {
        const match = /^media\/([0-9a-f]{64})\.[a-z]+$/.exec(media);
        if (!match) fail(`${where} names an odd picture ${media}`);
        const picture = path.join(root, media);
        if (!existsSync(picture)) fail(`${where}: ${media} is missing`);
        if (sha256(readFileSync(picture)) !== match[1]) fail(`${where}: ${media} was changed after it was written`);
        pictures += 1;
      }
    }
    prev = sha256(raw);
  }
}

console.log(`✓ ${n} lines, ${versions} versions of ${stories.size} stories, ${pictures} pictures: every link holds.`);
console.log(`  Newest line's SHA-256: ${prev}`);
