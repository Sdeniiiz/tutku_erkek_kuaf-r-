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

  // 3. Gallery Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
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

  // 4. Lightbox Modal for Photos & Videos
  const lightbox = document.getElementById('lightboxModal');
  const lightboxContainer = document.getElementById('lightboxMediaContainer');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox && lightboxContainer && lightboxClose) {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const type = item.getAttribute('data-type');
        const src = item.getAttribute('data-src');

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
          img.alt = 'Tutku Erkek Kuaförü & Protez Saç Uygulaması';
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
      document.body.style.overflow = 'auto';
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

  // 5. Intelligent Appointment & WhatsApp Booking Form
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
      const whatsappUrl = `https://wa.me/905467696868?text=${encodedMsg}`;

      // Show user success confirmation
      const alertBox = document.getElementById('formSuccessMsg');
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.innerHTML = `Randevu talebiniz hazırlandı! WhatsApp üzerinden anında iletiliyor...`;
      }

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 700);
    });
  }
});
