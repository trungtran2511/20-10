// Procedural Web Audio API for celestial ambient & interactive sound effects
// No external mp3 files required, 100% reliable and instantaneous.

class SoundSystem {
  private ctx: AudioContext | null = null
  private isMuted: boolean = false
  private ambientGain: GainNode | null = null
  private isAmbientPlaying: boolean = false
  private oscInterval: number | null = null

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // Play celestial portal enter whoosh
  playPortalEnter() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(120, now)
    osc.frequency.exponentialRampToValueAtTime(580, now + 1.2)
    osc.frequency.exponentialRampToValueAtTime(320, now + 2.5)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(400, now)
    filter.frequency.exponentialRampToValueAtTime(3000, now + 1.0)
    filter.frequency.exponentialRampToValueAtTime(800, now + 2.5)

    gain.gain.setValueAtTime(0.01, now)
    gain.gain.linearRampToValueAtTime(0.25, now + 0.8)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 2.5)

    // Play sparkling chimes after whoosh
    setTimeout(() => {
      this.playChime(523.25) // C5
      setTimeout(() => this.playChime(659.25), 180) // E5
      setTimeout(() => this.playChime(783.99), 360) // G5
      setTimeout(() => this.playChime(1046.50), 540) // C6
    }, 600)
  }

  // Play crystal bell chime
  playChime(freq = 880) {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, now)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 1.8)
  }

  // Play wish revelation fanfare
  playWishMagic() {
    if (this.isMuted) return
    const notes = [440, 554.37, 659.25, 830.61, 880, 1108.73]
    notes.forEach((f, i) => {
      setTimeout(() => this.playChime(f), i * 110)
    })
  }

  // Play gentle sphere swirl sound
  playSwirl() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(350, now)
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.3)
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.7)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.7)
  }

  // Toggle or start background ambient chord
  toggleAmbient() {
    this.initContext()
    if (!this.ctx) return false

    if (this.isAmbientPlaying) {
      if (this.ambientGain) {
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1)
      }
      this.isAmbientPlaying = false
      if (this.oscInterval) clearInterval(this.oscInterval)
      return false
    } else {
      this.isAmbientPlaying = true
      this.startAmbientDrone()
      return true
    }
  }

  private startAmbientDrone() {
    if (!this.ctx || this.isMuted) return

    // Gentle chord cycle (F major / A minor / C major in soothing low frequencies)
    const chords = [
      [261.63, 329.63, 392.00, 523.25], // C Major
      [220.00, 261.63, 329.63, 440.00], // A Minor
      [174.61, 220.00, 261.63, 349.23], // F Major
      [196.00, 246.94, 293.66, 392.00]  // G Major
    ]

    let chordIdx = 0

    const playChord = () => {
      if (!this.isAmbientPlaying || !this.ctx || this.isMuted) return
      const currentChord = chords[chordIdx]
      chordIdx = (chordIdx + 1) % chords.length
      const now = this.ctx.currentTime

      currentChord.forEach(freq => {
        const osc = this.ctx!.createOscillator()
        const gain = this.ctx!.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq * 0.5, now)

        gain.gain.setValueAtTime(0.001, now)
        gain.gain.linearRampToValueAtTime(0.025, now + 2.5)
        gain.gain.linearRampToValueAtTime(0.001, now + 7.5)

        osc.connect(gain)
        gain.connect(this.ctx!.destination)

        osc.start(now)
        osc.stop(now + 8)
      })
    }

    playChord()
    this.oscInterval = window.setInterval(playChord, 7000)
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    return this.isMuted
  }

  getMuted() {
    return this.isMuted
  }

  getAmbientPlaying() {
    return this.isAmbientPlaying
  }
}

export const soundManager = new SoundSystem()
