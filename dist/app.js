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
  function closeMenu() { menu.setAttribute('aria-expanded', 'false'); $('#nav-links').classList.remove('open'); }
  menu.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(expanded));
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
  let rescueState, opener, locationGeneration = 0;
  function setTitle(title) { $('#rescue-title').textContent = title; }
  function focusContent() { $('button, input', content)?.focus(); }
  function showChoose() {
    locationGeneration += 1;
    setTitle('Gaadi ruki? Hum help bhejte hain.');
    content.innerHTML = `<div class="contact-actions"><button class="button navy" id="call-rescue">Call now ↗</button><button class="button whatsapp" id="whatsapp-rescue">WhatsApp karo ↗</button></div><p class="service-intro">Ya yahin request taiyaar karo. Kya chahiye?</p><div class="service-options">${services.map((service, index) => `<button class="service-option" data-service="${service.id}"><span>0${index + 1}</span><span><strong>${service.title}</strong><small>${service.description}</small></span><span aria-hidden="true">→</span></button>`).join('')}</div>`;
    $('#call-rescue').addEventListener('click', () => {
      if (config.rescuePhone) location.href = `tel:${config.rescuePhone.replace(/[^+\d]/g, '')}`;
      else toast('Dummy helpline: +91 XXXXX XXXXX. Real number abhi add hona hai.');
    });
    $('#whatsapp-rescue').addEventListener('click', () => {
      if (config.whatsappNumber) window.open(`https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}`, '_blank', 'noopener,noreferrer');
      else toast('WhatsApp ka real number abhi add hona hai. Neeche request draft taiyaar kar sakte ho.');
    });
    $$('[data-service]', content).forEach(button => button.addEventListener('click', () => {
      rescueState.service = button.dataset.service; showDetails(); focusContent();
    }));
  }
  function showDetails() {
    setTitle('Thoda detail do');
    const chosen = services.find(service => service.id === rescueState.service);
    content.innerHTML = `<form class="rescue-form" id="rescue-form"><p class="service-pill">${chosen.title}</p><label>Mobile<input name="mobile" required type="tel" inputmode="tel" autocomplete="tel" pattern="(?:\\+91[\\s-]?)?[6-9][0-9]{9}" title="Enter a 10-digit Indian mobile number, optionally with +91" placeholder="98XXXXXXXX" value="${escape(rescueState.mobile)}"></label><label>Gaadi number<input name="vehicle" required autocomplete="off" maxlength="20" placeholder="HR 30 A 1234" value="${escape(rescueState.vehicle)}" style="text-transform:uppercase"></label><div><button class="button navy" type="button" id="share-location">Location share karo ↗</button><p class="location-status" id="location-status" role="status">${escape(rescueState.coordinates ? 'GPS location mil gayi.' : 'Abhi share nahi ki. Ya neeche landmark likh do.')}</p></div><label>Location / landmark<input name="landmark" id="landmark" maxlength="300" placeholder="Palwal toll ke 3 km aage" value="${escape(rescueState.landmark)}"></label><button class="button orange" type="submit">Aage badho →</button><button class="text-button" type="button" id="change-service">← Service badlo</button></form>`;
    $('#share-location').addEventListener('click', () => {
      if (!navigator.geolocation) { $('#location-status').textContent = 'GPS available nahi hai. Landmark neeche likh do.'; $('#landmark').focus(); return; }
      const generation = ++locationGeneration;
      const locationButton = $('#share-location');
      locationButton.disabled = true;
      $('#location-status').textContent = 'Location dhoondh rahe hain…';
      navigator.geolocation.getCurrentPosition(position => {
        if (generation !== locationGeneration || !dialog.open) return;
        rescueState.coordinates = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        locationButton.disabled = false;
        $('#location-status').textContent = `GPS location mil gayi: ${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`;
      }, () => {
        if (generation !== locationGeneration || !dialog.open) return;
        locationButton.disabled = false;
        $('#location-status').textContent = 'Location nahi mil paayi. Dhaba, toll ya km stone neeche likh do.'; $('#landmark').focus();
      }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
    });
    const collect = () => {
      Object.assign(rescueState, Object.fromEntries(new FormData($('#rescue-form'))));
      rescueState.vehicle = rescueState.vehicle.trim().toUpperCase();
    };
    $('#landmark').addEventListener('input', event => event.currentTarget.setCustomValidity(''));
    $('#change-service').addEventListener('click', () => { collect(); showChoose(); focusContent(); });
    $('#rescue-form').addEventListener('submit', event => {
      event.preventDefault(); collect();
      if (!rescueState.coordinates && !rescueState.landmark.trim()) {
        $('#landmark').setCustomValidity('GPS share karo ya landmark likh do.'); $('#landmark').reportValidity(); return;
      }
      locationGeneration += 1; showReview(); focusContent();
    });
  }
  function showReview() {
    setTitle('Ek baat pehle');
    const chosen = services.find(service => service.id === rescueState.service);
    const locationText = rescueState.landmark || `${rescueState.coordinates.latitude.toFixed(5)}, ${rescueState.coordinates.longitude.toFixed(5)}`;
    content.innerHTML = `<div class="quote-notice"><h3>Price pehle batayenge.</h3><p>Aapki haan ke baad hi team niklegi. Abhi yeh preview hai; koi live booking ya dispatch nahi hogi.</p></div><dl class="request-summary"><dt>Service</dt><dd>${chosen.title}</dd><dt>Mobile</dt><dd>${escape(rescueState.mobile)}</dd><dt>Gaadi</dt><dd>${escape(rescueState.vehicle)}</dd><dt>Location</dt><dd>${escape(locationText)}</dd></dl><div class="rescue-actions"><button class="button orange" id="prepare-rescue">Request draft taiyaar karo →</button><button class="text-button" id="edit-rescue">← Details badlo</button></div>`;
    $('#edit-rescue').addEventListener('click', () => { showDetails(); focusContent(); });
    $('#prepare-rescue').addEventListener('click', () => { showDone(); focusContent(); });
  }
  function showDone() {
    setTitle('Request ka draft ready hai');
    content.innerHTML = `<div class="rescue-done"><span class="result-mark" aria-hidden="true">✓</span><h3>Details ready. Agla step: company ko bhejna.</h3><p>Yeh request abhi submit nahi hui. Dummy contact ki wajah se call, mechanic assignment ya WhatsApp updates start nahi honge.</p><button class="button orange" id="download-rescue">Download request ↓</button><button class="text-button" id="finish-rescue">Theek hai, band karo</button></div>`;
    $('#download-rescue').addEventListener('click', () => download('tivrax-rescue-request.json', { type: 'rescue', ...rescueState }));
    $('#finish-rescue').addEventListener('click', () => dialog.close());
  }
  $$('[data-rescue]').forEach(button => button.addEventListener('click', () => {
    opener = button; closeMenu();
    rescueState = { service: 'mechanic', mobile: '', vehicle: '', landmark: '', coordinates: null };
    showChoose(); dialog.showModal();
  }));
  $('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { locationGeneration += 1; opener?.focus(); });
  $('#year').textContent = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date());
  if (config.rescuePhone) {
    $('#footer-phone').textContent = config.rescuePhone;
    $('.footer-contact small').textContent = config.previewMode ? 'Preview mode · dispatch not connected' : 'Rescue helpline';
  }
})();
