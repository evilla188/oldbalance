const AudioFX = (() => {
  let ctx = null;
  function init() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  }
  function tone(freq, duration=0.08, type='square', volume=0.04) {
    init();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + duration);
  }
  return {
    click(){tone(520,0.05,'square',0.03)},
    good(){tone(740,0.09,'triangle',0.05); setTimeout(()=>tone(980,0.12,'triangle',0.04),70)},
    bad(){tone(180,0.12,'sawtooth',0.035)},
    cash(){tone(880,0.06,'square',0.035); setTimeout(()=>tone(1175,0.09,'square',0.03),55)},
    level(){tone(523,0.09,'triangle',0.045); setTimeout(()=>tone(659,0.09,'triangle',0.045),90); setTimeout(()=>tone(784,0.16,'triangle',0.05),180)},
    door(){tone(330,0.08,'sine',0.025); setTimeout(()=>tone(520,0.1,'sine',0.025),80)}
  };
})();
