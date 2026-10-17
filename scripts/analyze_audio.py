"""FFT analysis of the supplied master; writes frame envelopes and a fitted 96 BPM grid."""
import json,subprocess,wave
from pathlib import Path
import numpy as np
from scipy.signal import find_peaks
ROOT=Path(__file__).resolve().parents[1]
subprocess.run(['ffmpeg','-y','-v','error','-i',str(ROOT/'public/soundtrack.m4a'),'-ac','1','-ar','22050','/tmp/veyra-audio.wav'],check=True)
with wave.open('/tmp/veyra-audio.wav') as w:
 sr=w.getframerate();x=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(float)/32768
fps=30;n=2048;bands=[]
for f in range(990):
 mid=int(f/fps*sr);start=max(0,mid-n//2);chunk=x[start:start+n];chunk=np.pad(chunk,(0,max(0,n-len(chunk))))
 spec=np.abs(np.fft.rfft(chunk*np.hanning(n)));hz=np.fft.rfftfreq(n,1/sr)
 bands.append([float(np.sqrt(np.mean(chunk**2))),float(np.sqrt(np.mean(spec[(hz>=40)&(hz<160)]**2))),float(np.sqrt(np.mean(spec[(hz>=1000)&(hz<7000)]**2)))])
a=np.array(bands);a=np.clip(a/np.percentile(a,95,axis=0),0,1.3)
peaks,_=find_peaks(a[:,1],distance=12,prominence=.12)
period=60/96;offsets=np.arange(0,period,1/fps);score=[]
for offset in offsets:
 grid=np.arange(offset,33,period);idx=np.minimum(989,np.round(grid*fps).astype(int));score.append(np.mean(a[idx,1]))
offset=float(offsets[int(np.argmax(score))]);beats=np.arange(offset,33,period)
result={'duration':33,'fps':30,'bpm':96,'beatOffset':round(offset,4),'beatFrames':[round(t*fps) for t in beats],'bassOnsets':[int(i) for i in peaks],'envelope':np.round(a,3).tolist(),'method':'2048-sample Hann FFT at 22050 Hz; 40–160 Hz bass, 1–7 kHz detail; 96 BPM phase fit'}
(ROOT/'video/audio-analysis.json').write_text(json.dumps(result,separators=(',',':')))
(ROOT/'docs/audio-analysis.md').write_text('# Audio analysis\n\n33.000 seconds, 48 kHz stereo source. Analysis: '+result['method']+'.\n\n96 BPM is the supplied creative tempo, not an independently proven tempo estimate. Fitted first beat: '+str(round(offset,3))+'s. '+str(len(peaks))+' low-band onset peaks. Animation accents use the measured bass envelope; scene changes use the fitted beat grid.\n')
print(json.dumps({k:v for k,v in result.items() if k!='envelope'}))
