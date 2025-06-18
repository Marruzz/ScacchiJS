# ♔ Scacchi JS ♛

Un elegante gioco di scacchi sviluppato in JavaScript con un'interfaccia moderna utilizzando Tailwind CSS.

## 🎨 Nuove Funzionalità

### Design Migliorato
- **Interfaccia moderna** con gradients e effetti di glassmorphism
- **Design responsive** che si adatta a diversi dispositivi
- **Animazioni fluide** per tutte le interazioni
- **Tema scuro elegante** con colori chess-themed personalizzati

### Esperienza Utente Migliorata
- **Indicatore del turno** in tempo reale
- **Highlight delle mosse valide** quando si seleziona un pezzo
- **Notifiche di feedback** per ogni azione
- **Effetti hover e animazioni** sui pezzi e caselle
- **Controlli di gioco** con pulsanti per reset e undo

### Caratteristiche Tecniche
- **Tailwind CSS** integrato via CDN
- **CSS personalizzato** per effetti avanzati
- **Design responsive** con breakpoints mobile
- **Animazioni CSS** fluide e performanti

## 🚀 Come Utilizzare

1. Apri il file `scacchi.html` in un browser moderno
2. Il gioco si caricherà automaticamente con la posizione iniziale
3. Trascina i pezzi per muoverli (solo nel tuo turno)
4. Le caselle valide si illumineranno quando selezioni un pezzo
5. Usa i pulsanti "Nuova Partita" e "Annulla Mossa" per controllare il gioco

## 📱 Compatibilità

- ✅ Chrome/Edge (consigliato)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers
- ✅ Tablet friendly

## 🎯 Caratteristiche del Gioco

- Movimento completo dei pezzi secondo le regole degli scacchi
- Cattura dei pezzi avversari
- Alternanza automatica dei turni
- Interfaccia drag & drop intuitiva
- Feedback visivo per tutte le azioni

## 🔧 Struttura del Progetto

```
ScacchiJS/
├── scacchi.html      # File principale con layout Tailwind
├── scacchi.js        # Logica di gioco migliorata
├── scacchi.css       # Stili personalizzati e animazioni
├── pedine.js         # Definizione delle classi dei pezzi
└── img/              # Immagini dei pezzi degli scacchi
    ├── PedoneBianco.png
    ├── PedoneNero.png
    ├── TorreBianca.png
    ├── TorreNera.png
    └── ... (altri pezzi)
```

## 🎨 Personalizzazione

Il tema può essere facilmente personalizzato modificando i colori in `tailwind.config`:

```javascript
colors: {
    'chess-light': '#F0D9B5',
    'chess-dark': '#B58863',
    'chess-border': '#8B4513',
    'chess-bg': '#2D3748'
}
```

## 📈 Prossimi Miglioramenti

- [ ] Sistema di salvataggio/caricamento partite
- [ ] Cronometro per ogni giocatore
- [ ] Modalità AI contro computer
- [ ] Animazioni di movimento dei pezzi
- [ ] Sistema di notazione algebrica
- [ ] Controllo di scacco e scaccomatto

---

Realizzato con ❤️ usando JavaScript puro e Tailwind CSS
