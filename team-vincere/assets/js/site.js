/* ============================================================
   TEAM VINCERE. Shared site script (all pages)
   CONFIG: set these three, then you're live.
   ============================================================ */
(function(){
  var FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbwLUygnsvj4Dubx-ezvFSCKdSzaJw4yirQmuXfbjUCH0a6xvaiSq7r6mYrBLDvqAnVzyQ/exec";  // Google Apps Script /exec URL (applications + leads)
  var STRIPE_LINK   = "https://buy.stripe.com/5kQ3cwcn06vwaSp9WRgw000";  // 12-Week program ($97)
  var MARK_VIDEO    = "https://youtube.com/shorts/ohGumv4unZo"; // Mark's testimonial
  var APP_LINK      = "";  // your Vincere app URL (login/signup) for "join / track in the app" CTAs
  // Coaching (Vincere Standard) Stripe Payment Links, by term:
  var STRIPE_MONTHLY = "https://buy.stripe.com/7sY6oIfzc6vw0dLb0Vgw001";  // $450 / month
  var STRIPE_6MONTH  = "https://buy.stripe.com/6oUfZibiW8DE1hP3ytgw002";  // $2,500 / 6 months
  var STRIPE_YEARLY  = "https://buy.stripe.com/dRm7sM3Qu0781hP4Cxgw003";  // $4,200 / 12 months
  window.VINCERE_FORM_ENDPOINT = FORM_ENDPOINT;  // exposed so standalone pages (calculator) can post leads
  window.VINCERE_APP_LINK = APP_LINK;

  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---------- current page ---------- */
  var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if(path==='') path='index.html';
  var page = path.replace('.html','');
  if(page==='' || page==='index') page='home';

  /* ---------- inject atmosphere + cursor ---------- */
  function el(html){ var d=document.createElement('div'); d.innerHTML=html.trim(); return d.firstChild; }
  document.body.insertBefore(el('<div class="grain"></div>'), document.body.firstChild);
  document.body.insertBefore(el('<div class="vignette"></div>'), document.body.firstChild);
  var cring=el('<div class="cur-ring" id="cring"></div>'), cdot=el('<div class="cur-dot" id="cdot"></div>');
  document.body.appendChild(cring); document.body.appendChild(cdot);

  /* ---------- inject nav ---------- */
  var links=[
    ['about','About'],['coaching','Coaching'],['programs','Programs'],
    ['calculator','Calculator'],['shop','Shop'],['articles','Articles'],['ebook','Ebook']
  ];
  var linksHTML=links.map(function(l){
    return '<a href="'+l[0]+'.html"'+(page===l[0]?' class="active"':'')+'>'+l[1]+'</a>';
  }).join('');
  var nav=el(
    '<nav class="nav" id="nav">'+
      '<a href="index.html" class="brand"><span class="chrome">Vincere</span></a>'+
      '<div class="nav-links" id="navLinks">'+linksHTML+
        '<a href="apply.html" class="nav-cta'+(page==='apply'?' active':'')+'" data-hot>Apply</a>'+
      '</div>'+
      '<button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>'+
    '</nav>'
  );
  document.body.insertBefore(nav, document.body.firstChild.nextSibling);

  /* mobile menu */
  var toggle=document.getElementById('navToggle');
  function setMenu(open){ nav.classList.toggle('open',open); toggle.setAttribute('aria-expanded',open?'true':'false'); document.body.style.overflow=open?'hidden':''; }
  toggle.addEventListener('click',function(){ setMenu(!nav.classList.contains('open')); });
  document.getElementById('navLinks').addEventListener('click',function(e){ if(e.target.tagName==='A') setMenu(false); });

  /* nav stuck */
  function onNavScroll(){ nav.classList.toggle('stuck', window.scrollY>40); }
  onNavScroll(); window.addEventListener('scroll',onNavScroll,{passive:true});

  /* ---------- inject footer ---------- */
  if(!document.querySelector('.site-footer')){
    var yr=new Date().getFullYear();
    var footer=el(
      '<footer class="site-footer">'+
        '<div class="wrap foot-grid">'+
          '<div class="foot-brand"><div class="fb chrome">Vincere</div><p class="tl2">To conquer.</p></div>'+
          '<div class="foot-col"><h4>Explore</h4><a href="about.html">About</a><a href="coaching.html">Coaching</a><a href="programs.html">Programs</a><a href="shop.html">Shop</a><a href="articles.html">Articles</a></div>'+
          '<div class="foot-col"><h4>Start here</h4><a href="calculator.html">Macro calculator</a><a href="ebook.html">Free training guide</a><a href="guide.html">The 12-week guide</a><a href="apply.html">Apply for coaching</a></div>'+
          '<div class="foot-col"><h4>Connect</h4><a href="https://instagram.com/phildaveg_" target="_blank" rel="noopener">Instagram</a><a href="apply.html">Book a call</a></div>'+
        '</div>'+
        '<div class="wrap foot-btm"><span>&copy; '+yr+' Team Vincere. By application only.</span><span>Vincere. To conquer.</span></div>'+
      '</footer>'
    );
    document.body.appendChild(footer);
  }

  /* ---------- inject ebook sticky tab + popup (every page) ---------- */
  var fab = el('<button class="ebook-fab" id="ebookFab" data-hot aria-label="Get the free Vincere Training Guide">Free Guide <span class="fab-arw">&darr;</span></button>');
  document.body.appendChild(fab);
  var modal = el(
    '<div class="ebook-modal" id="ebookModal" aria-hidden="true"><div class="ebook-modal-inner">'+
      '<button class="ebook-modal-close" id="ebookModalClose" aria-label="Close">&times;</button>'+
      '<span class="eyebrow">Free download</span>'+
      '<h3>The Vincere Training Guide.</h3>'+
      '<p>My coaching philosophy in one guide: training, nutrition, cardio, and mindset. Drop your email and it is yours, free.</p>'+
      '<form id="ebookModalForm" novalidate>'+
        '<input type="text" name="name" placeholder="First name" required />'+
        '<input type="email" name="email" placeholder="Your best email" required />'+
        '<button type="submit" class="btn btn-solid" data-hot>Send it to me <span class="arw">&rarr;</span></button>'+
        '<span class="ebook-err"></span>'+
      '</form>'+
      '<div class="modal-done" id="ebookModalDone"><p style="color:var(--silver);text-align:center;padding:8px 0 14px">It is yours. Tap below to download it.</p><a class="btn btn-solid" href="assets/the-vincere-training-guide.pdf" download style="width:100%;justify-content:center">Download the guide <span class="arw">&rarr;</span></a></div>'+
    '</div></div>'
  );
  document.body.appendChild(modal);

  /* ---------- reveals ---------- */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.14,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.rv:not(.in)').forEach(function(x){ io.observe(x); });

  /* ---------- count-up ---------- */
  function countUp(x){
    var target=parseFloat(x.getAttribute('data-count')), suffix=x.getAttribute('data-suffix')||'';
    var dec=(target%1!==0)?1:0, start=null, dur=1600;
    if(reduce){ x.textContent=target.toFixed(dec)+suffix; return; }
    function step(t){ if(!start)start=t; var p=Math.min((t-start)/dur,1); var e=1-Math.pow(1-p,3);
      x.textContent=(target*e).toFixed(dec)+suffix; if(p<1)requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  var cio=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ countUp(e.target); cio.unobserve(e.target);} }); },{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(x){ cio.observe(x); });

  /* ---------- custom cursor ---------- */
  if(!reduce && window.matchMedia('(hover:hover)').matches){
    var rx=0,ry=0,mx=0,my=0;
    window.addEventListener('mousemove',function(e){ mx=e.clientX;my=e.clientY; cdot.style.transform='translate('+mx+'px,'+my+'px) translate(-50%,-50%)'; });
    (function loop(){ rx+=(mx-rx)*.18; ry+=(my-ry)*.18; cring.style.transform='translate('+rx+'px,'+ry+'px) translate(-50%,-50%)'; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover',function(e){ if(e.target.closest('a,button,[data-hot],.ba-slider')) cring.classList.add('hot'); });
    document.addEventListener('mouseout',function(e){ if(e.target.closest('a,button,[data-hot],.ba-slider')) cring.classList.remove('hot'); });
  }

  /* ---------- before/after slider ---------- */
  (function(){
    var s=document.getElementById('baSlider'), after=document.getElementById('baAfter'), h=document.getElementById('baHandle');
    if(!s)return; var drag=false;
    function set(x){ var r=s.getBoundingClientRect(); var p=Math.max(0,Math.min(1,(x-r.left)/r.width)); var pct=p*100; after.style.clipPath='inset(0 0 0 '+pct+'%)'; h.style.left=pct+'%'; }
    function down(e){ drag=true; set((e.touches?e.touches[0].clientX:e.clientX)); }
    function move(e){ if(!drag)return; set((e.touches?e.touches[0].clientX:e.clientX)); if(e.cancelable)e.preventDefault(); }
    s.addEventListener('mousedown',down); s.addEventListener('touchstart',down,{passive:true});
    window.addEventListener('mousemove',move); window.addEventListener('touchmove',move,{passive:false});
    window.addEventListener('mouseup',function(){drag=false;}); window.addEventListener('touchend',function(){drag=false;});
  })();

  /* ---------- multi-step application form ---------- */
  (function(){
    var form=document.getElementById('applyForm'); if(!form)return;
    var steps=form.querySelectorAll('.fstep'), segs=document.querySelectorAll('#prog .seg');
    var nextBtn=document.getElementById('nextBtn'), backBtn=document.getElementById('backBtn'), confirm=document.getElementById('confirm');
    var cur=0, total=steps.length;
    function paint(){
      steps.forEach(function(s,i){ s.classList.toggle('active',i===cur); });
      segs.forEach(function(s,i){ s.classList.toggle('done',i<=cur); });
      backBtn.hidden = cur===0;
      nextBtn.innerHTML = (cur===total-1) ? 'Submit application <span class="arw">&rarr;</span>' : 'Continue <span class="arw">&rarr;</span>';
    }
    function validate(){ var ok=true;
      steps[cur].querySelectorAll('[required]').forEach(function(f){
        var f2=f.closest('.field'), v=(f.value||'').trim();
        var bad=!v||(f.type==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v));
        if(f2)f2.classList.toggle('invalid',bad); if(bad)ok=false;
      }); return ok; }
    function sendToSheet(){ if(!FORM_ENDPOINT)return;
      try{ var fd=new FormData(form), data={}; fd.forEach(function(v,k){ data[k]=v; });
        fetch(FORM_ENDPOINT,{method:"POST",body:JSON.stringify(data)}).catch(function(){}); }catch(e){} }
    form.addEventListener('input',function(e){ var f=e.target.closest('.field'); if(f)f.classList.remove('invalid'); });
    nextBtn.addEventListener('click',function(){
      if(!validate())return;
      if(cur<total-1){ cur++; paint(); form.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'}); }
      else{ sendToSheet(); form.style.display='none'; confirm.classList.add('show'); confirm.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'}); }
    });
    backBtn.addEventListener('click',function(){ if(cur>0){ cur--; paint(); } });
    paint();
  })();

  /* ---------- Mark testimonial video ---------- */
  (function(){
    var v=document.getElementById('ytShort'); if(!v)return;
    function idFrom(s){ if(!s)return ""; s=String(s).trim();
      var m=s.match(/(?:youtu\.be\/|shorts\/|embed\/|[?&]v=)([\w-]{11})/); if(m)return m[1];
      if(/^[\w-]{11}$/.test(s))return s; return ""; }
    var id=idFrom(MARK_VIDEO), note=document.getElementById('shortNote');
    if(!id){ if(note)note.textContent='Video coming soon'; v.style.cursor='default'; v.removeAttribute('role'); v.removeAttribute('tabindex'); return; }
    if(note)note.textContent='Tap to play';
    function play(){ v.innerHTML='<iframe src="https://www.youtube.com/embed/'+id+'?autoplay=1&rel=0&playsinline=1" title="Mark testimonial" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'; }
    v.addEventListener('click',play);
    v.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); play(); } });
  })();

  /* ---------- guide Stripe buy buttons ---------- */
  (function(){
    document.querySelectorAll('.guide-buy-btn').forEach(function(buy){
      if(STRIPE_LINK){ buy.setAttribute('href',STRIPE_LINK); buy.setAttribute('target','_blank'); buy.setAttribute('rel','noopener'); }
      else{ buy.setAttribute('href','#'); buy.setAttribute('aria-disabled','true'); buy.innerHTML='Coming soon'; }
    });
  })();

  /* ---------- free ebook: capture, sticky tab, popup ---------- */
  (function(){
    var LEAD_KEY='vincereLead';
    function isLead(){ try{return localStorage.getItem(LEAD_KEY)==='1';}catch(e){return false;} }
    function markLead(){ try{localStorage.setItem(LEAD_KEY,'1');}catch(e){} }
    function validEmail(v){ return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test((v||'').trim()); }
    function postLead(name,email){ if(!FORM_ENDPOINT)return;
      try{ fetch(FORM_ENDPOINT,{method:'POST',body:JSON.stringify({type:'lead',name:name,email:email})}).catch(function(){}); }catch(e){} }
    function hideFab(){ fab.classList.remove('show'); }
    function showFab(){ if(!isLead())fab.classList.add('show'); }
    function closeModal(){ modal.classList.remove('show'); }

    function wire(f, onDone){
      if(!f)return;
      f.addEventListener('submit',function(e){
        e.preventDefault();
        var nEl=f.querySelector('[name=name]'), eEl=f.querySelector('[name=email]');
        var name=(nEl&&nEl.value||'').trim(), email=(eEl&&eEl.value||'').trim();
        var err=f.querySelector('.ebook-err');
        if(!name){ if(err)err.textContent='Enter your first name.'; return; }
        if(!validEmail(email)){ if(err)err.textContent='Enter a valid email.'; return; }
        if(err)err.textContent=''; postLead(name,email); markLead(); hideFab(); onDone();
      });
    }
    wire(document.getElementById('ebookForm'), function(){
      var f=document.getElementById('ebookForm'), d=document.getElementById('ebookDone');
      if(f)f.style.display='none'; if(d)d.classList.add('show');
    });
    wire(document.getElementById('ebookModalForm'), function(){
      var f=document.getElementById('ebookModalForm'), d=document.getElementById('ebookModalDone');
      if(f)f.style.display='none'; if(d)d.classList.add('show');
    });

    var isEbookPage = (page==='ebook');
    var hasInlineForm = !!document.getElementById('ebookForm');
    /* pages where the free-guide funnel is inappropriate (already converting / just paid) */
    var funnelOff = (page==='welcome' || page==='apply');

    /* sticky tab: scroll to the on-page form if there is one, else open the popup */
    fab.addEventListener('click',function(){
      var inlineForm=document.getElementById('ebookForm');
      if(inlineForm){ inlineForm.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});
        setTimeout(function(){ var em=inlineForm.querySelector('[name=email]'); if(em)em.focus(); }, reduce?0:600); }
      else{ modal.classList.add('show'); }
    });

    /* sticky bar. mobile: always visible from load. desktop: slides in on scroll. skipped on the ebook/checkout pages. */
    if(!isEbookPage && !funnelOff){
      var mqMobile=window.matchMedia('(max-width:600px)');
      function syncFab(){ if(isLead()){ hideFab(); return; } if(mqMobile.matches || window.scrollY>window.innerHeight*0.6) showFab(); else hideFab(); }
      syncFab();
      window.addEventListener('scroll',syncFab,{passive:true});
      if(mqMobile.addEventListener) mqMobile.addEventListener('change',syncFab);
    }

    /* timed popup, once per session, not if already a lead, only on pages without an inline form */
    if(!isLead() && !hasInlineForm && !funnelOff){
      var shown=false; try{ if(sessionStorage.getItem('vincerePopup')==='1') shown=true; }catch(e){}
      function openModal(){ if(shown||isLead())return; shown=true; try{sessionStorage.setItem('vincerePopup','1');}catch(e){} modal.classList.add('show'); }
      setTimeout(openModal, 24000);
      window.addEventListener('scroll',function(){ var d=(document.body.scrollHeight-window.innerHeight)||1; if(window.scrollY/d>0.5) openModal(); },{passive:true});
    }
    document.getElementById('ebookModalClose').addEventListener('click',closeModal);
    modal.addEventListener('click',function(e){ if(e.target===modal)closeModal(); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape')closeModal(); });
  })();
})();
