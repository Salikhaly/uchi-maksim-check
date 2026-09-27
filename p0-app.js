(function(){
  const D=window.OPONAY_P0_DATA||{};
  const root=document.getElementById('p0-app'); if(!root)return;
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const txt=s=>esc(s).replace(/\n/g,'<br>');
  const arr=k=>Array.isArray(D[k])?D[k]:[];
  const card=(title,fields,open=false)=>`<details class="p1-card" ${open?'open':''}><summary>${esc(title)}</summary><div class="p1-body">${fields.map(([l,v])=>v?`<div class="p1-field"><div class="p1-label">${esc(l)}</div><div class="p1-text">${txt(v)}</div></div>`:'').join('')}</div></details>`;
  const search=(placeholder='Поиск по материалам')=>`<input class="p1-search" placeholder="${esc(placeholder)}" aria-label="${esc(placeholder)}">`;
  const tabs=(items)=>`<div class="p1-tabs">${items.map((x,i)=>`<button class="p1-tab ${i?'':'active'}" data-p1-tab="${esc(x[0])}">${esc(x[1])}</button>`).join('')}</div>`;
  const shell=(title,desc,body)=>`<section class="p1-shell"><div class="p1-top"><a class="p1-back" href="index.html">← Академия</a><nav class="p1-steps">
  <a class="p1-step" href="call.html"><b>01</b> Звонок</a><a class="p1-step" href="spin.html"><b>02</b> СПИН</a><a class="p1-step" href="spv.html"><b>03</b> СПВ</a><a class="p1-step" href="meeting.html"><b>04</b> Встреча</a><a class="p1-step" href="objections.html"><b>05</b> Возражения</a><a class="p1-step" href="meeting.html#sale"><b>06</b> Продажа</a>
  </nav></div><div class="p1-hero"><div class="p1-kicker">OPONAY · маршрут менеджера</div><h1>${esc(title)}</h1><p>${esc(desc)}</p></div>${body}</section>`;
  function bindSearch(scope=document){
    scope.querySelectorAll('.p1-toolbar').forEach(t=>{
      const inp=t.querySelector('.p1-search'); if(!inp)return;
      const section=t.closest('.p1-section,.p1-shell,.p1-body')||scope;
      const cards=[...section.querySelectorAll('.p1-card')];
      inp.addEventListener('input',()=>{const q=inp.value.trim().toLowerCase();cards.forEach(c=>c.style.display=(!q||c.innerText.toLowerCase().includes(q))?'':'none')});
    });
  }
  function bindTabs(scope=document){
    scope.querySelectorAll('[data-p1-tab]').forEach(b=>b.addEventListener('click',()=>{
      const group=b.parentElement; group.querySelectorAll('.p1-tab').forEach(x=>x.classList.remove('active')); b.classList.add('active');
      const id=b.dataset.p1Tab; group.parentElement.querySelectorAll('[data-p1-panel]').forEach(p=>p.hidden=p.dataset.p1Panel!==id);
    }));
  }
  function spin(){
    const chains=arr('spin').map((x,i)=>card(`Цепочка ${i+1}: С → П → И → Н`,[['С — ситуация',x.s],['П — проблема',x.p],['И — извлечение',x.i],['Н — наведение',x.nq],['Зачем', 'Вытащить конкретную боль и последствия. Если боль подтверждена — зафиксировать её и перейти в СПВ.']]));
    const pains=arr('pains').map((x,i)=>card(`${i+1}. ${x.cat} · ${x.pain}`,[['Боль',x.pain],['Решение',x.solution],['Следующий шаг','Подобрать релевантный СПВ и сформулировать выгоду.']]));
    return shell('СПИН + боли','Менеджер идёт по цепочке вопросов, а не выбирает случайную реплику. После подтверждённой боли маршрут ведёт в СПВ.',`
      <div class="p1-route"><a href="#spin"><b>01</b>Ситуация</a><a href="#spin"><b>02</b>Проблема</a><a href="#spin"><b>03</b>Извлечение</a><a href="#spin"><b>04</b>Наведение</a><a href="#pains"><b>05</b>Зафиксировать боль</a><a href="spv.html"><b>06</b>СПВ</a></div>
      <div id="spin" class="p1-section"><h2>Цепочки вопросов</h2><p>Открой цепочку и веди разговор по порядку.</p><div class="p1-toolbar">${search('Найти вопрос или тему')}</div><div class="p1-grid">${chains.join('')}</div></div>
      <div id="pains" class="p1-section"><h2>Боли и переход в СПВ</h2><p>Не заканчивай на названии боли: зафиксируй последствия и переходи к релевантному решению.</p><div class="p1-toolbar">${search('Найти боль: сотрудники, финансы, клиенты, товары')}</div><div class="p1-grid">${pains.join('')}</div></div>`);
  }
  function spv(){
    const data=arr('spv');
    const cats=[...new Set(data.map(x=>x.category).filter(Boolean))];
    const cards=data.map((x,i)=>card(`${i+1}. ${x.category||'СПВ'} · ${x.property}`,[['Свойство',x.property],['Преимущество',x.benefit],['Выгода для клиента','Привяжи выгоду к подтверждённой боли клиента; не перечисляй функцию сама по себе.'],['Применить','Сначала назвать боль → показать свойство → объяснить преимущество → сформулировать выгоду → проверить реакцию.']]));
    return shell('СПВ: свойство → преимущество → выгода','Библиотека решений. Основной маршрут остаётся СПИН → боль → СПВ: здесь менеджер выбирает только релевантные связки.',`
      <div class="p1-callout"><b>Правило:</b> СПВ не заменяет выявление потребности. Сначала подтверждённая боль, затем решение.</div>
      ${tabs([['all','Все'],...cats.map(c=>[c,c])])}
      <div data-p1-panel="all" class="p1-grid">${cards.join('')}</div>
      ${cats.map(c=>`<div data-p1-panel="${esc(c)}" class="p1-grid" hidden>${data.filter(x=>x.category===c).map((x,i)=>card(`${i+1}. ${x.property}`,[['Свойство',x.property],['Преимущество',x.benefit],['Выгода','Связать с болью клиента.']])).join('')}</div>`).join('')}
      <div class="p1-toolbar">${search('Поиск свойства, преимущества или выгоды')}</div>`);
  }
  function meeting(){
    const prep=arr('prep'), checklist=arr('checklist'), greet=arr('greet'), pres=arr('presentation'), sale=arr('sale');
    const stages=[['prep','Подготовка'],['greet','Приветствие + ТМР'],['spin','СПИН + боль'],['pres','СПВ + презентация'],['sale','Цена + закрытие']];
    const mk=(data,label,klass='')=>data.map((x,i)=>card(`${i+1}. ${x.title||label}`,[['Что делать',x.text],['Цель','Понимать, зачем этот шаг нужен и что должно быть получено на выходе.']])).join('');
    const saleCards=sale.map((x,i)=>card(`${i+1}. ${x.title||'Закрытие'}`,[['Логика',x.text],['Когда применять','После презентации и обработки актуального возражения; ориентируйся на сигналы готовности клиента.']])).join('');
    const sandwich=`<div id="sandwich" class="p1-section"><h2>Сендвич цены</h2><p>Формируется из выбранного СПВ: ценность → цена → ценность → вопрос.</p><div class="p1-callout"><b>Шаблон:</b> «Вы получаете [выгода], потому что [СПВ]. Стоимость [комплект/условие]. Если это закрывает вашу задачу, можем перейти к оформлению?»</div><a class="p1-step" href="spv.html">← выбрать СПВ</a></div>`;
    return shell('Встреча: один маршрут','Подготовка → приветствие → СПИН → фиксация боли → релевантная презентация → цена → возражение → закрытие. Отдельной дублирующей «этапки ко встрече» нет.',`
      <div class="p1-route">${stages.map((s,i)=>`<a href="#${s[0]}"><b>${String(i+1).padStart(2,'0')}</b>${s[1]}</a>`).join('')}</div>
      <div class="p1-toolbar">${search('Поиск по встрече')}</div>
      <div id="prep" class="p1-section"><h2>01 · Подготовка</h2><p>Интерактивный чеклист перед встречей.</p><div class="p1-checklist">${prep.map((x,i)=>`<label class="p1-check"><input type="checkbox" data-meeting-check="${i}"><span><b>${i+1}. ${esc(x.title)}</b><small>${esc(x.text)}</small></span></label>`).join('')}</div></div>
      <div id="greet" class="p1-section"><h2>02 · Приветствие + ТМР</h2><p>Готовая формулировка + цель шага.</p><div class="p1-grid">${mk(greet,'Приветствие')}</div></div>
      <div id="spin" class="p1-section"><h2>03 · СПИН внутри встречи</h2><p>Здесь менеджер не уходит на отдельную страницу: использует цепочку вопросов, фиксирует боль и только потом презентует.</p><a class="p1-step" href="spin.html">Открыть полный СПИН ↗</a></div>
      <div id="pres" class="p1-section"><h2>04 · Презентация по боли</h2><p>Показываем только релевантные ценности из СПВ.</p><div class="p1-grid">${mk(pres,'Презентация')}</div></div>
      ${sandwich}
      <div id="sale" class="p1-section"><h2>05 · Продажа и закрытие</h2><p>Сигналы готовности → техника закрытия → предоплата.</p><div class="p1-grid">${saleCards}</div></div>`);
  }
  function objections(){
    const mk=(data,label)=>data.map((x,i)=>card(`${i+1}. ${x.title||label}`,[['Что сказать / уточнить',x.text],['Следующая ветка',x.alt],['Дополнение',x.extra]])).join('');
    return shell('Возражения: звонок и встреча отдельно','Одна логика отработки: услышал → уточнил → ответил → проверил → вернул к цели. Но база звонка и база встречи не смешиваются.',`
      ${tabs([['call','Звонок'],['meet','Встреча']])}
      <div class="p1-toolbar">${search('Найти возражение')}</div>
      <div data-p1-panel="call" class="p1-grid">${mk(arr('objCall'),'Возражение звонка')}</div>
      <div data-p1-panel="meet" class="p1-grid" hidden>${mk(arr('objMeet'),'Возражение встречи')}</div>`);
  }
  function call(){
    const s=arr('callScript'), o=arr('objCall');
    const col=(title,data)=>`<div class="p1-call-col"><h3>${esc(title)}</h3>${data.map((x,i)=>card(`${i+1}. ${x.title||title}`,[['Реплика',x.text],['Переход',i<data.length-1?'После ответа — к следующему шагу.':'Цель: назначить встречу.']])).join('')}</div>`;
    return shell('Холодный звонок','Полный сценарий оставлен как рабочая страницу, а не сжат в одну карточку. На ПК — 3 колонки; на телефоне — последовательные блоки.',`
      <div class="p1-call-grid">
        ${col('01 · Открытие',s.slice(0,3))}
        ${col('02 · Выявление',s.slice(3,Math.max(3,s.length-2)))}
        ${col('03 · Ценность → встреча',s.slice(Math.max(3,s.length-2)))}
      </div>
      <div class="p1-section"><h2>Возражения звонка</h2><p>Не уходят на отдельный экран: база доступна прямо после реплики клиента.</p><div class="p1-toolbar">${search('Найти возражение звонка')}</div><div class="p1-grid">${o.map((x,i)=>card(`${i+1}. ${x.title||'Возражение'}`,[['Отработка',x.text],['Ветка',x.alt]])).join('')}</div></div>`);
  }
  function home(){
    return shell('Академия OPONAY','Маршрут менеджера','Не листаем Excel. Работаем по процессу и открываем исходные формулировки только в нужный момент.',`
      <div class="p1-route"><a href="call.html"><b>01</b>Холодный звонок</a><a href="spin.html"><b>02</b>СПИН + боли</a><a href="spv.html"><b>03</b>СПВ</a><a href="meeting.html"><b>04</b>Встреча</a><a href="objections.html"><b>05</b>Возражения</a><a href="meeting.html#sale"><b>06</b>Продажа → закрытие</a></div>
      <div class="p1-section"><h2>Правило маршрута</h2><p>Звонок → потребность → боль → СПВ → презентация → цена → возражение → закрытие. Не перескакиваем к функции, пока не подтверждена проблема.</p></div>`);
  }
  const page=root.dataset.p0Page;
  root.outerHTML=page==='spin'?spin():page==='spv'?spv():page==='meeting'?meeting():page==='objections'?objections():page==='call'?call():home();
  bindSearch(); bindTabs();
  document.querySelectorAll('[data-meeting-check]').forEach(cb=>{
    const key='oponay_meeting_check_'+cb.dataset.meetingCheck;
    cb.checked=localStorage.getItem(key)==='1';
    cb.addEventListener('change',()=>localStorage.setItem(key,cb.checked?'1':'0'));
  });
})();