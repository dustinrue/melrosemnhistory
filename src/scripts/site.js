// Mobile menu + print buttons. Progressive enhancement: the site works without JavaScript.
(function(){
  var btn=document.querySelector('.menu-btn'), nav=document.getElementById('primary-nav');
  if(btn&&nav){
    btn.addEventListener('click',function(){
      var open=nav.classList.toggle('open'); btn.setAttribute('aria-expanded',open);
    });
    document.addEventListener('keydown',function(ev){ if(ev.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.focus();}});
  }
  document.querySelectorAll('[data-print]').forEach(function(b){
    b.hidden=false; b.addEventListener('click',function(){window.print();});
  });
})();
