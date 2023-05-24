const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PLAYER_STORAGE_KEY = 'F8_PLAYER'
const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')   
const playBtn = $('.btn-toggle-play')  
const progress = $('#progress')  
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')
const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) ||{},
    songs: [
        
            {
               name: 'Vài câu nói có khiến người thay đổi',
               Singer: 'GreyD',
               path: './assets/music/Song1.mp3',
               image: './assets/img/Song1.png',
           },
           {
               name: 'Thuyền quyên',
               Singer: 'Diệu Kiên',
               path: './assets/music/Song2.mp3',
               image: './assets/img/Song2.jpg',
           },
           {
               name: 'Thanh xuân',
               Singer: 'Dalab',
               path: './assets/music/Song3.mp3',
               image: './assets/img/Song3.jpg',
           },
           {
               name: 'Sự thật đã bỏ quên',
               Singer: 'Hà Duy Thái',
               path: './assets/music/Song4.mp3',
               image: './assets/img/Song4.jpg',
           },
           {
               name: 'Quên người đã quá yêu',
               Singer: 'Hà Duy Thái',
               path: './assets/music/Song5.mp3',
               image: './assets/img/Song5.jpg',
           },
           {
               name: 'Lý do là gì',
               Singer: 'Nguyễn Vĩ',
               path: './assets/music/Song6.mp3',
               image: './assets/img/Song6.jpg',
           },
           {
               name: 'Hoa nở không màu',
               Singer: 'Hoài Lâm',
               path: './assets/music/Song7.mp3',
               image: './assets/img/Song7.jpg',
           },
           {
               name: 'Em có nghe',
               Singer: 'Kha',
               path: './assets/music/Song8.mp3',
               image: './assets/img/Song8.jpg',
           },
           {
               name: 'Dối lừa',
               Singer: 'Nguyễn Đình Vũ',
               path: './assets/music/Song9.mp3',
               image: './assets/img/Song9.jpg',
           },
           {
               name: 'Chạnh lòng thương cô 3',
               Singer: 'Duy Thắng',
               path: './assets/music/Song10.mp3',
               image: './assets/img/Song10.jpg',
           },
           {
               name: 'Bật tình yêu lên',
               Singer: 'Hòa Minzy, Tăng Duy Tân',
               path: './assets/music/Song11.mp3',
               image: './assets/img/Song11.jpg',
           }
       

    ],
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
       const htmls = this.songs.map((song, index) => {
        return `
        <div class="song ${index === this.currentIndex ? 'active' : ''}"data-index="${index}">
        <div class="thumb" style="background-image: url('${song.image}')">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.Singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>`
       })
      playList.innerHTML = htmls.join('')
    },
    defineProperties(){
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
       
    },
    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth
        //xu li cd quay
    const cdThumbAnimate =    cdThumb.animate([
            {transform : 'rotate(360deg'}
        ], {
            duration: 10000,
            iterations: Infinity
        }
        )
        cdThumbAnimate.pause()
        //xu li phong to / thu nho cd
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        // xu li khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
                
            }else{
                audio.play()
                
            }
           
        }
        // khi song duoc play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // khi song bi pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        // khi tien do bai hat thay doi
        audio.ontimeupdate = function(){
                if(audio.duration){
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercent
                }   
        }
        // xu li khi tua song 
        progress.onchange = function(e){
            const seekTime = audio.duration /100 * e.target.value
            audio.currentTime = seekTime
        }
        // khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            
            audio.play()
           _this.render()
           _this.scrollToActiveSong()
        }
        // khi prev song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
           
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // khi random song
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
            
        }
        // xu li phat lai bai hat
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        //xu li next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
           
        }
        //lang nghe hanh vi click vao play list
       playList.onclick = function(e){
        // xu li khi click vao song
        const songNode = e.target.closest('.song:not(.active)');
        if(songNode || e.target.closest('.option')){
            if(songNode){
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                audio.play()
                _this.render()
            }
            //xu li khi click vao option
            if(e.target.closest('.option')){

            }        
        }
       } 
    },
    scrollToActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: 'nearest',
            })
        }, 300)
    },
    
    loadCurrentSong: function(){
       
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >=  this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function(){
        let newIndex
        do{
         newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start : function() {
        // gan cau hinh tu config vao ung dung
        this.loadConfig()
        // Dinh nghia cac thuoc tinh cho object
        this.defineProperties()
        // lang nghe va su ly cac su kien
        this.handleEvents()
        // render lai danh sach bai hat
        this.render()
        //tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong()
        // hien thi trang thai ban dau cua btn repeat va random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
       
    },

}
app.start()