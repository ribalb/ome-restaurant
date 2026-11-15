(function () {
  var root = document.documentElement;
  var nodes = document.querySelectorAll('[data-en]');
  var menuLinks = document.querySelectorAll('[data-menu-link]');
  var langBtn = document.getElementById('langBtn');
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');

  // Arabic is the markup default; keep it so we can switch back.
  nodes.forEach(function (el) { el.dataset.ar = el.textContent; });

  function setLang(lang) {
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    nodes.forEach(function (el) { el.textContent = el.dataset[lang]; });
    menuLinks.forEach(function (a) { a.href = a.href.replace(/lang=\w+/, 'lang=' + lang); });
    langBtn.textContent = lang === 'ar' ? 'EN' : 'ع';
    document.title = lang === 'ar'
      ? 'مطعم اومي O.ME Restaurant — الرياض'
      : 'مطعم اومي O.ME Restaurant — Riyadh';
    try { localStorage.setItem('ome-lang', lang); } catch (e) {}
  }

  var saved = null;
  try { saved = localStorage.getItem('ome-lang'); } catch (e) {}
  var initial = saved || ((navigator.language || 'ar').toLowerCase().indexOf('ar') === 0 ? 'ar' : 'en');
  if (initial !== 'ar') setLang(initial);

  langBtn.addEventListener('click', function () {
    setLang(root.lang === 'ar' ? 'en' : 'ar');
  });

  // Nav
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.querySelectorAll('#navLinks a').forEach(function (a) { a.addEventListener('click', closeMenu); });

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // WhatsApp booking — change the number here if bookings go to a different line
  var WHATSAPP = '966555225397';
  var form = document.getElementById('bookingForm');
  var formError = document.getElementById('formError');
  var d = new Date();
  form.date.min = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    if (!name || !form.date.value || !form.time.value) {
      formError.hidden = false;
      return;
    }
    formError.hidden = true;
    var ar = root.lang === 'ar';
    var notes = form.notes.value.trim();
    var lines = ar
      ? ['مرحباً، أرغب بحجز طاولة في مطعم اومي O.ME Restaurant',
         'الاسم: ' + name,
         'التاريخ: ' + form.date.value,
         'الوقت: ' + form.time.value,
         'عدد الأشخاص: ' + form.guests.value]
      : ['Hello, I would like to book a table at مطعم اومي O.ME Restaurant',
         'Name: ' + name,
         'Date: ' + form.date.value,
         'Time: ' + form.time.value,
         'Guests: ' + form.guests.value];
    if (notes) lines.push((ar ? 'ملاحظات: ' : 'Notes: ') + notes);
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
