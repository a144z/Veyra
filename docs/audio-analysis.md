# Soundtrack analysis

[← Documentation](README.md)

## Source and timing

| Property | Value |
| --- | --- |
| Master duration | 33.000 seconds |
| Source | 48 kHz stereo |
| Film | 990 frames at 30 fps |
| Creative tempo | 96 BPM |
| Fitted first beat | 0.100 seconds |
| Detected bass onsets | 16 |

The tempo comes from the supplied creative brief; it is not an independently proven tempo estimate. The beat phase is fitted against the measured low-frequency envelope.

## Method

The analysis uses 2,048-sample Hann-windowed FFTs at 22,050 Hz. It measures 40–160 Hz for bass and 1–7 kHz for detail, then normalizes the per-frame envelopes. Scene changes follow the fitted beat grid; selected visual accents use the measured bass envelope.

## Reproduce

```sh
npm run audio:analyze
```

Requires FFmpeg, NumPy, and SciPy. The generated frame envelopes and beat positions are committed in `video/audio-analysis.json`; normal film rendering does not need to rerun the analysis.
