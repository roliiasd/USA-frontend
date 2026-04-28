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
├── public/
│   ├── kecske.mp3
│   ├── logo.png 
│   └── team_speak_3_message.mp3
├── src/
│   ├── assets/
│     │   ├── download.jpg
│     │   ├── logo.png
│     │   └── sddefault.jpg  <!--Ez mi a gecim -->
│
│   ├── componets/
│     │   ├── Btn.jsx
│     │   ├── ConfirmModal.jsx
│     │   ├── CreatePost.jsx
│     │   ├── EditPost.jsx
│     │   ├── Filter.jsx
│     │   ├── Navbar.jsx
│     │   └── UserPost.jsx
│     
│    ├── context/
│     │   └── AuthContext.jsx
│     
│    ├── pages/
│     │   ├── AboutUs.jsx
│     │   ├── Admin.jsx
│     │   ├── ChatPages.jsx
│     │   ├── FAQ.jsx
│     │   ├── Home.jsx
│     │   ├── Login.jsx
│     │   ├── Profile.jsx
│     │   └── Registration.jsx
│
│    ├── styles/
│     │   ├── Admin.min.css
│     │   ├── Chat.css
│     │   ├── CreatPosts.css
│     │   ├── EditPost.css
│     │   ├── Filter.css
│     │   ├── Home.css
│     │   ├── Login.css
│     │   ├── Navbar.css
│     │   ├── NoXdAboutUs_FAQ.css
│     │   ├── Profile.css
│     │   ├── Registration.css
│     │   └── XdAboutUs_FAQ.css
│      
│    ├── utils/
│     │   ├── animals.js
│     │   ├── chat.js
│     │   ├── getCC.js
│     │   ├── socket.js
│     │   └── users.js
│  
│    ├── main.jsx
│   
├── .gitignore
│  
├── eslint.config.js
│  
├── netlify.toml
│  
├── package-lock.json
│  
├── package.json
│  
├── READNE.md
│  
└── vite.config.js

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

| Admin teszt | Admin: 1 | Jelszó: valami |

| Felhasználó teszt | Felhasználó : a | Jelszó: valami |

## Dokumentáció
| 🎞️ Figma | Dizájnt készítő alkalmazás |[Megtekintés](https://www.figma.com/design/XbAhVv2L55v6RXQuZJMhkB/Usedanimals?node-id=0-1&p=f) |

 ### Home.jsx

- Főoldal, itt bejelentkezés nélkül is lehet nézzelődni és át menni akár más oldalakra is 

- Bejelentkezés / Regisztráció jobb felül található

![Kezdooldal](https://snipboard.io/wZlqvG.jpg)



### Login.jsx ; Registration.jsx

- Itt lehet be jelenetkezni vagy ha nincsen még fiók akkor lértehozni egyett 
- Netán ha el lenne felejtve a jelszó a kicserélésre is van egy gomb 
![Login](https://snipboard.io/yDFTQ8.jpg)
![Register](https://snipboard.io/RbC6N8.jpg)


### Hirdetés létrehozása

- Ezt a rész a jobb felső sarokban lehet el érni ha be van jelentkezve a felhasználó
- Több képet lehet feltölteni az adott állatrol 
- Kötelező megadni Nevet,megyét,várost és irányítószámot de az utóbbiakat autómatikusan filterezükk
![Hirdetes](https://snipboard.io/2sKtED.jpg)


### Profil beállítások

- Ezen a felületen lehet megváltozztatni a profilal kapcsolatos dolgokat 

![Profil](https://snipboard.io/juQ04b.jpg)
![KepEdit](https://snipboard.io/vFfD2I.jpg)


### GYIK

- Gyakran ismételt kérdések
![GYIK](https://snipboard.io/o95y0b.jpg)

### Rolunk

- Pár szó erröl az oldalról
![US](https://snipboard.io/K6lbYq.jpg)
![US](https://snipboard.io/1FekBM.jpg)

## 📇 Fejlesztési lehetőségek

```markdown
- írásbeli híbák javítása
- Szebb design és jobb css használat.
- Felhasználó barátabb felület.
```