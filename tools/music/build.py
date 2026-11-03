#!/usr/bin/env python3
"""Turn the soundtrack WAVs (made with Suno, paid plan) into the small loops the app plays.

    python3 tools/music/build.py <folder with the WAVs>

The WAVs are not kept in the repo (about 190 MB). A file is matched by the name it ends with,
e.g. "...-animal-jungle.wav", so the random prefix a download gets doesn't matter.

For every track:
  1. level it to the same loudness (-16 LUFS), never above -1 dBFS;
  2. cut the fade-out at the end;
  3. loops: crossfade the end into the opening (3 s), so playing it again and again never jumps.
     The file then starts 3 s in, and its last 3 s already lead into that point.
  4. encode AAC in M4A, 44.1 kHz stereo, about 80 kbit/s (plays on Android and iPhone).
Writes public/music/<name>.m4a. Needs numpy and ffmpeg.
"""
import json, subprocess, sys, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "music"
SR = 44100
TARGET_LUFS = -16.0
XF = 3.0  # seconds of crossfade at the loop point

# name in the app -> (end of the downloaded file's name, loops?)
TRACKS = {
    "theme": ("main-theme", True),
    "animals": ("animal-jungle", True),
    "food": ("yummy-twon", True),  # spelled this way in the download
    "people": ("me-and-friends", True),
    "things": ("toy-house", True),
    "outside": ("adventure-road", True),
    "learning": ("learning-castle", True),
    "games": ("mini-games", True),
    "garden": ("garden-shop", True),
    "party": ("party-stone-celebration", False),
}


def loudness(path):
    err = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af",
                          "loudnorm=print_format=json", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    return float(json.loads(err[err.rindex("{"):])["input_i"])


def read(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "2",
                          "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()


def tail_start(a):
    """Where the closing fade begins: the last 0.1 s block still within 9 dB of the track's level."""
    blk = SR // 10
    n = len(a) // blk
    rms = 20 * np.log10(np.sqrt((a[: n * blk].reshape(n, blk, 2) ** 2).mean(axis=(1, 2))) + 1e-9)
    level = np.median(rms)
    i = n - 1
    while i > 0 and rms[i] < level - 9:
        i -= 1
    return (i + 1) * blk


HOP = 512


def onsets(m):
    """Rhythm envelope: how much the sound's spectrum grows from one short frame to the next."""
    n = (len(m) - 2048) // HOP
    frames = np.lib.stride_tricks.sliding_window_view(m, 2048)[::HOP][:n] * np.hanning(2048)
    s = np.abs(np.fft.rfft(frames, axis=1))
    flux = np.maximum(np.diff(np.log1p(s), axis=0), 0).sum(axis=1)
    return (flux - flux.mean()) / (flux.std() + 1e-9)


def make_loop(a):
    a = a[: tail_start(a)]
    x = int(XF * SR)
    # Where should the repeat pick up? Somewhere 2-6 s into the track, at the point whose
    # preceding 3 s best line up, beat for beat, with the last 3 s (so no beat doubles up).
    m = a.mean(axis=1)
    end = onsets(m[-x - 2048:])
    head = onsets(m[: int(6 * SR) + 2048])
    w = len(end)
    best, s = -1e9, x
    for k in range(int(2 * SR) // HOP - w, len(head) - w):
        if k < 0:
            continue
        c = float(np.dot(head[k:k + w], end))
        if c > best:
            best, s = c, (k + w) * HOP
    t = np.linspace(0, np.pi / 2, x, dtype=np.float32)[:, None]
    body = a[s:].copy()
    # equal-power crossfade: the end fades out while the opening fades in
    body[-x:] = body[-x:] * np.cos(t) + a[s - x:s] * np.sin(t)
    return body


def main(src):
    src = Path(src)
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (suffix, loops) in TRACKS.items():
        found = sorted(src.glob(f"*{suffix}.wav"))
        if not found:
            sys.exit(f"missing *{suffix}.wav in {src}")
        a = read(found[0]) * 10 ** ((TARGET_LUFS - loudness(found[0])) / 20)
        a = make_loop(a) if loops else a[: tail_start(a) + SR // 2]
        peak = np.abs(a).max()
        if peak > 0.89:  # -1 dBFS
            a *= 0.89 / peak
        if not loops:  # a short fade so the jingle never clicks off
            f = SR // 2
            a[-f:] *= np.linspace(1, 0, f, dtype=np.float32)[:, None]
        pcm = (np.clip(a, -1, 1) * 32767).astype("<i2").tobytes()
        out = OUT / f"{name}.m4a"
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-",
                        "-c:a", "aac", "-b:a", "80k", "-movflags", "+faststart", str(out)], input=pcm, check=True)
        print(f"{out.relative_to(ROOT)}  {len(a) / SR:6.1f} s  {out.stat().st_size / 1e6:.2f} MB")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else ".")
