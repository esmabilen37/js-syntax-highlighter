# 🚀 JavaScript Kod Editörü ve Sözdizimi Vurgulayıcı

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
## 🎨 Token Renkleri (Sözdizimi Vurgulama Teması)

Kod editöründe kullanılan sözdizimi vurgulama renkleri:
| Token Türü               | CSS Sınıfı           | Renk Açıklaması                     | Renk Kodu                        |
| ------------------------ | -------------------- | ----------------------------------- | -------------------------------- |
| **Anahtar Kelime**       | `.token-keyword`     | Parlak sarı                         | `#f6ff00`                        |
| **String (Metin)**       | `.token-string`      | Açık mor                            | `#e2abffd0`                      |
| **Sayı**                 | `.token-number`      | Parlak pembe                        | `#f950b8`                        |
| **Yorum Satırı**         | `.token-comment`     | Parlak camgöbeği, italik            | `#2efcff`                        |
| **Tanımlayıcı**          | `.token-identifier`  | Turuncu-sarı tonu                   | `#ffa01b`                        |
| **Operatörler**          | `.token-operator`    | Canlı yeşil                         | `#00ff04`                        |
| **Noktalama İşaretleri** | `.token-punctuation` | Mavi-mor tonu                       | `#7c8dff`                        |
| **Fonksiyon İsimleri**   | `.token-function`    | Soluk sarı                          | `#dcdcaa`                        |
| **Hatalı Alanlar**       | `.token-error`       | Kırmızı arka plan, beyaz yazı rengi | `#ff6666` (bg), `#ffffff` (text) |


## 🖼️ Proje Görselleri
### İlk Durum  
![İlk Durum](./img/plilkhal.png)  

### Örnek Hatalar  
![String Hatası](./img/plStringhatasi.png)  
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
## 🧠 Gramer Yapısı

Aşağıda sadeleştirilmiş JavaScript EBNF grameri:

```ebnf
program      = { statement } ;
statement    = varDecl | funcDecl | exprStmt ;
varDecl      = ("let" | "const" | "var") identifier "=" expression ";" ;
funcDecl     = "function" identifier "(" [ identifier { "," identifier } ] ")" block ;
exprStmt     = expression ";" ;
block        = "{" { statement } "}" ;
expression   = identifier | number | string | expression operator expression ;
identifier   = letter { letter | digit | "_" | "$" } ;
number       = digit { digit } ;
string       = '"' { any } '"' | "'" { any } "'" ;
operator     = "+" | "-" | "*" | "/" | "%" | "==" | "!=" | ... ;
---

## 🛠️ Teknik Detaylar

Bu uygulama, klasik bir **compiler front-end** mimarisinden esinlenilerek yapılandırılmıştır. Geliştirilen editör üç temel aşamada çalışır:

### 1️⃣ Lexical Analyzer (Sözcüksel Çözümleme)

- Kullanıcının yazdığı kaynak kod karakter karakter okunur.
- Kod, **token** adı verilen anlamlı parçalara ayrılır.
- Her token bir kategoriye atanır: `keyword`, `identifier`, `operator`, `number`, `string`, `punctuation`, `comment` vb.
- Geçersiz karakter dizileri için **token-error** sınıfı atanarak kullanıcıya bildirilir.

📂 İlgili dosya: `LexicalAnalyzer.js`

---

### 2️⃣ Syntax Analyzer (Parser / Sözdizimsel Çözümleme)

- Lexical analizden gelen token listesi alınır.
- Bu tokenlar, **EBNF** kurallarına göre kontrol edilir.
- Kurallara uymayan yapılar belirlenir ve açıklayıcı hata mesajları oluşturulur.
- Her ifadenin doğru yapıda olup olmadığı belirlenir.

📂 İlgili dosya: `SyntaxAnalyzer.js`

---

### 3️⃣ Token Sistemi ve Renklendirme

- Token'lar analizden sonra belirli sınıflarla işaretlenir:
  - `token-keyword`, `token-string`, `token-number`, `token-comment`, vb.
- Bu sınıflar CSS ile özelleştirilmiş renklerle vurgulanır.
- **Hatalı token'lar** özel bir arka plan rengiyle öne çıkarılır (`.token-error`).

📂 İlgili dosya: `SyntaxHighlighter.js`  
🎨 Renk tabloları için: [🎨 Token Renkleri](#-token-renkleri-sözdizimi-vurgulama-teması)

---

### 4️⃣ Parse Ağacı ve Token Listesi

- Kodun **parse (ayrıştırma) ağacı** oluşturulur ve kullanıcıya görsel olarak sunulur.
- Her bir token’ın türü, değeri ve satır bilgisi liste halinde gösterilir.
- Bu yapılar, hata tespiti ve öğrenme amacıyla şeffaf bir analiz sunar.

---


## 📝 Medium Makalesi

Uygulamanın geliştirilme süreci ve teknik detayları hakkında yazdığım Medium makalesine buradan ulaşabilirsiniz:  
👉 [Makale Linki](https://medium.com/@esmabilenn37/tarayıcıda-gerçek-zamanlı-sözdizimi-analizi-javascript-ile-geliştirilmiş-basic-kod-editörü-5cde67c96c97)

## 📽️ Tanıtım Videosu

Uygulamanın nasıl çalıştığını görmek istersen bu kısa videoya göz atabilirsin:  
👉 [YouTube – Tanıtım Videosu](https://www.youtube.com/watch?v=uIf9hvbB5gs)


