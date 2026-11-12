# MIRAS film audio: VO placement + sparse felt-piano/pad score + soft foley, ducked mix.
# usage: python3 -I audio.py  (run from scenes/miras) -> vo.wav, music.wav, sfx.wav, mix.wav, cues.json
import json, wave, numpy as np

SR = 44100; END = 45.0; N = int(SR * END)
rng = np.random.default_rng(1917)

# ---------- VO placement (file start times; speech starts ~0.22 s later) ----------
SEG = [(1, 2.55), (2, 6.45), (3, 7.95), (4, 9.55), (5, 12.35), (6, 16.65), (7, 23.2), (8, 28.75), (9, 32.85), (10, 38.6), (11, 40.55)]

def read_wav(p):
    w = wave.open(p); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768; w.close(); return x

vo = np.zeros(N); cues = []
for n, t in SEG:
    x = read_wav(f'vo/seg{n:02d}.wav'); s = int(t * SR); e = min(N, s + len(x)); vo[s:e] += x[:e - s]
    words = json.load(open(f'vo/seg{n:02d}.mp3.words.json'))
    cues.append(dict(seg=n, words=[dict(w=w['w'], s=round(t + w['s'], 3), e=round(t + w['e'], 3)) for w in words]))
vo = vo / np.abs(vo).max() * 0.70
json.dump(cues, open('cues.json', 'w'), ensure_ascii=False, indent=1)

# ---------- helpers ----------
t = np.arange(N) / SR
note = lambda m: 440 * 2 ** ((m - 69) / 12)

def lowpass(x, k):                       # cheap one-pole low-pass, k in (0,1]
    y = np.empty_like(x); z = 0.0
    for i in range(len(x)): z += k * (x[i] - z); y[i] = z
    return y

def add(buf, at, x, g=1.0):
    s = int(at * SR); e = min(len(buf), s + len(x))
    if s < len(buf): buf[s:e] += g * x[:e - s]

def reverb(x, seconds=2.4, seed=3):
    L = int(seconds * SR); r = np.random.default_rng(seed).standard_normal(L) * np.exp(-np.arange(L) / SR * 3.2)
    r = np.convolve(r, np.ones(24) / 24, 'same')            # darken the tail
    n = 1 << int(np.ceil(np.log2(len(x) + L)))
    y = np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(r, n), n)[:len(x)]
    return y / (np.abs(y).max() + 1e-9)

# ---------- felt piano ----------
def piano(m, vel=0.4, dur=4.0):
    f = note(m); tt = np.arange(int(dur * SR)) / SR
    env = np.minimum(1, tt / 0.006) * (0.65 * np.exp(-tt * 1.6) + 0.35 * np.exp(-tt * 0.45))
    y = sum(a * np.sin(2 * np.pi * f * k * (1 + 0.0004 * k) * tt) * np.exp(-tt * (0.8 + 0.9 * k)) for k, a in [(1, 1.0), (2, 0.42), (3, 0.16), (4, 0.07)])
    thump = np.sin(2 * np.pi * 90 * tt) * np.exp(-tt * 40) * 0.15
    return vel * (y * env + thump)

PN = [(0.6, [69], .30), (2.4, [66], .36), (4.95, [62, 69, 78], .40), (7.0, [76], .24), (8.4, [73], .24), (10.0, [71], .26),
      (12.0, [55, 62, 71], .36), (14.3, [78], .20), (16.6, [69], .26), (18.9, [76], .20), (21.2, [74], .24),
      (23.2, [59, 66, 74], .34), (25.6, [69], .20), (28.7, [55, 71, 78], .34), (31.0, [76], .20), (32.6, [57, 64, 73], .30),
      (35.0, [62, 66], .26), (37.6, [50, 57, 66, 74], .44), (40.8, [81], .14)]
pn = np.zeros(N)
for at, ms, v in PN:
    for j, m in enumerate(ms): add(pn, at + j * 0.018, piano(m, v, 6.0 if at >= 37 else 4.0))

# ---------- warm pad ----------
CH = [(0.0, 12.0, [50, 57, 62, 64, 66]), (12.0, 23.2, [43, 55, 59, 62, 66]), (23.2, 28.7, [47, 54, 57, 62]),
      (28.7, 32.6, [43, 55, 59, 62, 66]), (32.6, 37.6, [45, 52, 57, 61, 64]), (37.6, END, [50, 57, 62, 66, 69])]
pad = np.zeros(N)
for a, b, ch in CH:
    s, e = int(max(0, a - 0.6) * SR), min(N, int((b + 0.8) * SR)); tt = np.arange(e - s) / SR; D = (e - s) / SR
    env = np.minimum(1, tt / 1.4) * np.clip((D - tt) / 1.4, 0, 1)
    for m in ch:
        f = note(m)
        for det in (-0.0012, 0.0012): pad[s:e] += env * (np.sin(2 * np.pi * f * (1 + det) * tt) + 0.25 * np.sin(4 * np.pi * f * (1 + det) * tt)) / len(ch)
pad = lowpass(pad, 0.08)
fade = np.minimum(1, t / 1.2) * np.clip((END - t) / 2.5, 0, 1)
music = (pn / (np.abs(pn).max() + 1e-9) * 0.55 + pad / (np.abs(pad).max() + 1e-9) * 0.22)
music = (0.78 * music + 0.32 * reverb(music)) * fade

# ---------- foley ----------
sfx = np.zeros(N)
def noise(d, seed): return np.random.default_rng(seed).standard_normal(int(d * SR))
def creak(at):                                                  # lid lifting off its seat
    tt = np.arange(int(0.35 * SR)) / SR
    tick = noise(0.35, 5) * np.exp(-tt * 70) * 0.5
    body = np.sin(2 * np.pi * (85 + 25 * tt) * tt) * np.exp(-tt * 14)
    add(sfx, at, lowpass(tick, 0.25) + 0.6 * body, 0.22)
def air(at, d=1.1):                                             # lid swinging open
    x = lowpass(noise(d, 8), 0.035); env = np.sin(np.pi * np.arange(len(x)) / len(x)) ** 2
    add(sfx, at, x / np.abs(x).max() * env, 0.10)
def rustle(at, d=0.7, seed=11):                                 # paper / card
    x = noise(d, seed); x = x - lowpass(x, 0.18); x = lowpass(x, 0.6)
    flutter = np.abs(lowpass(np.random.default_rng(seed + 1).standard_normal(len(x)), 0.004)); flutter /= flutter.max()
    env = np.sin(np.pi * np.arange(len(x)) / len(x)) ** 1.5
    add(sfx, at, x / np.abs(x).max() * flutter * env, 0.16)
def tap(at):                                                    # card settling on the tray
    tt = np.arange(int(0.12 * SR)) / SR; add(sfx, at, (lowpass(noise(0.12, 21), 0.3) * 0.6 + np.sin(2 * np.pi * 140 * tt)) * np.exp(-tt * 45), 0.12)
creak(2.35); air(4.85); rustle(6.05, 0.6); rustle(23.55, 0.8, 31); tap(24.55); air(34.85, 0.9); rustle(32.7, 0.45, 41)
sfx = 0.85 * sfx + 0.15 * reverb(sfx, 1.2, 9)

# ---------- ducking + mix ----------
envv = np.convolve(np.abs(vo), np.ones(2205) / 2205, 'same'); envv = lowpass(envv / envv.max(), 0.0007)
duck = 1 - 0.55 * np.clip(envv * 4, 0, 1)
mix = vo + music * 0.42 * duck + sfx
mix = np.stack([mix, mix], 1)
for name, x in [('vo.wav', vo), ('music.wav', music), ('sfx.wav', sfx), ('mix_raw.wav', mix)]:
    a = x if x.ndim == 2 else np.stack([x, x], 1)
    a = (a / max(1, np.abs(a).max() / 0.97) * 32767).astype(np.int16)
    w = wave.open(name, 'w'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes()); w.close()
print('ok', len(cues), 'segments')
