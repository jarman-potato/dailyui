class MusicPlayer {
  constructor() {
    this.isPlaying = false;
    this.isShuffle = false;
    this.isRepeat = false;
    this.isMuted = false;
    this.volume = 0.7;
    this.currentTrack = 0;
    this.currentTime = 0;
    this.duration = 225; // 3:45 in seconds
    
    this.tracks = [
      { title: 'Potato Symphony', artist: 'jarman-potato', duration: 225 },
      { title: 'Spud Serenade', artist: 'jarman-potato', duration: 252 },
      { title: 'French Fry Funk', artist: 'jarman-potato', duration: 208 },
      { title: 'Mashed Dreams', artist: 'jarman-potato', duration: 301 }
    ];
    
    this.init();
  }
  
  init() {
    // Control buttons
    this.playBtn = document.getElementById('playBtn');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.shuffleBtn = document.getElementById('shuffleBtn');
    this.repeatBtn = document.getElementById('repeatBtn');
    this.volumeBtn = document.getElementById('volumeBtn');
    
    // Display elements
    this.albumArt = document.getElementById('albumArt');
    this.trackTitle = document.getElementById('trackTitle');
    this.trackArtist = document.getElementById('trackArtist');
    this.currentTimeEl = document.getElementById('currentTime');
    this.durationEl = document.getElementById('duration');
    this.progressFill = document.getElementById('progressFill');
    this.progressThumb = document.getElementById('progressThumb');
    this.progressBar = document.getElementById('progressBar');
    this.volumeFill = document.getElementById('volumeFill');
    this.volumeThumb = document.getElementById('volumeThumb');
    this.volumeSlider = document.getElementById('volumeSlider');
    this.playlist = document.getElementById('playlist');
    
    // Event listeners
    this.playBtn.addEventListener('click', () => this.togglePlay());
    this.prevBtn.addEventListener('click', () => this.prevTrack());
    this.nextBtn.addEventListener('click', () => this.nextTrack());
    this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
    this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
    this.volumeBtn.addEventListener('click', () => this.toggleMute());
    
    this.progressBar.addEventListener('click', (e) => this.seekTo(e));
    this.volumeSlider.addEventListener('click', (e) => this.setVolume(e));
    
    // Playlist items
    this.playlist.querySelectorAll('.playlist-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        this.playTrack(index);
      });
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    
    // Start progress simulation
    this.startProgressSimulation();
    
    // Update display
    this.updateDisplay();
  }
  
  togglePlay() {
    this.isPlaying = !this.isPlaying;
    this.updatePlayButton();
    this.albumArt.classList.toggle('playing', this.isPlaying);
  }
  
  updatePlayButton() {
    const playIcon = this.playBtn.querySelector('.play-icon');
    const pauseIcon = this.playBtn.querySelector('.pause-icon');
    
    if (this.isPlaying) {
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    } else {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }
  }
  
  prevTrack() {
    if (this.currentTime > 3) {
      this.currentTime = 0;
    } else {
      this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
      this.currentTime = 0;
    }
    this.loadTrack();
  }
  
  nextTrack() {
    if (this.isShuffle) {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * this.tracks.length);
      } while (newIndex === this.currentTrack && this.tracks.length > 1);
      this.currentTrack = newIndex;
    } else {
      this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
    }
    this.currentTime = 0;
    this.loadTrack();
  }
  
  playTrack(index) {
    this.currentTrack = index;
    this.currentTime = 0;
    this.isPlaying = true;
    this.loadTrack();
    this.updatePlayButton();
    this.albumArt.classList.add('playing');
  }
  
  loadTrack() {
    const track = this.tracks[this.currentTrack];
    this.duration = track.duration;
    this.updateDisplay();
    this.updatePlaylist();
  }
  
  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    this.shuffleBtn.classList.toggle('active', this.isShuffle);
  }
  
  toggleRepeat() {
    this.isRepeat = !this.isRepeat;
    this.repeatBtn.classList.toggle('active', this.isRepeat);
  }
  
  toggleMute() {
    this.isMuted = !this.isMuted;
    const volumeIcon = this.volumeBtn.querySelector('.volume-icon');
    const muteIcon = this.volumeBtn.querySelector('.mute-icon');
    
    if (this.isMuted) {
      volumeIcon.style.display = 'none';
      muteIcon.style.display = 'block';
      this.volumeFill.style.width = '0%';
      this.volumeThumb.style.left = '0%';
    } else {
      volumeIcon.style.display = 'block';
      muteIcon.style.display = 'none';
      this.volumeFill.style.width = (this.volume * 100) + '%';
      this.volumeThumb.style.left = (this.volume * 100) + '%';
    }
  }
  
  seekTo(e) {
    const rect = this.progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    this.currentTime = Math.floor(percent * this.duration);
    this.updateProgress();
  }
  
  setVolume(e) {
    const rect = this.volumeSlider.getBoundingClientRect();
    this.volume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this.volumeFill.style.width = (this.volume * 100) + '%';
    this.volumeThumb.style.left = (this.volume * 100) + '%';
    
    if (this.volume === 0) {
      this.isMuted = true;
      this.volumeBtn.querySelector('.volume-icon').style.display = 'none';
      this.volumeBtn.querySelector('.mute-icon').style.display = 'block';
    } else if (this.isMuted) {
      this.isMuted = false;
      this.volumeBtn.querySelector('.volume-icon').style.display = 'block';
      this.volumeBtn.querySelector('.mute-icon').style.display = 'none';
    }
  }
  
  handleKeyboard(e) {
    switch(e.code) {
      case 'Space':
        e.preventDefault();
        this.togglePlay();
        break;
      case 'ArrowRight':
        this.currentTime = Math.min(this.currentTime + 10, this.duration);
        this.updateProgress();
        break;
      case 'ArrowLeft':
        this.currentTime = Math.max(this.currentTime - 10, 0);
        this.updateProgress();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.volume = Math.min(1, this.volume + 0.1);
        this.volumeFill.style.width = (this.volume * 100) + '%';
        this.volumeThumb.style.left = (this.volume * 100) + '%';
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.volume = Math.max(0, this.volume - 0.1);
        this.volumeFill.style.width = (this.volume * 100) + '%';
        this.volumeThumb.style.left = (this.volume * 100) + '%';
        break;
      case 'KeyM':
        this.toggleMute();
        break;
      case 'KeyN':
        this.nextTrack();
        break;
      case 'KeyP':
        this.prevTrack();
        break;
    }
  }
  
  startProgressSimulation() {
    setInterval(() => {
      if (this.isPlaying) {
        this.currentTime++;
        if (this.currentTime >= this.duration) {
          if (this.isRepeat) {
            this.currentTime = 0;
          } else {
            this.nextTrack();
          }
        }
        this.updateProgress();
      }
    }, 1000);
  }
  
  updateProgress() {
    const percent = (this.currentTime / this.duration) * 100;
    this.progressFill.style.width = percent + '%';
    this.progressThumb.style.left = percent + '%';
    this.currentTimeEl.textContent = this.formatTime(this.currentTime);
  }
  
  updateDisplay() {
    const track = this.tracks[this.currentTrack];
    this.trackTitle.textContent = track.title;
    this.trackArtist.textContent = track.artist;
    this.durationEl.textContent = this.formatTime(track.duration);
    this.updateProgress();
  }
  
  updatePlaylist() {
    this.playlist.querySelectorAll('.playlist-item').forEach((item, index) => {
      item.classList.toggle('active', index === this.currentTrack);
    });
  }
  
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new MusicPlayer();
});

console.log('🥔 Potato Beats - Music Player loaded!');
console.log('Keyboard shortcuts: Space (play/pause), ←→ (seek), ↑↓ (volume), M (mute), N (next), P (prev)');
