# Tutku Erkek Kuaförü & Protez Saç Merkezi

Samsun Çarşamba'da profesyonel erkek kuaförlüğü ve %100 doğal medikal protez saç merkezi resmi web sitesi.

---

## 🚀 Render.com Üzerinde Canlıya Alma (Deploy) Rehberi

Bu proje Render üzerinde iki farklı yöntemle **tamamen ücretsiz** ve sorunsuz çalışacak şekilde yapılandırılmıştır:

---

### YÖNTEM 1: Render "Static Site" (En Çok Tavsiye Edilen & En Hızlı)

Statik site olarak deploy edildiğinde Render sitenizi küresel CDN üzerinde barındırır, anında açılır, otomatik SSL (HTTPS) sağlar ve sıfır bakım gerektirir.

1. **GitHub'a Yükleyin:**
   Eğer henüz GitHub'a göndermediyseniz terminalinizde şu komutları çalıştırın:
   ```bash
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADINIZ/REPO_ADINIZ.git
   git push -u origin main
   ```

2. **Render Dashboard'a Gidin:**
   * [https://dashboard.render.com](https://dashboard.render.com) adresine gidin.
   * Sağ üstteki **"New +"** butonuna tıklayın ve **"Static Site"** seçeneğini seçin.
   * GitHub reponuzu bağlayın (**Connect repository**).

3. **Yapılandırma Ayarları (Zaten Hazır):**
   * **Name:** `tutku-erkek-kuaforu` (veya dilediğiniz bir ad)
   * **Branch:** `main`
   * **Root Directory:** *(boş bırakın)*
   * **Build Command:** *(boş bırakın)*
   * **Publish Directory:** `.` *(nokta işareti girin)*

4. **"Create Static Site"** butonuna tıklayın. 
   * Yaklaşık 30 saniye içinde siteniz `https://tutku-erkek-kuaforu.onrender.com` gibi canlı bir bağlantı ile yayına girecektir!
   * Repoda bulunan `render.yaml` sayesinde özel başlıklar, video/resim önbelleklemesi ve yönlendirmeler otomatik uygulanır.

---

### YÖNTEM 2: Render "Web Service" (Node.js Sunucusu ile)

Eğer Render üzerinde **"Web Service"** seçeneğini seçtiyseniz:

1. Render projedeki `package.json` ve `server.js` dosyasını otomatik tanır.
2. **Build Command:** *(boş bırakabilir veya `npm install` yazabilirsiniz)*
3. **Start Command:** `npm start` (veya `node server.js`)
4. Sunucu `process.env.PORT` üzerinden ayağa kalkar, iOS ve tüm tarayıcılar için **HTTP 206 Video Streaming (Range)** desteğiyle videoları ve temiz URL'leri (`/galeri`, `/protez-sac`) kusursuzca sunar.

---

## 💻 Yerel Geliştirme (Local Development)

Projeyi bilgisayarınızda yerel olarak çalıştırmak için:

```bash
# Node.js ile çalıştırma (0 harici bağımlılık gerektirir)
npm start
# veya
node server.js
```

Tarayıcınızda açın:
```
http://localhost:3000
```

---

## 📁 Proje Dizin Yapısı

```
├── index.html           # Ana sayfa (Hero video, filigran, galeri, hizmetler, randevu)
├── protez-sac.html       # Protez saç uzmanlık & S.S.S. rehberi
├── fiyatlar.html        # Hizmet ve fiyat listesi
├── galeri.html          # Fotoğraf & Video galerisi (canlı filtreleme & lightbox)
├── hakkimizda.html      # Hikayemiz, hijyen & kalite standartlarımız
├── iletisim.html        # İletişim, konum & çalışma saatleri
├── kvkk.html            # KVKK ve gizlilik politikası
├── 404.html             # Özel tasarlanmış hata sayfası
├── render.yaml          # Render.com Blueprint yapılandırması
├── package.json         # Node.js başlatma scriptleri
├── server.js            # Video streaming & Range destekli HTTP sunucusu
├── .gitignore           # Git takip dışı dosyalar
├── robots.txt           # Arama motoru robot direktifleri
├── sitemap.xml          # Arama motoru site haritası
├── css/
│   └── style.css        # Bebas Neue + Manrope, Bakır (#cf814d) stil dosyası
├── js/
│   └── main.js          # Lightbox, filtre, mobil menü & WhatsApp entegrasyonu
└── images/              # Logo, ikonlar, fotoğraflar ve MP4 videolar
```

---

## 🌐 Özel Alan Adı (Custom Domain) Bağlama

Render üzerinde kendi alan adınızı (örn. `tutkuerkekkuaforturkiye.com`) bağlamak için:
1. Render Static Site panelinizde **"Settings" > "Custom Domains"** bölümüne gidin.
2. Alan adınızı ekleyin.
3. DNS sağlayıcınızda (GoDaddy, Natro, Cloudflare vb.) Render'ın size vereceği **CNAME** veya **A Record** değerlerini girin.
4. Render ücretsiz SSL sertifikasını (Let's Encrypt) otomatik olarak tanımlayacaktır.
