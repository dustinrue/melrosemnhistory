// Mobile menu + list filter. Progressive enhancement: the site works without JavaScript.
(function(){
  var btn=document.querySelector('.menu-btn'), nav=document.getElementById('primary-nav');
  if(btn&&nav){
    btn.addEventListener('click',function(){
      var open=nav.classList.toggle('open'); btn.setAttribute('aria-expanded',open);
    });
    document.addEventListener('keydown',function(ev){ if(ev.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.focus();}});
  }
  var inp=document.querySelector('input[data-filter]');
  if(inp){
    var lists=[].slice.call(document.querySelectorAll(inp.dataset.filter)),
        items=[].concat.apply([],lists.map(function(l){return [].slice.call(l.children);})),
        count=document.querySelector(inp.dataset.count), empty=document.getElementById('empty'), total=items.length;
    inp.addEventListener('input',function(){
      var q=inp.value.trim().toLowerCase(), n=0;
      items.forEach(function(li){var m=!q||li.textContent.toLowerCase().indexOf(q)>-1; li.hidden=!m; if(m)n++;});
      lists.forEach(function(l){
        var sec=l.closest('.list-sec'); if(!sec) return;
        var vis=[].slice.call(l.children).filter(function(li){return !li.hidden;}).length;
        sec.hidden=vis===0;
        var c=sec.querySelector('.n'); if(c) c.textContent='('+(q?vis+' of '+c.dataset.total:c.dataset.total)+')';
      });
      count.textContent=q?(n+' of '+total+' entries'):(total+' entries');
      if(empty) empty.hidden=n>0;
    });
  }
})();
