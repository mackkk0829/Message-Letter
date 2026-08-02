// ---------- Floating hearts background ----------
  const heartsBg = document.getElementById('heartsBg');
  const HEART_PATH = 'M12 21s-7.5-4.6-10-9.3C.4 8 2.3 4.5 5.8 4.1c2-.2 3.7.8 6.2 3.3 2.5-2.5 4.2-3.5 6.2-3.3 3.5.4 5.4 3.9 3.8 7.6C19.5 16.4 12 21 12 21z';

  function makeHeart(container, big){
    const el = document.createElement('div');
    el.className = 'heart';
    const size = big ? (18 + Math.random()*22) : (10 + Math.random()*14);
    const left = Math.random()*100;
    const duration = 9 + Math.random()*9;
    const delay = Math.random()*10;
    const drift = (Math.random()*80 - 40) + 'px';
    const scale = (0.7 + Math.random()*0.9).toFixed(2);
    const opac = (0.25 + Math.random()*0.4).toFixed(2);
    el.style.left = left + '%';
    el.style.setProperty('--drift', drift);
    el.style.setProperty('--s', scale);
    el.style.setProperty('--o', opac);
    el.style.animationDuration = duration + 's';
    el.style.animationDelay = delay + 's';
    el.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><path d="${HEART_PATH}"/></svg>`;
    container.appendChild(el);
  }

  for(let i=0;i<26;i++) makeHeart(heartsBg);

  // ---------- Envelope open interaction ----------
  const envelope = document.getElementById('envelope');
  const letterModal = document.getElementById('letterModal');
  const closeBtn = document.getElementById('closeBtn');
  const paperBody = document.getElementById('paperBody');
  const paperSign = document.getElementById('paperSign');
  const miniHearts = document.getElementById('miniHearts');

  const message =
`Happy GF Day, Mahal! ❤️

Simpleng paalala lang ito na ang bawat araw na kasama kita ay isang bagay na lubos kong pinasasalamatan.

Lalo na ngayong nagsimula na naman ang bagong buwan — salamat sa pagsama mo sa akin papasok ng August 1. Munti man 'yon para sa iba, para sa akin, doon ko lalo pang naramdaman kung gaano ako kaswerte na ikaw ang kasama ko sa simpleng araw-araw.

Salamat sa pagmamahal, sa pag-unawa, at sa pagiging ikaw. Sana patuloy nating gawing masaya ang bawat simula — hindi lang ng buwan, kundi pati ng bawat araw na magkasama tayo.

I love you, Mahal. Palagi.`;

  let typing = false;
  let typedOnce = false;

  function typeLetter(){
    if(typing) return;
    typing = true;
    paperBody.textContent = '';
    paperSign.classList.remove('show');
    let i = 0;
    const caret = document.createElement('span');
    caret.className = 'caret';

    function step(){
      if(i <= message.length){
        paperBody.textContent = message.slice(0, i);
        paperBody.appendChild(caret);
        i++;
        const ch = message[i-1];
        const delay = (ch === '\n') ? 90 : (Math.random()*18 + 12);
        setTimeout(step, delay);
      } else {
        caret.remove();
        typing = false;
        typedOnce = true;
        setTimeout(()=> paperSign.classList.add('show'), 250);
      }
    }
    step();
  }

  function burstHearts(){
    for(let i=0;i<14;i++) makeHeart(miniHearts, true);
    setTimeout(()=>{ miniHearts.innerHTML = ''; }, 12000);
  }

  function openLetter(){
    envelope.classList.add('open');
    setTimeout(()=>{
      letterModal.classList.add('show');
      burstHearts();
      typeLetter();
    }, 550);
  }

  function closeLetter(){
    letterModal.classList.remove('show');
    setTimeout(()=>{ envelope.classList.remove('open'); }, 300);
  }

  envelope.addEventListener('click', openLetter);
  closeBtn.addEventListener('click', (e)=>{ e.stopPropagation(); closeLetter(); });
  letterModal.addEventListener('click', (e)=>{
    if(e.target === letterModal) closeLetter();
  });

  // ---------- Background music: "Minamahal" by Earl Agustin ----------
  const YT_VIDEO_ID = 'IvnVeQ-so8Q';
  const musicToggle = document.getElementById('musicToggle');
  let ytPlayer = null;
  let ytReady = false;
  let isPlaying = false;

  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);

  window.onYouTubeIframeAPIReady = function(){
    ytPlayer = new YT.Player('ytPlayer', {
      height: '1',
      width: '1',
      videoId: YT_VIDEO_ID,
      playerVars: { autoplay: 0, controls: 0, disablekb: 1, loop: 1, playlist: YT_VIDEO_ID },
      events: {
        onReady: function(){
          ytReady = true;
          musicToggle.classList.add('ready');
        },
        onStateChange: function(e){
          isPlaying = (e.data === YT.PlayerState.PLAYING);
          musicToggle.classList.toggle('paused', !isPlaying);
        }
      }
    });
  };

  function playMusic(){
    if(ytReady && ytPlayer && !isPlaying){
      ytPlayer.setVolume(55);
      ytPlayer.playVideo();
    }
  }

  function toggleMusic(){
    if(!ytReady) return;
    if(isPlaying){ ytPlayer.pauseVideo(); }
    else { ytPlayer.playVideo(); }
  }

  musicToggle.addEventListener('click', toggleMusic);

  // start the song the moment she opens the envelope
  envelope.addEventListener('click', playMusic);
