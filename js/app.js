/* =========================================================
   Portfolio Quest — game state, interactions, rendering
   ========================================================= */
(() => {
  const $ = s => document.querySelector(s);
  const { PATCHES, QUESTS, LEVELS, LEVEL_TEXT, STATS, PROFILE } = window;
  const STORE_KEY = 'subin-portfolio-quest-v1';
  const compactMQ = matchMedia('(max-width: 860px), (max-height: 600px)');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BADGE_ICONS = ['🧵', '🍙', '🔄', '🎢', '📎', '🔎', '✏️', '🎈', '🗂', '✉️', '🐞', '🏆'];
  const STAGES = ['', '알', '말랑이 아기', '새싹 말랑이', '베레모 디자이너', '마스터 디자이너'];
  const PET_LINES = [
    [],
    ['따뜻하게 품어주세요', '알이 꿈틀…', '톡톡, 누구세요?'],
    ['안녕! 반가워', '패치 구경할래?', '말랑말랑~'],
    ['새싹이 간질간질', '프로젝트 더 보여줘!', '호기심 충전 중'],
    ['베레모 어때?', '픽셀 하나도 소중해', '여백이 좋아'],
    ['오늘도 디자인 ✦', '연락해줘서 고마워!', '우린 최고의 팀'],
  ];

  /* ---------- State ---------- */
  const defaults = { xp: 0, done: {}, seen: [], stuck: [], petName: '몰랑이', feeds: 0, sound: true };
  let state = load();
  function load() {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(STORE_KEY) || '{}') }; }
    catch { return { ...defaults }; }
  }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* private mode */ } }

  const levelOf = xp => LEVELS.reduce((lv, min, i) => (xp >= min ? i + 1 : lv), 1);
  const maxLevel = LEVELS.length;

  /* ---------- Sound (WebAudio blips) ---------- */
  let audio;
  function tone(freq, dur = 0.08, type = 'square', delay = 0, vol = 0.05) {
    if (!state.sound) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const t = audio.currentTime + delay;
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(audio.destination);
      o.start(t); o.stop(t + dur + 0.02);
    } catch { /* no audio */ }
  }
  const sfx = {
    click: () => tone(660, 0.05, 'triangle'),
    coin: () => { tone(988, 0.07); tone(1319, 0.14, 'square', 0.07); },
    pop: () => { tone(220, 0.08, 'sine', 0, 0.12); tone(440, 0.1, 'triangle', 0.04); },
    level: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.14, 'square', i * 0.1)),
    yum: () => { tone(500, 0.06, 'sine', 0, .1); tone(700, 0.06, 'sine', 0.08, .1); },
  };

  /* ---------- XP & quests ---------- */
  const levelQueue = [];
  function addXP(n, x, y) {
    const before = levelOf(state.xp);
    state.xp += n;
    save();
    floatText(`+${n} XP`, x, y);
    sfx.coin();
    const after = levelOf(state.xp);
    for (let lv = before + 1; lv <= after; lv++) levelQueue.push(lv);
    renderAll(true);
    if (levelQueue.length) setTimeout(showLevelUp, 500);
  }
  function complete(id, x, y) {
    if (state.done[id]) return;
    const q = QUESTS.find(q => q.id === id);
    if (!q) return;
    state.done[id] = true;
    toast(BADGE_ICONS[QUESTS.indexOf(q)], `퀘스트 완료 · ${q.title}`, q.xp);
    addXP(q.xp, x, y);
  }
  const center = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 3]; };

  function floatText(text, x = innerWidth / 2, y = innerHeight / 2) {
    const el = document.createElement('div');
    el.className = 'xp-float';
    el.textContent = text;
    el.style.left = x - 30 + 'px';
    el.style.top = y - 10 + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }
  function toast(icon, text, xp) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<i>${icon}</i><span>${text}</span>${xp ? `<b>+${xp}</b>` : ''}`;
    $('#toasts').appendChild(el);
    setTimeout(() => el.remove(), 3300);
  }

  /* ---------- Level-up ---------- */
  function showLevelUp() {
    if (!levelQueue.length || !$('#levelup').hidden) return;
    const lv = levelQueue.shift();
    Pixel.drawPet($('#luPet'), lv, 'happy');
    $('#luLv').textContent = `LV.${lv} · ${STAGES[lv]}`;
    $('#luText').textContent = LEVEL_TEXT[lv];
    $('#levelup').hidden = false;
    $('#luOk').focus();
    sfx.level();
    confetti();
  }
  $('#luOk').addEventListener('click', () => {
    $('#levelup').hidden = true;
    if (levelQueue.length) setTimeout(showLevelUp, 250);
  });

  /* ---------- Rendering ---------- */
  let shownXp = state.xp;
  function renderAll(animate = false) {
    const lv = levelOf(state.xp);
    const lo = LEVELS[lv - 1], hi = LEVELS[lv] ?? LEVELS[lv - 1];
    const pct = lv >= maxLevel ? 100 : ((state.xp - lo) / (hi - lo)) * 100;
    const doneCount = Object.keys(state.done).length;

    // HUD
    $('#hudLevel').textContent = `LV.${lv}`;
    $('#xpFill').style.width = pct + '%';
    $('#xpText').textContent = lv >= maxLevel ? `${state.xp} XP · MAX LEVEL ✦` : `${state.xp} / ${hi} XP`;
    $('#questCount').textContent = `${doneCount}/${QUESTS.length}`;
    $('#btnSound').setAttribute('aria-pressed', String(state.sound));
    Pixel.drawPet($('#hudPet'), lv);

    // Card
    $('#cardLevel').textContent = `LV.${lv}`;
    const vip = lv >= maxLevel;
    $('#card').classList.toggle('vip', vip);
    $('#cardTier').textContent = vip ? 'VIP VISITOR' : 'VISITOR';
    $('#bLevel').textContent = `${lv} (${STAGES[lv]})`;
    $('#bXp').textContent = state.xp;
    $('#bPatches').textContent = `${state.seen.length} / ${PATCHES.length}`;
    $('#bPet').textContent = state.petName;
    countDigits(animate);
    renderStickers();

    // Gotchi
    $('#gLevel').textContent = `LV.${lv}`;
    $('#gHearts').textContent = '♥'.repeat(Math.min(3, state.feeds)) + '♡'.repeat(Math.max(0, 3 - state.feeds));
    $('#petCanvas').classList.toggle('wobble', lv === 1);
    drawPetNow();

    // Patches
    document.querySelectorAll('.patch').forEach(el => {
      el.classList.toggle('seen', state.seen.includes(el.dataset.id));
      el.classList.toggle('stuck', state.stuck.includes(el.dataset.id));
    });

    renderSheet(lv);
    renderReceipt();
  }

  function countDigits(animate) {
    const canvas = $('#xpDigits');
    const color = $('#card').classList.contains('vip') ? '#4a3f55' : '#fffaf0';
    if (!animate || reduceMotion) { shownXp = state.xp; Pixel.drawDigits(canvas, shownXp, color); return; }
    const from = shownXp, to = state.xp, t0 = performance.now();
    const step = now => {
      const k = Math.min(1, (now - t0) / 800);
      shownXp = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      Pixel.drawDigits(canvas, shownXp, color);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const STICKER_SLOTS = [
    { l: 70, t: 56, r: 12 }, { l: -4, t: 58, r: -12 }, { l: 38, t: 64, r: 6 },
    { l: 82, t: 20, r: -8 }, { l: 22, t: 46, r: 14 }, { l: 54, t: 42, r: -16 }, { l: 8, t: 22, r: 4 },
  ];
  function renderStickers() {
    const box = $('#stickers');
    const have = [...box.children].map(c => c.dataset.id);
    if (have.join() === state.stuck.join()) return;
    box.innerHTML = '';
    state.stuck.forEach((id, i) => {
      const p = PATCHES.find(p => p.id === id);
      const s = STICKER_SLOTS[i % STICKER_SLOTS.length];
      const el = document.createElement('div');
      el.className = 'mini';
      el.dataset.id = id;
      el.style.cssText = `left:${s.l}%;top:${s.t}%;transform:rotate(${s.r}deg)`;
      el.innerHTML = Pixel.patchSVG(p).replace(/id="p-/g, 'id="m-').replace(/#p-/g, '#m-');
      box.appendChild(el);
    });
  }

  function renderSheet(lv) {
    $('#sLevel').textContent = `LV.${lv}`;
    $('#sStage').textContent = STAGES[lv];
    $('#sDesc').textContent = LEVEL_TEXT[lv];
    if (document.activeElement !== $('#petName')) $('#petName').value = state.petName;
    Pixel.drawPet($('#sheetPet'), lv, 'happy');

    const revealed = new Set(state.seen.map(id => PATCHES.find(p => p.id === id)?.stat));
    $('#statList').innerHTML = Object.entries(STATS).map(([key, s]) => {
      const on = revealed.has(key);
      return `<li class="${on ? '' : 'locked'}">
        <span>${on ? s.label : '???'}</span>
        <span class="stat-bar"><i style="width:${on ? s.value : 0}%;background-color:${s.color}"></i></span>
        <b>${on ? s.value : '🔒'}</b></li>`;
    }).join('');

    $('#badgeList').innerHTML = QUESTS.map((q, i) =>
      `<li class="${state.done[q.id] ? 'on' : ''}" title="${state.done[q.id] || !q.hidden ? q.title : '???'}">${BADGE_ICONS[i]}</li>`).join('');

    const resume = $('#resumeBtn');
    const open = lv >= maxLevel;
    resume.setAttribute('aria-disabled', String(!open));
    resume.textContent = open ? '📄 이력서 받기' : `🔒 이력서 (LV.${maxLevel} 해금)`;
    resume.href = open ? PROFILE.resumeUrl : '#';
  }

  function renderReceipt() {
    $('#questList').innerHTML = QUESTS.map(q => {
      const done = !!state.done[q.id];
      const title = q.hidden && !done ? '? ? ? ? ? ? ?' : q.title;
      return `<li class="${done ? 'done' : ''}"><span>${done ? '☑' : '☐'}</span><span>${title}</span><b>+${q.xp}</b></li>`;
    }).join('');
    $('#rTotal').textContent = state.xp + ' XP';
  }

  /* ---------- Pet ---------- */
  let petMood = 'idle', moodTimer;
  function drawPetNow() { Pixel.drawPet($('#petCanvas'), levelOf(state.xp), petMood); }
  function setMood(mood, ms = 1400) {
    petMood = mood; drawPetNow();
    clearTimeout(moodTimer);
    moodTimer = setTimeout(() => { petMood = 'idle'; drawPetNow(); }, ms);
  }
  function petSay(text) { $('#gMsg').textContent = text; }
  setInterval(() => { if (petMood === 'idle') setMood('blink', 160); }, 3200);
  setInterval(() => {
    const lines = PET_LINES[levelOf(state.xp)];
    petSay(lines[Math.floor(Math.random() * lines.length)]);
  }, 6000);

  $('#gotchi').addEventListener('click', e => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    sfx.click();
    const act = btn.dataset.act;
    const lv = levelOf(state.xp);
    if (act === 'feed') {
      state.feeds++; save();
      sfx.yum();
      setMood('happy');
      petSay(lv === 1 ? '알이 따끈따끈해졌어요' : '냠냠! 맛있어 ♥');
      complete('feed', ...center(btn));
      renderAll();
    } else if (act === 'play') {
      const c = $('#petCanvas');
      c.classList.remove('jump'); void c.offsetWidth; c.classList.add('jump');
      setTimeout(() => c.classList.remove('jump'), 1400);
      setMood('happy');
      petSay(lv === 1 ? '데굴데굴~' : '와아 신난다!');
      complete('play', ...center(btn));
    } else {
      openSheet();
    }
  });

  $('#petName').addEventListener('change', e => {
    const v = e.target.value.trim().slice(0, 10);
    if (!v) { e.target.value = state.petName; return; }
    state.petName = v; save();
    complete('name', ...center(e.target));
    renderAll();
  });

  /* ---------- Patches ---------- */
  const mat = $('#mat');
  const sleeve = $('#sleeve');
  function buildPatches() {
    const wrap = $('#patches');
    PATCHES.forEach((p, i) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'patch';
      el.dataset.id = p.id;
      el.setAttribute('aria-label', `${p.project.name} — 프로젝트 보기`);
      el.style.left = p.x + '%';
      el.style.top = p.y + '%';
      el.style.width = p.w + 'px';
      el.style.setProperty('--rot', p.rot + 'deg');
      el.style.setProperty('--delay', 0.2 + i * 0.12 + 's');
      el.innerHTML = Pixel.patchSVG(p);
      wrap.appendChild(el);
      enablePatchDrag(el, p);
    });
  }

  const overSleeve = (x, y) => {
    const r = sleeve.getBoundingClientRect();
    return x > r.left && x < r.right && y > r.top && y < r.bottom;
  };

  function enablePatchDrag(el, p) {
    let start = null, dragged = false, suppressClick = false;
    el.addEventListener('pointerdown', e => {
      if (compactMQ.matches || e.button !== 0) return;
      const r = mat.getBoundingClientRect();
      start = { x: e.clientX, y: e.clientY, left: parseFloat(el.style.left), top: parseFloat(el.style.top), w: r.width, h: r.height };
      dragged = false;
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener('pointermove', e => {
      if (!start) return;
      const dx = e.clientX - start.x, dy = e.clientY - start.y;
      if (!dragged && Math.hypot(dx, dy) < 6) return;
      if (!dragged) { dragged = true; el.classList.add('dragging'); sfx.click(); }
      el.style.left = start.left + (dx / start.w) * 100 + '%';
      el.style.top = start.top + (dy / start.h) * 100 + '%';
      sleeve.classList.toggle('drop-ready', overSleeve(e.clientX, e.clientY) && !state.stuck.includes(p.id));
    });
    const end = e => {
      if (!start) return;
      start = null;
      el.classList.remove('dragging');
      sleeve.classList.remove('drop-ready');
      if (!dragged) return;
      suppressClick = true;
      if (overSleeve(e.clientX, e.clientY)) stickPatch(p.id, e.clientX, e.clientY);
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('click', () => {
      if (suppressClick) { suppressClick = false; return; }
      openFolder(p);
    });
  }

  function stickPatch(id, x, y) {
    if (state.stuck.includes(id)) { toast('📎', '이미 붙어 있는 패치예요'); return; }
    state.stuck.push(id); save();
    sfx.pop();
    kick(2.2 * (Math.random() > 0.5 ? 1 : -1));
    renderAll();
    if (!state.seen.includes(id)) markSeen(PATCHES.find(p => p.id === id), x, y);
    complete('stick1', x, y);
    if (state.stuck.length >= 3) complete('stick3', x, y);
  }

  /* ---------- Project folder ---------- */
  const folder = $('#folder');
  let currentPatch = null;
  function markSeen(p, x, y) {
    state.seen.push(p.id); save();
    toast('🔎', `${STATS[p.stat].label} 스킬 공개!`, 40);
    addXP(40, x, y);
    complete('firstPatch', x, y - 30);
    if (state.seen.length >= 4) complete('view4', x, y - 60);
    if (state.seen.length >= PATCHES.length) complete('allPatch', x, y - 90);
  }

  function openFolder(p) {
    currentPatch = p;
    const d = p.project;
    sfx.click();
    $('#fTab').textContent = `PROJECT FILE · No.${String(PATCHES.indexOf(p) + 1).padStart(2, '0')}`;
    $('#fImg').style.background = `radial-gradient(${p.edge}55 1.5px, transparent 2px) 0 0 / 14px 14px, ${p.fill}`;
    $('#fImg').innerHTML = Pixel.patchSVG(p).replace(/id="p-/g, 'id="f-').replace(/#p-/g, '#f-');
    $('#fCaption').textContent = d.name.replace(/[“”"]/g, '');
    $('#fPeriod').textContent = d.period;
    $('#fTitle').textContent = d.name;
    $('#fRole').textContent = d.role;
    $('#fSummary').textContent = d.summary;
    $('#fProblem').textContent = d.problem;
    $('#fOutcome').textContent = d.outcome;
    $('#fProcess').innerHTML = d.process.map(s => `<li>${s}</li>`).join('');
    $('#fMetrics').innerHTML = d.metrics.map((m, i) => `<div class="stamp" style="--r:${[-4, 3, -2][i % 3]}deg"><b>${m.v}</b><span>${m.l}</span></div>`).join('');
    $('#fTags').innerHTML = d.tags.map(t => `<span>${t}</span>`).join('');
    updateStickBtn();
    folder.showModal();
    folder.querySelector('.folder-body').scrollTop = 0;
    if (!state.seen.includes(p.id)) setTimeout(() => markSeen(p, innerWidth / 2, innerHeight / 3), 350);
  }
  function updateStickBtn() {
    const stuck = currentPatch && state.stuck.includes(currentPatch.id);
    $('#fStick').disabled = stuck;
    $('#fStick').textContent = stuck ? '출입증에 붙어 있어요 ✓' : '출입증에 붙이기 ✦';
  }
  $('#fStick').addEventListener('click', e => {
    if (!currentPatch) return;
    stickPatch(currentPatch.id, e.clientX, e.clientY);
    updateStickBtn();
  });

  /* ---------- Lanyard physics ---------- */
  const rig = $('#rig');
  let theta = 0.18, omega = 0, grabbing = null, strapLen = 300;
  const K = 16, DAMP = 1.5;
  function layoutRig() {
    const h = mat.clientHeight;
    strapLen = Math.max(120, Math.min(360, h * 0.36));
    rig.style.setProperty('--strap', strapLen + 'px');
  }
  function kick(w) { omega += w; }
  function pivot() {
    const r = mat.getBoundingClientRect();
    return [r.left + r.width * 0.58, r.top - 10];
  }
  let last = performance.now();
  function tick(now) {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    if (!grabbing && !compactMQ.matches) {
      const breeze = Math.sin(now / 1700) * 0.04;
      omega += (-K * Math.sin(theta) - DAMP * omega + breeze) * dt;
      theta += omega * dt;
    }
    rig.style.transform = `rotate(${theta}rad)`;
    requestAnimationFrame(tick);
  }

  let cardMoved = false;
  sleeve.addEventListener('pointerdown', e => {
    if (compactMQ.matches || e.button !== 0) return;
    const [px, py] = pivot();
    const a = -Math.atan2(e.clientX - px, e.clientY - py);
    grabbing = { offset: theta - a, sx: e.clientX, sy: e.clientY, lastT: performance.now(), lastTheta: theta };
    cardMoved = false;
    omega = 0;
    sleeve.setPointerCapture(e.pointerId);
    sleeve.style.cursor = 'grabbing';
  });
  sleeve.addEventListener('pointermove', e => {
    if (!grabbing) return;
    if (Math.hypot(e.clientX - grabbing.sx, e.clientY - grabbing.sy) > 5) cardMoved = true;
    const [px, py] = pivot();
    const a = -Math.atan2(e.clientX - px, e.clientY - py);
    const next = Math.max(-1.3, Math.min(1.3, a + grabbing.offset));
    const t = performance.now();
    const dt = Math.max(0.008, (t - grabbing.lastT) / 1000);
    omega = omega * 0.5 + ((next - grabbing.lastTheta) / dt) * 0.5;
    grabbing.lastT = t; grabbing.lastTheta = next;
    theta = next;
  });
  const releaseCard = () => {
    if (!grabbing) return;
    grabbing = null;
    sleeve.style.cursor = '';
    if (!cardMoved) { omega = 0; return; }
    omega = Math.max(-9, Math.min(9, omega));
    if (Math.abs(omega) > 3.2) {
      const [x, y] = center(sleeve);
      setTimeout(() => complete('swing', x, y), 200);
    }
  };
  sleeve.addEventListener('pointerup', releaseCard);
  sleeve.addEventListener('pointercancel', releaseCard);
  sleeve.addEventListener('click', () => { if (!cardMoved) flipCard(); cardMoved = false; });
  sleeve.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flipCard(); }
    if (e.key === 'ArrowLeft') kick(-2.5);
    if (e.key === 'ArrowRight') kick(2.5);
  });
  function flipCard() {
    $('#card').classList.toggle('flipped');
    sfx.click();
    kick(0.8);
    complete('flip', ...center(sleeve));
  }

  /* ---------- Rulers ---------- */
  function buildRulers() {
    const r = mat.getBoundingClientRect();
    const step = compactMQ.matches ? 24 : 48;
    const top = Math.floor((r.width - 36) / step);
    const side = Math.floor((r.height - 36) / step);
    $('#rulerTop').innerHTML = Array.from({ length: top }, (_, i) => `<span style="left:${(i + 1) * step}px">${i + 1}</span>`).join('');
    const sideHtml = Array.from({ length: side }, (_, i) => `<span style="top:${(i + 1) * step - 6}px">${i + 1}</span>`).join('');
    $('#rulerLeft').innerHTML = sideHtml;
    $('#rulerRight').innerHTML = sideHtml;
  }

  /* ---------- Panels ---------- */
  const receipt = $('#receipt'), sheet = $('#sheet');
  function openSheet() { receipt.hidden = true; sheet.hidden = false; renderAll(); }
  $('#btnQuest').addEventListener('click', () => { sfx.click(); sheet.hidden = true; receipt.hidden = !receipt.hidden; });
  $('#btnSheet').addEventListener('click', () => { sfx.click(); sheet.hidden ? openSheet() : (sheet.hidden = true); });
  $('#btnContact').addEventListener('click', () => {
    sfx.click();
    Pixel.drawPet($('#stampPet'), levelOf(state.xp), 'happy');
    $('#postcard').showModal();
    complete('contact', innerWidth / 2, innerHeight / 3);
  });
  $('#btnSound').addEventListener('click', () => { state.sound = !state.sound; save(); renderAll(); sfx.click(); });
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-close]');
    if (c) {
      const target = document.getElementById(c.dataset.close);
      target.tagName === 'DIALOG' ? target.close() : (target.hidden = true);
      return;
    }
    if (!receipt.hidden && !e.target.closest('#receipt, #btnQuest')) receipt.hidden = true;
  });
  document.querySelectorAll('dialog').forEach(d =>
    d.addEventListener('click', e => { if (e.target === d) d.close(); }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { receipt.hidden = true; sheet.hidden = true; }
  });
  $('#resetBtn').addEventListener('click', () => {
    if (!confirm('진행 상황을 모두 지우고 새 게임을 시작할까요?')) return;
    try { localStorage.removeItem(STORE_KEY); } catch { /* ignore */ }
    location.reload();
  });

  /* ---------- Contact ---------- */
  $('#pcEmail').textContent = '✉ ' + PROFILE.email;
  $('#pcEmail').href = 'mailto:' + PROFILE.email;
  $('#pcLinks').innerHTML = PROFILE.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener">↗ ${l.label}</a>`).join('');

  /* ---------- Ladybug easter egg ---------- */
  const bug = $('#ladybug');
  Pixel.drawBug($('#bugCanvas'));
  if (state.done.secret) bug.hidden = true;
  bug.style.transition = 'top 7s linear, opacity .2s, transform .3s';
  setInterval(() => { if (!compactMQ.matches) bug.style.top = 20 + Math.random() * 60 + '%'; }, 7000);
  bug.addEventListener('click', () => {
    const [x, y] = center(bug);
    bug.classList.add('found');
    setTimeout(() => (bug.hidden = true), 1200);
    toast('🐞', '무당벌레를 찾았어요! 행운 +1');
    complete('secret', x, y);
  });

  /* ---------- Confetti ---------- */
  function confetti() {
    if (reduceMotion) return;
    const c = $('#confetti'), ctx = c.getContext('2d');
    c.width = innerWidth; c.height = innerHeight;
    const colors = ['#ffb3c7', '#d9c8f5', '#bde0fe', '#fff1a8', '#c8f0dc', '#ffd6a5'];
    const bits = Array.from({ length: 140 }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight / 2,
      vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 16 - 4,
      r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
      w: 6 + Math.random() * 8, h: 4 + Math.random() * 6,
      c: colors[(Math.random() * colors.length) | 0], round: Math.random() > 0.6,
    }));
    const t0 = performance.now();
    (function frame(now) {
      ctx.clearRect(0, 0, c.width, c.height);
      bits.forEach(b => {
        b.vy += 0.45; b.vx *= 0.99; b.x += b.vx; b.y += b.vy; b.r += b.vr;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r); ctx.fillStyle = b.c;
        if (b.round) { ctx.beginPath(); ctx.arc(0, 0, b.w / 2, 0, Math.PI * 2); ctx.fill(); }
        else ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
        ctx.restore();
      });
      if (now - t0 < 2600) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, c.width, c.height);
    })(t0);
  }

  /* ---------- Boot ---------- */
  function today() {
    const d = new Date();
    const m = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][d.getMonth()];
    return `${d.getDate()} ${m} ${d.getFullYear()}`;
  }
  $('#cardDate').textContent = today();
  $('#rDate').textContent = today().toUpperCase();

  buildPatches();
  layoutRig();
  buildRulers();
  renderAll();
  requestAnimationFrame(tick);
  addEventListener('resize', () => { layoutRig(); buildRulers(); });

  // 하단 탭 로딩 → HUD
  const t0 = performance.now(), DUR = reduceMotion ? 200 : 1800;
  (function load(now) {
    const k = Math.min(1, (now - t0) / DUR);
    $('#loadPct').textContent = Math.round(k * 100);
    if (k < 1) return requestAnimationFrame(load);
    setTimeout(() => {
      $('#dockLoading').hidden = true;
      $('#dockHud').hidden = false;
      if (!state.xp) toast('🧵', '환영해요! 패치를 눌러 탐험을 시작하세요');
    }, 250);
  })(t0);
})();
