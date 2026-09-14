# Documentation generation and translation

Run from the repository root with Node from `.node-version` and Yarn Classic
1.22.22. The old `build-llm.js` and `trans-docs.js` paths remain checked JS CLI
adapters. These tools do not change player APIs or published declarations.

## Commands and outputs

```sh
yarn build:llm
yarn check:llm
yarn trans:docs
yarn trans:docs --remote
yarn trans:docs --validate refactor/.cache/translations/draft-EXAMPLE
yarn trans:docs --apply refactor/.cache/translations/draft-EXAMPLE
yarn typecheck:docs-tools
node --test test/documentation-pipeline.test.js
```

`build:llm` is now offline and deterministic. It preserves complete source text
(LF-normalized) from English Markdown, the actual editor declaration list,
examples and the VAST declaration notices. It writes the existing `docs/llms.txt`
path plus `docs/llms.manifest.json` with source/output SHA-256 fingerprints.
`check:llm` checks without writing; CI checks it and `ci:build` regenerates it
after editor declarations. Regenerate after changing any input. Content presence
does not prove API correctness, example playback or English coverage; SITE-04
and EX-03 still own those reviews. Unloaded legacy WebSR declarations are not
included simply because they remain on disk.

`trans:docs` now only reports a local plan by default. Only `--remote` imports
dotenv, reads `DEEPSEEK_API_KEY` and calls the existing DeepSeek endpoint/model.
It writes a unique ignored draft directory, never the live English documents.
Its scope remains index, advanced, component and start; adding plugin translation
is separate work. Remote requests may incur provider charges. CI never calls them.

Review the draft's prose and diff before applying it. If prose needs editing,
edit the draft then run `--validate`: it verifies structure and source/target
fingerprints and records the edited draft hashes. It cannot judge translation
quality. `--apply` checks all fingerprints and structure again before replacing
the selected English files. Unselected pages remain. Rebuild site assets, the
LLM bundle and the documentation site after applying reviewed translations.

This intentionally replaces the old destructive default, which removed the
English directory before the first request. Existing automation that intended
remote translation must explicitly select `--remote`, review, then `--apply`.
No actual remote translation or paid service acceptance was performed for this
migration; local tests inject responses or use a loopback HTTP server.

## Ownership and failure behavior

| Module           | Responsibility                                                                   |
| ---------------- | -------------------------------------------------------------------------------- |
| `cli.ts`         | Argument dispatch; offline default; remote credential boundary                   |
| `corpus.ts`      | Ordered source inventory and deterministic output/manifest                       |
| `markdown.ts`    | Protected block placeholders, structural validation, bounded chunks              |
| `remote.ts`      | Request/body timeout, bounded retry, response validation and cancellation        |
| `translation.ts` | Draft state, worker cancellation/join, fingerprint validation and apply/rollback |
| `files.ts`       | LF reads, hashes, owned paths and adjacent temporary-file replacement            |

Draft state advances incomplete -> complete -> applied; a failed request or
invalid response leaves a failed draft for diagnosis. One worker failure aborts
the shared signal and waits for every worker before returning. HTTP 429/5xx and
transport failures have bounded retries; invalid/empty JSON and authorization
fail without retrying. The per-attempt timeout covers body reading too. Every
timer is cleared and rejected HTTP bodies are cancelled.

Code, inline code, HTML, links and structural Markdown tokens must survive.
Fenced blocks and directives are restored from local originals, not model text.
An invalid result is rejected instead of heuristically inserting code fences.
Unusual Markdown or a chunk boundary may be rejected; inspect the retained
draft and improve protection rather than weakening validation. This is not a
Markdown sanitizer or proof that prose preserves meaning.

Apply preflights the whole set, rechecks each write, uses adjacent temporary
files and rolls back completed writes on caught failures, preserving original
bytes. A concurrent edit prevents rollback of that file, producing an aggregate
error instead of overwriting the other writer. **This is not a multi-file crash
transaction**: backups live in process memory, and power loss or forced process
termination can leave a partial apply. Commit existing English changes before
applying, keep the draft, and inspect Git diff after any failure. Path validation
rejects traversal and existing junctions/symlinks outside the owned root; it is
not a defense against hostile concurrent filesystem mutation.

No new dependencies were added: use the root's pinned TypeScript 5.9.3,
markdown-it types 14.1.2, glob 13.0.6 and dotenv 17.2.4. For follow-up maintenance,
start from the responsible module, rerun its filesystem/request regressions,
strict docs-tools types and root lint, then regenerate/check the source bundle
and site inventory. Browser/player testing is needed when a change also affects
page content or runtime, not as a substitute for these tool failure tests.
