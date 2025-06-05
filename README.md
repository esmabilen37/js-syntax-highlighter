# 🚀 Gelişmiş JavaScript Kod Editörü ve Sözdizimi Vurgulayıcı

Bu proje, **JavaScript, HTML5 ve CSS** kullanılarak geliştirilmiş bir web tabanlı kod editörüdür. Canlı sözdizimi vurgulama, hata yakalama ve gerçek zamanlı geri bildirim ile kodları çalıştırmaya yarayan bir uygulamadır.

---
## 🚀 Canlı Demo

Uygulamayı canlı olarak deneyimlemek için buraya tıklayın:  
👉 [Canlı Demo](https://esmabilen37.github.io/js-syntax-highlighter/)

---
## 🔧 Kullanılan Teknolojiler

- **JavaScript (ES6+)** — Kod analizi, sözdizimi denetimi ve etkileşimler  
- **HTML5** — Temel yapı ve kullanıcı arayüzü  
- **CSS3** — Modern, duyarlı ve estetik tasarım  

---

## ✨ Özellikler

- **Canlı sözdizimi vurgulama:** Kod yazarken anında renklendirme  
- **Lexical ve Syntax analiz:** Kod hatalarını detaylı ve açıklayıcı biçimde tespit eder  
- **Satır numaraları ve hata göstergeleri:** Kodunuzdaki sorunlu satırları kolayca bulun  
- **Hata listesi:** Hata detaylarını okunabilir biçimde sunar  
- **Parse ağacı ve token listesi:** Kodun yapısını görselleştirir, analiz sürecini şeffaflaştırır  
- **Kaydırma senkronizasyonu:** Kod ve vurgulama katmanları uyumlu hareket eder  
- **Kullanıcı dostu arayüz:** Minimalist ve modern tasarım, odaklanmanızı artırır  

---

## 🖼️ Proje Görselleri
### İlk Durum  
![İlk Durum](./img/plilkhal.png)  

### Örnek Hatalar  
![String Hatası](./img/plStringHatasi.png)  
![Semicolon Hatası](./img/semicolonHatasi.png)  
![Parantez Hatası](./img/parantezHatasi.png)  

### Tahmin Etme Mekanizması  
![Tahmin Etme](./img/tahminEtme.png)

---

## 💻 Proje Yapısı

- `index.html` — Ana HTML dosyası, editör arayüzü  
- `style.css` — Proje için stil tanımlamaları  
- `LexicalAnalyzer.js` — Tokenizasyon ve sözcüksel analiz  
- `SyntaxAnalyzer.js` — Sözdizimi analizi ve hata tespiti  
- `SyntaxHighlighter.js` — Vurgulama ve UI güncellemeleri  

---

## 🎯 Nasıl Çalışır?

1. Kullanıcı kod yazmaya başlar.  
2. `LexicalAnalyzer` kodu tokenlara ayırır ve sözcüksel hataları kontrol eder.  
3. `SyntaxAnalyzer` tokenları değerlendirir, sözdizimi hatalarını bulur.  
4. `SyntaxHighlighter` bu analiz sonuçlarına göre kodu renklendirir, hata mesajlarını gösterir ve parse ağacını günceller.  
5. Satır numaraları ve hata göstergeleri canlı güncellenir.  

---
## 📝 Medium Makalesi

Uygulamanın geliştirilme süreci ve teknik detayları hakkında yazdığım Medium makalesine buradan ulaşabilirsiniz:  
👉 [Makale Linki](https://medium.com/@esmabilenn37/tarayıcıda-gerçek-zamanlı-sözdizimi-analizi-javascript-ile-geliştirilmiş-basic-kod-editörü-5cde67c96c97)

## 📽️ Tanıtım Videosu

Uygulamanın nasıl çalıştığını görmek istersen bu kısa videoya göz atabilirsin:  
👉 [YouTube – Tanıtım Videosu](https://www.youtube.com/watch?v=uIf9hvbB5gs)


