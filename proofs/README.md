# Bitcoin time stamps

Once a day, `YYYY-MM-DD.txt` records the chain's newest line and its SHA-256,
and `YYYY-MM-DD.txt.ots` is its [OpenTimestamps](https://opentimestamps.org)
proof. A fresh proof is "pending" for a few hours, until a Bitcoin block
confirms it; the next day's run upgrades it to a full proof.

To check one, install the client (`pip install opentimestamps-client`) and run:

```bash
ots verify proofs/2026-10-11.txt.ots
```

It tells you the Bitcoin block that proves the file existed by that time.
