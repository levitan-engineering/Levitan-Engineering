/* Minimal progressive enhancement: the page remains fully usable without JS. */
(function(){
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var top=document.getElementById('top'), hero=document.querySelector('.hero'), floatButton=document.querySelector('.wa-float'), contact=document.getElementById('contact');
  function scrollState(){
    if(top) top.classList.toggle('scrolled',window.scrollY>24);
    if(floatButton){
      var contactRect=contact&&contact.getBoundingClientRect();
      var hidden=contactRect&&contactRect.top<innerHeight&&contactRect.bottom>0;
      floatButton.classList.toggle('show',window.scrollY>innerHeight*.6&&!hidden);
    }
  }
  addEventListener('scroll',scrollState,{passive:true});scrollState();

  var reveals=document.querySelectorAll('.reveal');
  if(!reduce&&'IntersectionObserver' in window){
    var revealObserver=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('in');revealObserver.unobserve(entry.target);}})},{threshold:.12});
    reveals.forEach(function(el){revealObserver.observe(el)});
  }else reveals.forEach(function(el){el.classList.add('in')});

  /* Draw the engineering horizon once, then stop. */
  var canvas=document.getElementById('heroCanvas');
  if(canvas){
    var ctx=canvas.getContext('2d'), start=performance.now();
    function draw(now){
      var box=canvas.getBoundingClientRect(), dpr=Math.min(devicePixelRatio||1,2), w=box.width, h=box.height;
      canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
      var progress=reduce?1:Math.min(1,(now-start)/1400), base=h-10, buildings=[.34,.72,.5,.9,.58,.4,.68,.46];
      ctx.lineWidth=1;ctx.strokeStyle='#0E0E0C';ctx.globalAlpha=.62;ctx.beginPath();ctx.moveTo(0,base);ctx.lineTo(w*progress,base);ctx.stroke();
      buildings.forEach(function(scale,i){var bw=Math.max(18,w/18),x=w*(i+1)/(buildings.length+1),bh=(h-20)*scale*progress;ctx.globalAlpha=i===2?.85:.46;ctx.strokeStyle=i===2?'#1E3A5F':'#0E0E0C';ctx.strokeRect(x-bw/2,base-bh,bw,bh);});ctx.globalAlpha=1;
      if(progress<1&&!reduce) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  document.querySelectorAll('.faq-q').forEach(function(button){button.addEventListener('click',function(){
    var item=button.closest('.faq-item'), answer=item&&item.querySelector('.faq-a'), open=button.getAttribute('aria-expanded')==='true';
    document.querySelectorAll('.faq-q[aria-expanded="true"]').forEach(function(other){if(other!==button){other.setAttribute('aria-expanded','false');var otherAnswer=other.closest('.faq-item').querySelector('.faq-a');if(otherAnswer)otherAnswer.style.display='none';}});
    button.setAttribute('aria-expanded',String(!open));if(answer)answer.style.display=open?'none':'block';
  });});

  var form=document.getElementById('leadform');
  if(form){
    form.addEventListener('submit',function(event){
      event.preventDefault();var name=form.elements.name,phone=form.elements.phone;
      if(!name.value.trim()||!phone.value.trim()){[name,phone].forEach(function(field){if(!field.value.trim())field.focus();});return;}
      fetch(form.action,{method:'POST',headers:{Accept:'application/json'},body:new FormData(form)}).catch(function(){});
      var message='היי ידידיה, אשמח לתאם בדיקה.\nשם: '+name.value.trim()+'\nטלפון: '+phone.value.trim()+'\nסוג בדיקה: '+(form.elements.type?form.elements.type.value:'');
      if(form.elements.msg&&form.elements.msg.value.trim())message+='\nפרטים: '+form.elements.msg.value.trim();
      open('https://wa.me/972556625745?text='+encodeURIComponent(message),'_blank','noopener');form.hidden=true;var success=document.getElementById('formok');if(success)success.classList.add('show');
    });
  }
})();
