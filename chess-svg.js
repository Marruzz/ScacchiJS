// Elegant Royal Chess SVG Pieces - Premium Design

const ChessSVG = {
  // Helper function to create SVG element with namespace
  createSVGElement: function(tag, attrs = {}) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs).forEach(key => {
      element.setAttribute(key, attrs[key]);
    });
    return element;
  },
  // Create premium piece container with proper styling
  createDetailedPiece: function(type, color) {
    const container = document.createElement("div");
    container.style.cssText = `
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
      cursor: grab;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    `;
    
    let svg;
    
    switch(type.toLowerCase()) {
      case "re":
      case "king":
        svg = this.createRoyalKing(color);
        break;
      case "regina":
      case "queen":
        svg = this.createRoyalQueen(color);
        break;
      case "torre":
      case "rook":
        svg = this.createRoyalRook(color);
        break;
      case "alfiere":
      case "bishop":
        svg = this.createRoyalBishop(color);
        break;
      case "cavallo":
      case "knight":
        svg = this.createRoyalKnight(color);
        break;
      case "pedone":
      case "pawn":
        svg = this.createRoyalPawn(color);
        break;
      default:
        svg = this.createRoyalPawn(color);
    }
      container.appendChild(svg);
    
    // Make sure SVG doesn't interfere with drag events
    svg.style.pointerEvents = 'none';
    svg.style.userSelect = 'none';
    
    return container;
  },

  // Enhanced Royal King with crown, cross, and ornate details
  createRoyalKing: function(color) {
    const svg = this.createSVGElement("svg", {
      viewBox: "0 0 64 64",
      width: "100%",
      height: "100%"
    });

    const isWhite = color === "bianco";
    const baseColor = isWhite ? "#F8F8FF" : "#2F2F4F";
    const accentColor = isWhite ? "#FFD700" : "#C0C0C0";
    const shadowColor = isWhite ? "#D3D3D3" : "#1C1C1C";
    const strokeColor = isWhite ? "#4169E1" : "#000080";

    svg.innerHTML = `
      <defs>
        <linearGradient id="kingGradient${color}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${baseColor}"/>
          <stop offset="50%" style="stop-color:${accentColor}"/>
          <stop offset="100%" style="stop-color:${shadowColor}"/>
        </linearGradient>
        <radialGradient id="kingRadial${color}" cx="50%" cy="30%">
          <stop offset="0%" style="stop-color:${accentColor};stop-opacity:0.8"/>
          <stop offset="100%" style="stop-color:${baseColor};stop-opacity:0.3"/>
        </radialGradient>
        <filter id="glow${color}">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Base ornate -->
      <ellipse cx="32" cy="58" rx="24" ry="4" fill="${shadowColor}" opacity="0.6"/>
      <path d="M8 54 L56 54 L54 50 L10 50 Z" fill="url(#kingGradient${color})" stroke="${strokeColor}" stroke-width="1"/>
      
      <!-- Corps principal avec détails -->
      <path d="M14 50 L50 50 L46 28 L18 28 Z" fill="url(#kingGradient${color})" stroke="${strokeColor}" stroke-width="1.5"/>
      
      <!-- Décoration du corps -->
      <circle cx="24" cy="38" r="3" fill="${accentColor}" stroke="${strokeColor}"/>
      <circle cx="40" cy="38" r="3" fill="${accentColor}" stroke="${strokeColor}"/>
      <rect x="28" y="40" width="8" height="6" rx="2" fill="${accentColor}" stroke="${strokeColor}"/>
      
      <!-- Base de la couronne -->
      <path d="M12 28 L52 28 L50 20 L14 20 Z" fill="url(#kingGradient${color})" stroke="${strokeColor}" stroke-width="1.5"/>
      
      <!-- Couronne majestueuse -->
      <path d="M14 20 L18 8 L22 14 L28 6 L32 12 L36 6 L42 14 L46 8 L50 20" 
            fill="url(#kingGradient${color})" stroke="${strokeColor}" stroke-width="2"/>
      
      <!-- Pics de couronne ornés -->
      <circle cx="18" cy="8" r="2" fill="${accentColor}" stroke="${strokeColor}"/>
      <circle cx="28" cy="6" r="2.5" fill="${accentColor}" stroke="${strokeColor}"/>
      <circle cx="36" cy="6" r="2.5" fill="${accentColor}" stroke="${strokeColor}"/>
      <circle cx="46" cy="8" r="2" fill="${accentColor}" stroke="${strokeColor}"/>
      
      <!-- Croix royale -->
      <path d="M30 6 L34 6 M32 4 L32 8" stroke="${accentColor}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="32" cy="6" r="1" fill="${accentColor}"/>
      
      <!-- Bijoux et ornements -->
      <circle cx="20" cy="16" r="1.5" fill="${accentColor}"/>
      <circle cx="32" cy="14" r="2" fill="${accentColor}" stroke="${strokeColor}"/>
      <circle cx="44" cy="16" r="1.5" fill="${accentColor}"/>
      
      <!-- Effets de lumière -->
      <ellipse cx="32" cy="25" rx="15" ry="8" fill="url(#kingRadial${color})" opacity="0.4"/>
    `;

    return svg;
  },

  // Enhanced Royal Queen with elaborate crown
  createRoyalQueen: function(color) {
    const svg = this.createSVGElement("svg", {
      viewBox: "0 0 64 64",
      width: "100%",
      height: "100%"
    });

    const isWhite = color === "bianco";
    const baseColor = isWhite ? "#F8F8FF" : "#2F2F4F";
    const accentColor = isWhite ? "#FFD700" : "#C0C0C0";
    const shadowColor = isWhite ? "#D3D3D3" : "#1C1C1C";
    const strokeColor = isWhite ? "#9370DB" : "#4B0082";

    svg.innerHTML = `
      <defs>
        <linearGradient id="queenGradient${color}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${baseColor}"/>
          <stop offset="50%" style="stop-color:${accentColor}"/>
          <stop offset="100%" style="stop-color:${shadowColor}"/>
        </linearGradient>
        <radialGradient id="queenRadial${color}" cx="50%" cy="30%">
          <stop offset="0%" style="stop-color:${accentColor};stop-opacity:0.9"/>
          <stop offset="100%" style="stop-color:${baseColor};stop-opacity:0.2"/>
        </radialGradient>
      </defs>
      
      <!-- Base ornate -->
      <ellipse cx="32" cy="58" rx="24" ry="4" fill="${shadowColor}" opacity="0.6"/>
      <path d="M8 54 L56 54 L54 50 L10 50 Z" fill="url(#queenGradient${color})" stroke="${strokeColor}" stroke-width="1"/>
      
      <!-- Corps principal élégant -->
      <path d="M14 50 L50 50 L46 26 L18 26 Z" fill="url(#queenGradient${color})" stroke="${strokeColor}" stroke-width="1.5"/>
      
      <!-- Taille marquée -->
      <path d="M20 38 L44 38 L42 34 L22 34 Z" fill="${shadowColor}" opacity="0.3"/>
      
      <!-- Décoration du corps -->
      <circle cx="22" cy="42" r="2" fill="${accentColor}" stroke="${strokeColor}"/>
      <circle cx="42" cy="42" r="2" fill="${accentColor}" stroke="${strokeColor}"/>
      <polygon points="28,44 36,44 34,48 30,48" fill="${accentColor}" stroke="${strokeColor}"/>
      
      <!-- Base de la couronne -->
      <path d="M10 26 L54 26 L52 18 L12 18 Z" fill="url(#queenGradient${color})" stroke="${strokeColor}" stroke-width="1.5"/>
      
      <!-- Couronne royale avec 9 pics -->
      <path d="M12 18 L16 6 L20 12 L24 4 L28 10 L32 2 L36 10 L40 4 L44 12 L48 6 L52 18" 
            fill="url(#queenGradient${color})" stroke="${strokeColor}" stroke-width="2"/>
      
      <!-- Ornements de couronne -->
      <circle cx="16" cy="6" r="2" fill="${accentColor}" stroke="${strokeColor}"/>
      <circle cx="24" cy="4" r="2.5" fill="${accentColor}" stroke="${strokeColor}"/>
      <circle cx="32" cy="2" r="3" fill="${accentColor}" stroke="${strokeColor}"/>
      <circle cx="40" cy="4" r="2.5" fill="${accentColor}" stroke="${strokeColor}"/>
      <circle cx="48" cy="6" r="2" fill="${accentColor}" stroke="${strokeColor}"/>
      
      <!-- Bijou central -->
      <polygon points="30,2 34,2 36,6 32,8 28,6" fill="${accentColor}" stroke="${strokeColor}"/>
      
      <!-- Perles et diamants -->
      <circle cx="18" cy="14" r="1.5" fill="${accentColor}"/>
      <circle cx="26" cy="12" r="1.5" fill="${accentColor}"/>
      <circle cx="32" cy="10" r="2" fill="${accentColor}"/>
      <circle cx="38" cy="12" r="1.5" fill="${accentColor}"/>
      <circle cx="46" cy="14" r="1.5" fill="${accentColor}"/>
      
      <!-- Effets de lumière -->
      <ellipse cx="32" cy="30" rx="18" ry="10" fill="url(#queenRadial${color})" opacity="0.3"/>
    `;

    return svg;
  },

  // Enhanced Royal Rook with fortress details
  createRoyalRook: function(color) {
    const svg = this.createSVGElement("svg", {
      viewBox: "0 0 64 64",
      width: "100%",
      height: "100%"
    });

    const isWhite = color === "bianco";
    const baseColor = isWhite ? "#F8F8FF" : "#2F2F4F";
    const accentColor = isWhite ? "#FFD700" : "#C0C0C0";
    const shadowColor = isWhite ? "#D3D3D3" : "#1C1C1C";
    const strokeColor = isWhite ? "#8B4513" : "#654321";

    svg.innerHTML = `
      <defs>
        <linearGradient id="rookGradient${color}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${baseColor}"/>
          <stop offset="50%" style="stop-color:${accentColor}"/>
          <stop offset="100%" style="stop-color:${shadowColor}"/>
        </linearGradient>
      </defs>
      
      <!-- Base -->
      <ellipse cx="32" cy="58" rx="20" ry="4" fill="${shadowColor}" opacity="0.6"/>
      <path d="M12 54 L52 54 L50 50 L14 50 Z" fill="url(#rookGradient${color})" stroke="${strokeColor}" stroke-width="1"/>
      
      <!-- Corps de la tour -->
      <rect x="18" y="22" width="28" height="28" fill="url(#rookGradient${color})" stroke="${strokeColor}" stroke-width="2"/>
      
      <!-- Créneaux détaillés -->
      <path d="M12 22 L52 22 L52 14 L46 14 L46 18 L40 18 L40 14 L34 14 L34 18 L30 18 L30 14 L24 14 L24 18 L18 18 L18 14 L12 14 Z" 
            fill="url(#rookGradient${color})" stroke="${strokeColor}" stroke-width="2"/>
      
      <!-- Détails architecturaux -->
      <rect x="20" y="26" width="6" height="8" rx="1" fill="${shadowColor}" opacity="0.4"/>
      <rect x="38" y="26" width="6" height="8" rx="1" fill="${shadowColor}" opacity="0.4"/>
      <rect x="29" y="36" width="6" height="8" rx="1" fill="${shadowColor}" opacity="0.4"/>
      
      <!-- Ornements dorés -->
      <rect x="22" y="28" width="2" height="4" fill="${accentColor}"/>
      <rect x="40" y="28" width="2" height="4" fill="${accentColor}"/>
      <rect x="31" y="38" width="2" height="4" fill="${accentColor}"/>
      
      <!-- Bandes décoratives -->
      <rect x="18" y="30" width="28" height="2" fill="${accentColor}" opacity="0.6"/>
      <rect x="18" y="40" width="28" height="2" fill="${accentColor}" opacity="0.6"/>
      
      <!-- Armoiries centrales -->
      <circle cx="32" cy="35" r="4" fill="${accentColor}" stroke="${strokeColor}" stroke-width="1"/>
      <polygon points="30,33 34,33 32,37" fill="${strokeColor}"/>
    `;

    return svg;
  },

  // Enhanced Royal Bishop with ornate mitre
  createRoyalBishop: function(color) {
    const svg = this.createSVGElement("svg", {
      viewBox: "0 0 64 64",
      width: "100%",
      height: "100%"
    });

    const isWhite = color === "bianco";
    const baseColor = isWhite ? "#F8F8FF" : "#2F2F4F";
    const accentColor = isWhite ? "#FFD700" : "#C0C0C0";
    const shadowColor = isWhite ? "#D3D3D3" : "#1C1C1C";
    const strokeColor = isWhite ? "#800080" : "#4B0082";

    svg.innerHTML = `
      <defs>
        <linearGradient id="bishopGradient${color}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${baseColor}"/>
          <stop offset="50%" style="stop-color:${accentColor}"/>
          <stop offset="100%" style="stop-color:${shadowColor}"/>
        </linearGradient>
      </defs>
      
      <!-- Base -->
      <ellipse cx="32" cy="58" rx="18" ry="4" fill="${shadowColor}" opacity="0.6"/>
      <path d="M14 54 L50 54 L48 50 L16 50 Z" fill="url(#bishopGradient${color})" stroke="${strokeColor}" stroke-width="1"/>
      
      <!-- Corps principal -->
      <path d="M20 50 L44 50 L40 24 L24 24 Z" fill="url(#bishopGradient${color})" stroke="${strokeColor}" stroke-width="1.5"/>
      
      <!-- Mitre épiscopale -->
      <path d="M24 24 Q32 8 40 24" fill="url(#bishopGradient${color})" stroke="${strokeColor}" stroke-width="2"/>
      
      <!-- Ornement supérieur -->
      <circle cx="32" cy="12" r="4" fill="${accentColor}" stroke="${strokeColor}" stroke-width="2"/>
      <path d="M30 12 L34 12 M32 10 L32 14" stroke="${strokeColor}" stroke-width="2"/>
      
      <!-- Décoration de la mitre -->
      <path d="M26 20 Q32 16 38 20" fill="none" stroke="${accentColor}" stroke-width="2"/>
      <circle cx="28" cy="18" r="1.5" fill="${accentColor}"/>
      <circle cx="36" cy="18" r="1.5" fill="${accentColor}"/>
      
      <!-- Fente caractéristique -->
      <path d="M28 35 L36 45" stroke="${accentColor}" stroke-width="3" stroke-linecap="round"/>
      <path d="M36 35 L28 45" stroke="${accentColor}" stroke-width="3" stroke-linecap="round"/>
      
      <!-- Ornements du corps -->
      <circle cx="26" cy="30" r="2" fill="${accentColor}" stroke="${strokeColor}"/>
      <circle cx="38" cy="30" r="2" fill="${accentColor}" stroke="${strokeColor}"/>
      <polygon points="30,42 34,42 32,46" fill="${accentColor}" stroke="${strokeColor}"/>
    `;

    return svg;
  },

  // Enhanced Royal Knight with detailed horse head
  createRoyalKnight: function(color) {
    const svg = this.createSVGElement("svg", {
      viewBox: "0 0 64 64",
      width: "100%",
      height: "100%"
    });

    const isWhite = color === "bianco";
    const baseColor = isWhite ? "#F8F8FF" : "#2F2F4F";
    const accentColor = isWhite ? "#FFD700" : "#C0C0C0";
    const shadowColor = isWhite ? "#D3D3D3" : "#1C1C1C";
    const strokeColor = isWhite ? "#8B4513" : "#654321";

    svg.innerHTML = `
      <defs>
        <linearGradient id="knightGradient${color}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${baseColor}"/>
          <stop offset="50%" style="stop-color:${accentColor}"/>
          <stop offset="100%" style="stop-color:${shadowColor}"/>
        </linearGradient>
      </defs>
      
      <!-- Base -->
      <ellipse cx="32" cy="58" rx="20" ry="4" fill="${shadowColor}" opacity="0.6"/>
      <path d="M12 54 L52 54 L50 50 L14 50 Z" fill="url(#knightGradient${color})" stroke="${strokeColor}" stroke-width="1"/>
      
      <!-- Corps du chevalier -->
      <path d="M18 50 L46 50 L42 30 L22 30 Z" fill="url(#knightGradient${color})" stroke="${strokeColor}" stroke-width="1.5"/>
      
      <!-- Tête de cheval majestueuse -->
      <path d="M22 30 Q16 25 18 18 Q20 12 24 14 Q28 10 34 12 Q40 14 42 20 Q44 26 38 30 Q35 32 32 30" 
            fill="url(#knightGradient${color})" stroke="${strokeColor}" stroke-width="2"/>
      
      <!-- Crinière élégante -->
      <path d="M18 18 Q22 15 26 18" fill="none" stroke="${accentColor}" stroke-width="2"/>
      <path d="M20 16 Q24 13 28 16" fill="none" stroke="${accentColor}" stroke-width="2"/>
      <path d="M22 14 Q26 11 30 14" fill="none" stroke="${accentColor}" stroke-width="2"/>
      
      <!-- Oreilles pointues -->
      <path d="M28 14 L30 10 L32 14" fill="${accentColor}" stroke="${strokeColor}"/>
      <path d="M32 14 L34 10 L36 14" fill="${accentColor}" stroke="${strokeColor}"/>
      
      <!-- Œil expressif -->
      <circle cx="26" cy="20" r="2" fill="${strokeColor}"/>
      <circle cx="26.5" cy="19.5" r="0.5" fill="${baseColor}"/>
      
      <!-- Naseaux -->
      <ellipse cx="22" cy="24" rx="1" ry="2" fill="${strokeColor}"/>
      
      <!-- Bride décorative -->
      <path d="M24 22 Q32 20 38 24" fill="none" stroke="${accentColor}" stroke-width="2"/>
      <circle cx="28" cy="21" r="1" fill="${accentColor}"/>
      <circle cx="34" cy="22" r="1" fill="${accentColor}"/>
      
      <!-- Ornements du corps -->
      <circle cx="30" cy="40" r="3" fill="${accentColor}" stroke="${strokeColor}"/>
      <polygon points="28,40 32,40 30,44" fill="${strokeColor}"/>
    `;

    return svg;
  },

  // Enhanced Royal Pawn with noble details
  createRoyalPawn: function(color) {
    const svg = this.createSVGElement("svg", {
      viewBox: "0 0 64 64",
      width: "100%",
      height: "100%"
    });

    const isWhite = color === "bianco";
    const baseColor = isWhite ? "#F8F8FF" : "#2F2F4F";
    const accentColor = isWhite ? "#FFD700" : "#C0C0C0";
    const shadowColor = isWhite ? "#D3D3D3" : "#1C1C1C";
    const strokeColor = isWhite ? "#4169E1" : "#000080";

    svg.innerHTML = `
      <defs>
        <linearGradient id="pawnGradient${color}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${baseColor}"/>
          <stop offset="50%" style="stop-color:${accentColor}"/>
          <stop offset="100%" style="stop-color:${shadowColor}"/>
        </linearGradient>
      </defs>
      
      <!-- Base stable -->
      <ellipse cx="32" cy="58" rx="16" ry="4" fill="${shadowColor}" opacity="0.6"/>
      <path d="M16 54 L48 54 L46 50 L18 50 Z" fill="url(#pawnGradient${color})" stroke="${strokeColor}" stroke-width="1"/>
      
      <!-- Corps élégant -->
      <path d="M22 50 L42 50 L38 34 L26 34 Z" fill="url(#pawnGradient${color})" stroke="${strokeColor}" stroke-width="1.5"/>
      
      <!-- Col raffiné -->
      <path d="M26 34 L38 34 L36 28 L28 28 Z" fill="url(#pawnGradient${color})" stroke="${strokeColor}" stroke-width="1.5"/>
      
      <!-- Tête noble -->
      <circle cx="32" cy="22" r="8" fill="url(#pawnGradient${color})" stroke="${strokeColor}" stroke-width="2"/>
      
      <!-- Ornements de la tête -->
      <circle cx="32" cy="22" r="4" fill="${accentColor}" opacity="0.6"/>
      <circle cx="29" cy="20" r="1" fill="${accentColor}"/>
      <circle cx="35" cy="20" r="1" fill="${accentColor}"/>
      <circle cx="32" cy="24" r="1.5" fill="${accentColor}"/>
      
      <!-- Détails du corps -->
      <rect x="30" y="40" width="4" height="6" rx="2" fill="${accentColor}" opacity="0.8"/>
      <circle cx="28" cy="42" r="1" fill="${accentColor}"/>
      <circle cx="36" cy="42" r="1" fill="${accentColor}"/>
      
      <!-- Bande décorative -->
      <rect x="26" y="36" width="12" height="1" fill="${accentColor}"/>
    `;

    return svg;
  }
};

// Helper function to replace image-based pieces with elegant SVG
function createSVGPiece(tipo, color) {
  let pieceType;
  
  // Map Italian piece names to English
  if (tipo.includes("Pedone")) pieceType = "pawn";
  else if (tipo.includes("Torre")) pieceType = "rook";
  else if (tipo.includes("Cavallo")) pieceType = "knight";
  else if (tipo.includes("Alfiere")) pieceType = "bishop";
  else if (tipo.includes("Regina")) pieceType = "queen";
  else if (tipo.includes("Re")) pieceType = "king";
  else pieceType = "pawn"; // fallback
  
  return ChessSVG.createDetailedPiece(pieceType, color);
}

// Espone le funzioni globalmente per compatibilità con altri script
window.ChessSVG = ChessSVG;
window.createSVGPiece = createSVGPiece;
