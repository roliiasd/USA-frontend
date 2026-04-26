# 📒 Usedanimals Front doku
<!-- asd -->
## 🗒️ Tartalomjegyzék

- [Bevezetés](#bevezetés)
- [Szerkezet](#projekt-szerkezet)
- [Telepítés](#telepítés)
- [Használat](#használat)
- [Dokumentáció](#dokumentáció)
- [Fejlesztési lehetőségek](#fejlesztési-lehetőségek)

## 🏪 Bevezetés
- Egy olyan weboldal létrehozása volt a célunk Egy olyan weboldal létrehozása volt a célunk ahol szerethető otthont addhatunk olyan állatoknak akiknek már sajnos nem volt elég szabad hely más otthonokban.

## 📁 Projekt szerkezet

```markdown
├── admin/
│   ├── admin.html
│   ├── adminBrand.html
│   ├── adminCategory.html
│   └── adminProduct.html
├── cart/
│   ├── cart.html
│   └── order.html
├── css/
│   ├── admin/
│       └── admin.css
│   ├── homepage/
│       ├── cart.css
│       ├── home.css
│       └── order.css
│   ├── profile/
│       ├── orders.css
│       ├── profile.css
│       └── profileData.css
│   └── relog/
│       ├── index.css
│       ├── login.css
│       └── register.css
├── homepage/
│   └── home.html
├── icons/
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   └── favicon.ico
├── js/
│   ├── adminBrands.js
│   ├── adminCategory.js
│   ├── adminOrders.js
│   ├── adminProducts.js
│   ├── cart.js
│   ├── home.js
│   ├── index.js
│   ├── login.js
│   ├── myorder.js
│   ├── order.js
│   ├── profile.js
│   ├── profileInfo.js
│   ├── profilePsw.js
│   └── register.js
├── profile/
│   ├── orders.html
│   ├── profile.html
│   ├── profileInfo.html
│   └── profilePsw.html
├── relog/
│   ├── login.html
│   └── register.html
└── index.html
```

## ⬇️ Telepítés
```markdown
git clone https://github.com/roliiasd/USA-frontend (GitHub-ról letöltés)
```

## 🛍️ Használat 
- Kezdésnek a fő oldalt láthatjuk a hirdetésekkel és szűrővel. Ahoz hogy mi is fel tudjuk rakni egy hírdetés előszőr be kell regisztrálni majd a jobb felső sarokban a plusz jelre kattintva hozzhazjuk létre a hírdetést

- Hírdetés érdeklődés üzenetek alapján működik minden hírdetés jobb alsó sarkában van egy üzenet ikon amire rá kattintva át dob a /messages részre ahol meg lehet beszélni az átadást és stb...

- Továbbá a profil oldalon van lehetőség szerkezteni a profilt és a saját hírdetéseket.
 
#### Jelenleg elérhető netlify-on
| 🚀 Netlify | Netlify Deployed Page | [Megtekintés](https://nodejs207.dszcbaross.edu.hu/) |

| Admin teszt | Admin: a | Jelszó: valami |

| Felhasználó teszt | Felhasználó : 1 | Jelszó: valami |

## Dokumentáció
| 🎞️ Figma | Dizájnt készítő alkalmazás |[Megtekintés](https://www.figma.com/design/XbAhVv2L55v6RXQuZJMhkB/Usedanimals?node-id=0-1&p=f) |

<!-- ### Index.html, Register.html, Login.html

- Ahhoz, hogy a vásárló tudjon vásárolni és megtekinthesse a termékeket. Regisztrálnia kell egy fiókkal és be kell jelentkeznie.

- Itt lehet regisztrálni felhasználót.

- Itt lehet bejelentkezni, már létező felhasználói fiókkal.
- Bejelentkezéskor történik egy ellenőrzés, hogy a bejelentkező fiók admin-e vagy nem.
  Ha az az állítás igaz akkor az admin felületre dob az oldal, viszont ha nem akkor a felhasználói felületre.



### Home.html

- Itt láthatóak a termékek és elérhetőek a menüpontok a kosárhoz és fiókhoz.
- A termékek kattinthatók, hogy több információ jelenjen meg az adott termékhez.



### Profile.html

- Itt lehet módosítani a felhasználó alapból szállítási adatait, melyet egyből betölt az oldal, ha új rendelést add le (lehet módosítani a rendelés lapon is).
- Változtatható a felhasználó jelszava (tudnia kell a jelenlegit).
- Megtekinthetőek a leadott rendelései és visszavonhatóak.



### Cart.html, Order.html

- Itt láthatóak a kosárban lévő termékek, lehet többet hozzáadni, esetleg kivenni.

- Rendeléskor, a megadott adatokat előre kitölti, ha a felhasználó adott a profiljának szállítási adatokat.
  Minden más esetben a hiányzó adat üres és ki kell tölteni.



### Admin felület

- 4 részre osztva: rendelések, termékek, márka és kategória.
- A termékeket lehet törölni és módosítani. Ellentétben a többivel amiket még nem lehet módosítani, csak törölni és létrehozni.
- Érdemes lenne egy felhasználók kezelésére szolgáló oldalt készíteni. -->



## 📇 Fejlesztési lehetőségek

```markdown
- Admin felületen kezelni a felhasználókat.
- Módosítható rendelések az admin felületen.
- Szebb design és jobb css használat.
- Hatékonyabb környezetre átírni (react / vue.js).
- Felhasználó barátabb felület.
```