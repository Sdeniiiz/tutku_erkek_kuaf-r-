/**
 * TUTKU ERKEK KUAFÖRÜ & PROTEZ SAÇ MERKEZİ
 * Interactive JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0a. Scroll reveal (wow.js benzeri)
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // 0b. Back to top
  const toTop = document.querySelector('.back-to-top');
  if (toTop) {
    window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 600));
    toTop.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  // 1. Header Scroll Effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle & Dynamic Backdrop
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      document.body.appendChild(backdrop);
    }

    const openMenu = () => {
      navMenu.classList.add('open');
      backdrop.classList.add('show');
      document.body.classList.add('nav-open');
      const icon = mobileToggle.querySelector('i');
      if (icon) { icon.classList.remove('fa-bars'); icon.classList.add('fa-times'); }
    };

    const closeMenu = () => {
      navMenu.classList.remove('open');
      backdrop.classList.remove('show');
      document.body.style.overflow = '';
      document.body.classList.remove('nav-open');
      const icon = mobileToggle.querySelector('i');
      if (icon) { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
    };

    mobileToggle.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    backdrop.addEventListener('click', closeMenu);

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // 3. Smart Video Preview: Play on Hover (Desktop) & Play on Scroll Into View (Mobile/Touch)
  const isTouchOrMobile = () =>
    window.matchMedia('(hover: none), (pointer: coarse)').matches || window.innerWidth <= 992;

  const videoGalleryItems = document.querySelectorAll('.gallery-item[data-type="video"]');
  const managedVideoContainers = [];

  videoGalleryItems.forEach(item => {
    const src = item.getAttribute('data-src');
    if (!src) return;

    let video = item.querySelector('video');
    const existingImg = item.querySelector('img');

    if (!video) {
      video = document.createElement('video');
      video.src = src;
      if (existingImg) {
        const poster = existingImg.getAttribute('src');
        if (poster) video.poster = poster;
        existingImg.replaceWith(video);
      } else {
        item.prepend(video);
      }
    } else {
      video.removeAttribute('autoplay');
      if (!video.getAttribute('src')) {
        const sourceEl = video.querySelector('source');
        if (sourceEl && sourceEl.getAttribute('src')) {
          video.src = sourceEl.getAttribute('src');
        } else {
          video.src = src;
        }
      }
    }

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.preload = 'metadata';
    video.pause();

    const startPreview = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => item.classList.add('is-playing'))
          .catch(() => {});
      } else {
        item.classList.add('is-playing');
      }
    };

    const stopPreview = () => {
      video.pause();
      item.classList.remove('is-playing');
    };

    // Desktop: play when cursor enters, pause when cursor leaves
    item.addEventListener('mouseenter', () => {
      if (!isTouchOrMobile()) startPreview();
    });
    item.addEventListener('mouseleave', () => {
      if (!isTouchOrMobile()) stopPreview();
    });

    managedVideoContainers.push({ container: item, video, startPreview, stopPreview });
  });

  // Also manage standalone inline videos (e.g. protez-sac.html guide video, excluding hero background)
  document.querySelectorAll('video:not(.hero-video-bg)').forEach(video => {
    if (video.closest('.gallery-item') || video.closest('#lightboxMediaContainer')) return;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    const startPreview = () => { video.play().catch(() => {}); };
    const stopPreview = () => { video.pause(); };

    video.addEventListener('mouseenter', () => {
      if (!isTouchOrMobile()) startPreview();
    });
    video.addEventListener('mouseleave', () => {
      if (!isTouchOrMobile()) stopPreview();
    });

    managedVideoContainers.push({ container: video, video, startPreview, stopPreview });
  });

  // Mobile / Touch: automatically play videos when scrolled into view, pause when out of view
  if ('IntersectionObserver' in window && managedVideoContainers.length > 0) {
    const videoScrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const match = managedVideoContainers.find(m => m.container === entry.target);
        if (!match) return;
        if (!isTouchOrMobile()) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          match.startPreview();
        } else {
          match.stopPreview();
        }
      });
    }, { threshold: [0, 0.35, 0.7] });

    managedVideoContainers.forEach(m => videoScrollObserver.observe(m.container));
  }

  // 4. Gallery Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const cats = (item.getAttribute('data-category') || '').split(/\s+/);
          if (filter === 'all' || cats.includes(filter)) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            const vid = item.querySelector('video');
            if (vid) vid.pause();
            item.classList.remove('is-playing');
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // 5. Lightbox Modal for Photos & Videos
  const lightbox = document.getElementById('lightboxModal');
  const lightboxContainer = document.getElementById('lightboxMediaContainer');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox && lightboxContainer && lightboxClose) {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const type = item.getAttribute('data-type');
        const src = item.getAttribute('data-src');

        // Pause inline preview video when opening lightbox
        const inlineVid = item.querySelector('video');
        if (inlineVid) inlineVid.pause();
        item.classList.remove('is-playing');

        lightboxContainer.innerHTML = '';

        if (type === 'video') {
          const video = document.createElement('video');
          video.src = src;
          video.controls = true;
          video.autoplay = true;
          video.className = 'lightbox-media';
          video.playsInline = true;
          lightboxContainer.appendChild(video);
        } else {
          const img = document.createElement('img');
          img.src = src;
          img.alt = 'Tutku Erkek Kuaförü & Protez Saç Merkezi';
          img.className = 'lightbox-media';
          lightboxContainer.appendChild(img);
        }

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightboxContainer.innerHTML = '';
      document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // 6. Intelligent Appointment & WhatsApp Booking Form
  const bookingForm = document.getElementById('appointmentForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName')?.value.trim();
      const phone = document.getElementById('clientPhone')?.value.trim();
      const service = document.getElementById('clientService')?.value;
      const date = document.getElementById('clientDate')?.value;
      const time = document.getElementById('clientTime')?.value;
      const note = document.getElementById('clientNote')?.value.trim();

      if (!name || !phone) {
        alert('Lütfen adınızı ve telefon numaranızı giriniz.');
        return;
      }

      const targetNumber = '905467696868';

      // Format WhatsApp Message
      let msg = `*TUTKU ERKEK KUAFÖRÜ & PROTEZ SAÇ MERKEZİ - RANDEVU TALEBİ*\n\n`;
      msg += `👤 *Müşteri:* ${name}\n`;
      msg += `📞 *Telefon:* ${phone}\n`;
      msg += `✂️ *İstenen Hizmet:* ${service || 'Protez Saç & Bakım'}\n`;
      if (date) msg += `📅 *Tercih Edilen Tarih:* ${date}\n`;
      if (time) msg += `⏰ *Tercih Edilen Saat:* ${time}\n`;
      if (note) msg += `📝 *Ekstra Not:* ${note}\n`;
      msg += `\nMerkezinizden randevu ve detaylı bilgi almak istiyorum.`;

      const encodedMsg = encodeURIComponent(msg);
      const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodedMsg}`;

      // Show user success confirmation
      const alertBox = document.getElementById('formSuccessMsg');
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.innerHTML = `Randevu talebiniz hazırlandı! WhatsApp hattımıza anında iletiliyor...`;
      }

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 700);
    });
  }

  // 7. Header Phone Dropdown Toggle
  const phoneDropWrap = document.querySelector('.phone-dropdown-wrap');
  const phoneDropToggle = document.getElementById('phoneDropdownToggle');
  if (phoneDropWrap && phoneDropToggle) {
    phoneDropToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = phoneDropWrap.classList.toggle('active');
      phoneDropToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
    document.addEventListener('click', (e) => {
      if (!phoneDropWrap.contains(e.target)) {
        phoneDropWrap.classList.remove('active');
        phoneDropToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 8. Floating WhatsApp Dual Selector Popup
  const waWrap = document.querySelector('.floating-whatsapp-wrap');
  const waBtn = document.getElementById('floatingWhatsappBtn');
  const waPopup = document.getElementById('whatsappPopup');
  if (waWrap && waBtn && waPopup) {
    waBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      waPopup.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!waWrap.contains(e.target)) {
        waPopup.classList.remove('active');
      }
    });
  }
});
