'use strict';
(() => {
  const config = window.TIVRAX_CONFIG;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  let toastTimer;
  function toast(message) {
    clearTimeout(toastTimer);
    $('#toast').textContent = message;
    $('#toast').hidden = false;
    toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 5000);
  }
  function download(filename, data) {
    const blob = new Blob([JSON.stringify({ ...data, status: 'draft-not-submitted', createdAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename;
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const menu = $('.menu-button');
  function closeMenu() {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    $('#nav-links').classList.remove('open');
  }
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav')) closeMenu();
  });
  matchMedia('(max-width: 900px)').addEventListener('change', closeMenu);
  // Keep the fixed rescue bar clear of the on-screen keyboard.
  function updateKeyboardLayout() {
    const editing = document.activeElement?.matches('input, select, textarea');
    const keyboardVisible = window.visualViewport && innerHeight - window.visualViewport.height > 120;
    document.body.classList.toggle('keyboard-open', Boolean(editing && keyboardVisible));
  }
  window.visualViewport?.addEventListener('resize', updateKeyboardLayout);
  document.addEventListener('focusin', updateKeyboardLayout);
  document.addEventListener('focusout', () => requestAnimationFrame(updateKeyboardLayout));
  menu.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(expanded));
    menu.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
    $('#nav-links').classList.toggle('open', expanded);
  });
  $$('#nav-links a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  const tripStates = [
    ['Loaded', '#e6eaf2', '#0f2044'], ['In transit', '#0f2044', '#f0ede6'],
    ['Breakdown near Palwal', '#ff6b1a', '#0f2044'], ['Mechanic assigned', '#ffe1cc', '#8a2e00'],
    ['Back on road', '#ddf0e3', '#1f7a3f']
  ];
  let tripIndex = 0, tripTimer;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function renderTrip() {
    const [label, background, color] = tripStates[tripIndex];
    $('#trip-status strong').textContent = label;
    Object.assign($('#trip-status').style, { background, color });
    $$('#trip-timeline li').forEach((li, index) => {
      li.classList.toggle('done', index <= tripIndex); li.classList.toggle('current', index === tripIndex);
      if (index === tripIndex) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
  }
  function startTrip() {
    clearInterval(tripTimer); tripIndex = reduceMotion.matches ? 4 : 0; renderTrip();
    if (!reduceMotion.matches) tripTimer = setInterval(() => {
      if (document.hidden) return;
      tripIndex += 1; renderTrip();
      if (tripIndex === 4) clearInterval(tripTimer);
    }, 2500);
  }
  $('#replay-trip').addEventListener('click', startTrip);
  reduceMotion.addEventListener('change', startTrip);
  startTrip();

  const comparisons = [
    ['Visibility: your own trucks', 'Trip status pickup to POD, via your GPS or the driver’s phone', 'Strong: live location, reports, alerts', 'Phone calls: “Kahan pahunche?”'],
    ['Documents and expiries', 'Vault plus alerts before RC, permit, fitness, insurance lapse', 'Often included', 'Register and memory'],
    ['Market fleets (AMS)', 'Vendor register, multi-vendor dispatch and billing', 'Usually not covered', 'Strong network, all in chats and calls'],
    ['Rates and margin', 'Rate-control scope to be confirmed in your demo', 'Not covered', 'In the broker’s head'],
    ['Raste ki problem: breakdown', 'Mechanic sent to the truck', 'Alert that the truck stopped', 'Depends on who picks up'],
    ['Raste ki problem: driver walks off', 'Relief driver sent', 'Not covered', 'Ask around'],
    ['Raste ki problem: challan / impound', 'Legal expert on call', 'Not covered', 'Someone “knows someone”'],
    ['Return loads', 'Corporate loads, payment secured before loading; subject to availability', 'Not typical', 'Yes, at commission; payment risk on you'],
    ['Where they’re stronger', 'Initial focus: NH-44 and NCR; coverage to be confirmed', 'Deeper telematics and analytics', 'Relationships built over years']
  ];
  $('#comparison-body').innerHTML = comparisons.map(row => `<tr><th scope="row">${escape(row[0])}</th>${row.slice(1).map(cell => `<td>${escape(cell)}</td>`).join('')}</tr>`).join('');
  function renderComparison(column) {
    $('#comparison-cards').innerHTML = comparisons.map(row => `<div><dt>${escape(row[0])}</dt><dd>${escape(row[column])}</dd></div>`).join('');
    $$('[data-compare]').forEach(button => {
      const on = Number(button.dataset.compare) === column;
      button.classList.toggle('selected', on); button.setAttribute('aria-pressed', String(on));
    });
  }
  $$('[data-compare]').forEach(button => button.addEventListener('click', () => renderComparison(Number(button.dataset.compare))));
  renderComparison(1);

  function renderWorkflow(mode) {
    const own = mode === 'own';
    const steps = [
      ['Order aaya', 'Booking created in AMS, or a return load picked from your portal.'],
      ['Gaadi lagi', own ? 'Free truck and driver assigned from FMS.' : 'Load sent to your vendors, options compared, best one assigned.'],
      ['Kaagaz ready', 'RC, permit, insurance and e-way bill already in the vault.'],
      ['Trip chal rahi hai', 'Pickup to POD milestones on one screen.'],
      ['Raste mein problem?', 'One tap: mechanic, relief driver or legal help, truck details pre-filled.'],
      ['Hisaab saaf', own ? 'POD uploaded, GST invoice raised.' : 'POD uploaded, GST invoice raised, vendor balance recorded.']
    ];
    $('#workflow-steps').innerHTML = steps.map(([title, body], index) => `<li${index === 4 ? ' class="rescue-step"' : ''}><p class="mono">${String(index + 1).padStart(2, '0')}</p><h3>${escape(title)}</h3><p lang="en">${escape(body)}</p></li>`).join('');
    $$('[data-mode]').forEach(button => {
      const on = button.dataset.mode === mode;
      button.classList.toggle('selected', on); button.setAttribute('aria-pressed', String(on));
    });
  }
  $$('[data-mode]').forEach(button => button.addEventListener('click', () => renderWorkflow(button.dataset.mode)));
  renderWorkflow('own');

  let demoDraft;
  $('#demo-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    demoDraft = { type: 'demo', ...Object.fromEntries(new FormData(event.currentTarget)) };
    $('#demo-form').hidden = true; $('#demo-result').hidden = false;
    $('#demo-result h3').setAttribute('tabindex', '-1'); $('#demo-result h3').focus();
  });
  $('#download-demo').addEventListener('click', () => download('tivrax-demo-request.json', demoDraft));
  $('#edit-demo').addEventListener('click', () => {
    $('#demo-result').hidden = true; $('#demo-form').hidden = false; $('#demo-form input').focus();
  });

  const dialog = $('#rescue-dialog'), content = $('#rescue-content');
  const services = [
    { id: 'mechanic', title: 'Mistri / breakdown', description: 'Engine, electrical, air-brake, tyre' },
    { id: 'driver', title: 'Relief driver', description: 'Verified DL, right vehicle class' },
    { id: 'legal', title: 'Legal / challan', description: 'Challan, gaadi zabt, RC seized' }
  ];
  let opener;
  function whatsappUrl(serviceId) {
    const number = (config.whatsappNumber || '').replace(/\D/g, '');
    const message = window.TIVRAX_I18N?.whatsappMessage(serviceId) || config.whatsappMessage || '';
    return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : '#';
  }
  function showChoose() {
    $('#rescue-title').textContent = 'Gaadi ruki? Hum help bhejte hain.';
    content.innerHTML = `<div class="contact-actions"><a class="button navy" id="call-rescue" href="tel:${escape(config.rescuePhone || '')}">Call now ↗</a><a class="button whatsapp" id="whatsapp-rescue" href="${escape(whatsappUrl())}" target="_blank" rel="noopener noreferrer">WhatsApp karo ↗</a></div><p class="service-intro">Kya chahiye? Service chunte hi WhatsApp chat khulegi.</p><div class="service-options">${services.map((service, index) => `<a class="service-option" data-service="${service.id}" href="${escape(whatsappUrl(service.id))}" target="_blank" rel="noopener noreferrer"><span>0${index + 1}</span><span><strong>${service.title}</strong><small>${service.description}</small></span><span aria-hidden="true">↗</span></a>`).join('')}</div>`;
  }
  document.addEventListener('tivrax:languagechange', () => { if (dialog.open) showChoose(); });
  $$('[data-rescue]').forEach(button => button.addEventListener('click', () => {
    opener = button; closeMenu();
    showChoose(); dialog.showModal();
  }));
  $('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { opener?.focus(); });
  $('#year').textContent = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date());
  if (config.rescuePhone) {
    $('#footer-phone').textContent = '+91 88878 15793';
    $('#footer-phone').href = `tel:${config.rescuePhone}`;
    $('.footer-contact small').textContent = 'Call or WhatsApp';
  }
})();
