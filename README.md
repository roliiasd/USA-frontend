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

### Index.html, Register.html, Login.html

- Ahhoz, hogy a vásárló tudjon vásárolni és megtekinthesse a termékeket. Regisztrálnia kell egy fiókkal és be kell jelentkeznie.

- Itt lehet regisztrálni felhasználót.

- Itt lehet bejelentkezni, már létező felhasználói fiókkal.
- Bejelentkezéskor történik egy ellenőrzés, hogy a bejelentkező fiók admin-e vagy nem.
  Ha az az állítás igaz akkor az admin felületre dob az oldal, viszont ha nem akkor a felhasználói felületre.

![image](https://github.com/user-attachments/assets/3b66ebdd-2d26-43c6-9a20-155a28516900)![image](https://github.com/user-attachments/assets/efc97b96-cef4-4d06-8b08-a5288d8bd7b6)![image](https://github.com/user-attachments/assets/6dabb9d9-43be-4f8a-8e4f-eb5ddcc3b2b3)

### Home.html

- Itt láthatóak a termékek és elérhetőek a menüpontok a kosárhoz és fiókhoz.
- A termékek kattinthatók, hogy több információ jelenjen meg az adott termékhez.

![image](https://github.com/user-attachments/assets/bc7fe731-d09c-4ab9-a8ee-2d0c1478b0d5)![image](https://github.com/user-attachments/assets/4cd60a8c-0f61-4637-861c-76c98e654328)![image](https://github.com/user-attachments/assets/374b07c5-fa16-4822-8989-a5eaa01a2a19)

### Profile.html

- Itt lehet módosítani a felhasználó alapból szállítási adatait, melyet egyből betölt az oldal, ha új rendelést add le (lehet módosítani a rendelés lapon is).
- Változtatható a felhasználó jelszava (tudnia kell a jelenlegit).
- Megtekinthetőek a leadott rendelései és visszavonhatóak.

![image](https://github.com/user-attachments/assets/03a28d16-d43a-426a-99ae-165fde2cd75a)![image](https://github.com/user-attachments/assets/0aae5db8-414e-4d6b-a85f-409ac716f685)![image](https://github.com/user-attachments/assets/380a05ec-5b42-48fc-9622-4c4022e9cc0b)![image](https://github.com/user-attachments/assets/8df15fd5-f472-47f1-8cbb-dd093ffdf86a)

### Cart.html, Order.html

- Itt láthatóak a kosárban lévő termékek, lehet többet hozzáadni, esetleg kivenni.

- Rendeléskor, a megadott adatokat előre kitölti, ha a felhasználó adott a profiljának szállítási adatokat.
  Minden más esetben a hiányzó adat üres és ki kell tölteni.

![image](https://github.com/user-attachments/assets/aa24a8be-f817-471e-8e63-5cf671ffe8b8)![image](https://github.com/user-attachments/assets/8bf259ce-7ea9-4c62-a90a-42a6592c43f5)![image](https://github.com/user-attachments/assets/6abc6826-0911-479e-9f61-d6625af4374c)

### Admin felület

- 4 részre osztva: rendelések, termékek, márka és kategória.
- A termékeket lehet törölni és módosítani. Ellentétben a többivel amiket még nem lehet módosítani, csak törölni és létrehozni.
- Érdemes lenne egy felhasználók kezelésére szolgáló oldalt készíteni.

![image](https://github.com/user-attachments/assets/f84140a6-b550-4647-8a6e-705ec6c7b82f)![image](https://github.com/user-attachments/assets/08c8bc91-8572-48a6-b270-15d215afbf17)![image](https://github.com/user-attachments/assets/b996e2a7-355c-44fa-9c7b-c364a0c51585)![image](https://github.com/user-attachments/assets/0f616d2a-66a5-4039-8831-cc3e4fd99f1b)![image](https://github.com/user-attachments/assets/6bc45607-26f8-4fe6-b0a3-80898c3114d5)![image](https://github.com/user-attachments/assets/143a110d-91e6-48a6-9afd-a914abde5067)

## 📇 Fejlesztési lehetőségek

```markdown
- Admin felületen kezelni a felhasználókat.
- Módosítható rendelések az admin felületen.
- Szebb design és jobb css használat.
- Hatékonyabb környezetre átírni (react / vue.js).
- Felhasználó barátabb felület.
```