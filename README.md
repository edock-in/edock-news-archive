# Edock News: the public record

**Edock News closed on 26 November 2026.** Its website is gone; each of its
stories is still on [Edock Blogs](https://blogs.edock.io) at the same address
(`blogs.edock.io/p/<slug>`). This record stays public as it was. Edock's server
stops adding to it with its next update.

Every story that was on Edock News, and every version of it, was written here
the moment it was published. Nobody, not even Edock, can quietly change or
remove what is here.

## Why you can trust it

Each change is one line in a monthly file under [`chain/`](chain). Every line
carries the **SHA-256 fingerprint of the line before it**, so the lines form a
chain. If anyone edited or deleted an old line, every fingerprint after it would
stop matching, and anyone holding a copy would see it at once.

A version's words live in their own file under `stories/<story>/v<n>.json`,
and its line holds that file's fingerprint. Pictures are copied into `media/`,
each named by its own fingerprint.

Three more things make it hard to rewrite history even for Edock:

- **Bitcoin time stamps.** Once a day the newest line's fingerprint is stamped
  on the Bitcoin blockchain through [OpenTimestamps](https://opentimestamps.org).
  The proofs are in [`proofs/`](proofs). They show the record existed in that
  state on that day.
- **Copies elsewhere.** [Software Heritage](https://www.softwareheritage.org),
  a non-profit archive of public code, keeps its own copy. So does anyone who
  clones this repository.
- **Fast-forward only.** Edock's server can only add commits on top of `main`,
  never rewrite them.

## Check it yourself

You need [Node.js](https://nodejs.org) and nothing else:

```bash
git clone https://github.com/edock-in/edock-news-archive
cd edock-news-archive
node scripts/verify.mjs
```

It checks every line, file and picture, and prints the newest fingerprint.

## What a line says

```json
{"n":12,"at":"2026-10-11T06:42:00.000Z","kind":"version","story":"<id>","slug":"jio-ipo-opens-21-october","version":2,"file":"stories/<id>/v2.json","sha256":"<file hash>","media":["media/<hash>.jpg"],"entry":"<id>","prev":"<hash of line 11>"}
```

| `kind` | What happened |
| --- | --- |
| `version` | A story was published as News, or its author pressed Update |
| `withdrawn` | Its author took it off News (`note` says how: unmarked, unpublished, deleted) |
| `returned` | It came back on News with nothing changed |
| `hidden` | Edock took it off News (`note` gives the reason) |
| `unhidden` | Edock put it back |

A withdrawn or hidden story left News, but everything it ever said stays
here, with the note.

## Who can write here

Only Edock's server, through a key that can do nothing but add to this
repository. Stories come from the Edock team and members with a blue tick on
[Edock Blogs](https://blogs.edock.io). The code that turned this record into
the Edock News website is in [edock-in/edock-news](https://github.com/edock-in/edock-news);
it no longer runs.

## Licences

- **Stories**: [CC BY 4.0](LICENSE). Republish them freely, crediting the author
  and linking to the story on Edock Blogs.
- **Scripts and workflows**: MIT, see [LICENSE-CODE](LICENSE-CODE).
