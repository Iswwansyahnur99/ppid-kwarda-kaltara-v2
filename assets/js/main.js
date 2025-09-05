(function(){
  const navState = { open:false };
  const nav = document.getElementById('navmenu');
  const toggleBtn = document.querySelector('.nav-toggle');
  const header = document.querySelector('.site-header');

  window.__nav = {
    toggle(){
      navState.open = !navState.open;
      nav.classList.toggle('open', navState.open);
      toggleBtn.setAttribute('aria-expanded', String(navState.open));
    }
  };

  // Tutup menu saat klik di luar area menu (mobile)
  document.addEventListener('click', (e)=>{
    if(!navState.open) return;
    const withinMenu = nav.contains(e.target) || toggleBtn.contains(e.target);
    if(!withinMenu){
      navState.open = false;
      nav.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded','false');
    }
  });

  // Tutup menu saat tekan Escape
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && navState.open){
      navState.open = false;
      nav.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded','false');
      toggleBtn.focus();
    }
  });

  // Reset state saat berubah ke viewport desktop
  const mq = window.matchMedia('(min-width: 861px)');
  mq.addEventListener('change', (ev)=>{
    if(ev.matches){
      navState.open = false;
      nav.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded','false');
    }
  });

  // Accessible submenus (desktop hover, keyboard focus; mobile stacked)
  document.querySelectorAll('.has-sub').forEach((li)=>{
    const btn = li.querySelector('.sub-toggle');
    if(!btn) return;
    btn.addEventListener('click', ()=>{
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      li.setAttribute('aria-expanded', String(!expanded));
    });
    btn.addEventListener('keydown',(e)=>{
      if(e.key === 'Escape'){
        btn.setAttribute('aria-expanded','false');
        li.removeAttribute('aria-expanded');
        btn.blur();
      }
    });

    // Tutup submenu saat link di dalamnya diklik
    li.querySelectorAll('.subpanel a').forEach(a => {
      a.addEventListener('click', () => {
        btn.setAttribute('aria-expanded','false');
        li.removeAttribute('aria-expanded');
      });
    });
  });

  // Highlight active menu item
  const active = header.getAttribute('data-active');
  document.querySelectorAll('.navitem > a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href === active){ a.parentElement.classList.add('active'); }
  });

  // Smooth scroll for in-page anchors (respects reduced motion)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el){
        e.preventDefault();
        if(prefersReduced){ el.scrollIntoView(); }
        else{ el.scrollIntoView({behavior:'smooth', block:'start'}); }
        el.tabIndex = -1; el.focus({preventScroll:true});
      }
    });
  });
})();
