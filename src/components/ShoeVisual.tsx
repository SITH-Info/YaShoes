import React from 'react';
import { ShoeColorway, ShoeCategory } from '../types';

interface ShoeVisualProps {
  colorway: ShoeColorway;
  category?: ShoeCategory;
  angle?: 'side' | 'angled' | 'top' | 'sole';
  className?: string;
  customUpper?: string;
  customSole?: string;
  customAccent?: string;
  customLaces?: string;
  monogram?: string;
  interactiveHover?: boolean;
}

export const ShoeVisual: React.FC<ShoeVisualProps> = ({
  colorway,
  category = 'Running',
  angle = 'side',
  className = 'w-full h-full',
  customUpper,
  customSole,
  customAccent,
  customLaces,
  monogram,
  interactiveHover = false,
}) => {
  const upper = customUpper || colorway.hex;
  const secondary = colorway.secondaryHex || '#27272a';
  const accent = customAccent || colorway.accentHex;
  const sole = customSole || colorway.soleHex;
  const laces = customLaces || accent;

  // Render based on angle
  if (angle === 'sole') {
    return (
      <div className={`relative flex items-center justify-center p-6 ${className}`}>
        <svg
          viewBox="0 0 400 240"
          className="w-full h-full max-h-64 object-contain filter drop-shadow-md select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outsole Base Outline */}
          <path
            d="M 60,110 C 60,60 110,40 180,45 C 260,50 330,70 340,110 C 350,150 280,185 200,180 C 120,175 60,160 60,110 Z"
            fill={sole}
            stroke="#1c1917"
            strokeWidth="3"
          />
          {/* Carbon Fiber / Torsion Plate Center Shank */}
          <path
            d="M 160,75 C 190,75 220,80 230,110 C 220,140 190,145 160,145 C 145,130 145,90 160,75 Z"
            fill="#18181b"
            stroke={accent}
            strokeWidth="2"
          />
          {/* Carbon Plate Weave Accent */}
          <line x1="165" y1="85" x2="215" y2="135" stroke={accent} strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="180" y1="80" x2="225" y2="125" stroke={accent} strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="165" y1="135" x2="215" y2="85" stroke={accent} strokeWidth="1.5" strokeOpacity="0.6" />

          {/* Forefoot Grip Lugs Pattern */}
          <g fill="#292524" opacity="0.85">
            <rect x="250" y="70" width="16" height="6" rx="2" transform="rotate(-15 250 70)" />
            <rect x="275" y="72" width="16" height="6" rx="2" transform="rotate(-10 275 72)" />
            <rect x="300" y="82" width="16" height="6" rx="2" transform="rotate(5 300 82)" />
            <rect x="250" y="90" width="18" height="6" rx="2" transform="rotate(-5 250 90)" />
            <rect x="280" y="95" width="20" height="6" rx="2" />
            <rect x="310" y="105" width="16" height="6" rx="2" transform="rotate(15 310 105)" />
            <rect x="245" y="115" width="18" height="6" rx="2" transform="rotate(10 245 115)" />
            <rect x="275" y="120" width="18" height="6" rx="2" transform="rotate(15 275 120)" />
            <rect x="300" y="130" width="16" height="6" rx="2" transform="rotate(25 300 130)" />
          </g>

          {/* Heel Traction Pods */}
          <g fill="#292524" opacity="0.85">
            <rect x="85" y="90" width="20" height="8" rx="2" transform="rotate(20 85 90)" />
            <rect x="110" y="80" width="22" height="8" rx="2" transform="rotate(10 110 80)" />
            <rect x="85" y="115" width="22" height="8" rx="2" transform="rotate(-10 85 115)" />
            <rect x="110" y="125" width="22" height="8" rx="2" transform="rotate(-20 110 125)" />
          </g>

          {/* Brand Emboss Stamp on Sole */}
          <text
            x="200"
            y="114"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="2"
            fontFamily="sans-serif"
          >
            YaShoes · GRIP
          </text>
        </svg>
      </div>
    );
  }

  if (angle === 'top') {
    return (
      <div className={`relative flex items-center justify-center p-6 ${className}`}>
        <svg
          viewBox="0 0 400 240"
          className="w-full h-full max-h-64 object-contain filter drop-shadow-md select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Midsole Lip visible from top */}
          <path
            d="M 50,120 C 50,65 110,48 200,50 C 290,52 350,75 355,120 C 350,165 290,188 200,190 C 110,192 50,175 50,120 Z"
            fill={sole}
            opacity="0.95"
          />

          {/* Upper Body Top Silhouette */}
          <path
            d="M 65,120 C 65,75 120,60 200,62 C 285,64 338,82 342,120 C 338,158 285,176 200,178 C 120,180 65,165 65,120 Z"
            fill={upper}
          />

          {/* Toe Guard Cap */}
          <path
            d="M 285,74 C 320,86 338,102 342,120 C 338,138 320,154 285,166 C 300,140 300,100 285,74 Z"
            fill={secondary}
            opacity="0.4"
          />

          {/* Breathable Perforations on Toe Box */}
          <g fill={accent} opacity="0.3">
            <circle cx="280" cy="110" r="2.5" />
            <circle cx="280" cy="120" r="2.5" />
            <circle cx="280" cy="130" r="2.5" />
            <circle cx="295" cy="115" r="2.5" />
            <circle cx="295" cy="125" r="2.5" />
            <circle cx="310" cy="120" r="2.5" />
          </g>

          {/* Ankle Collar Opening */}
          <ellipse cx="125" cy="120" rx="35" ry="24" fill="#09090b" />
          {/* Cushioned Sockliner / Insole */}
          <ellipse cx="128" cy="120" rx="30" ry="20" fill={secondary} />
          <text
            x="128"
            y="123"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="8"
            fontWeight="bold"
            letterSpacing="1"
          >
            {monogram || 'YaShoes'}
          </text>

          {/* Eyelet Stay & Lacing System from Top */}
          <path
            d="M 160,100 L 260,105 L 260,135 L 160,140 Z"
            fill={secondary}
            opacity="0.25"
          />
          {/* Crossed Laces */}
          <g stroke={laces} strokeWidth="3.5" strokeLinecap="round">
            <line x1="175" y1="102" x2="195" y2="138" />
            <line x1="175" y1="138" x2="195" y2="102" />
            <line x1="205" y1="104" x2="225" y2="136" />
            <line x1="205" y1="136" x2="225" y2="104" />
            <line x1="235" y1="106" x2="252" y2="134" />
            <line x1="235" y1="134" x2="252" y2="106" />
          </g>
        </svg>
      </div>
    );
  }

  // Side view and angled view
  const isAngled = angle === 'angled';

  return (
    <div
      className={`relative flex items-center justify-center p-4 transition-transform duration-300 ${
        interactiveHover ? 'hover:scale-[1.03]' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 500 280"
        className={`w-full h-full max-h-72 object-contain filter drop-shadow-xl select-none transition-all duration-300 ${
          isAngled ? 'transform -rotate-2 scale-95' : ''
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`upperGrad-${upper}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={upper} stopOpacity="1" />
            <stop offset="70%" stopColor={upper} stopOpacity="0.9" />
            <stop offset="100%" stopColor={secondary} stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id={`soleGrad-${sole}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={sole} />
            <stop offset="100%" stopColor="#1c1917" stopOpacity="0.85" />
          </linearGradient>

          <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="10" floodOpacity="0.16" />
          </filter>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="250" cy="245" rx="190" ry="14" fill="#000000" fillOpacity="0.14" />
        <ellipse cx="260" cy="243" rx="140" ry="8" fill="#000000" fillOpacity="0.22" />

        {/* --- SOLE UNIT (Midsole + Outsole) --- */}
        {/* Outsole Grip Layer */}
        <path
          d="M 68,225 C 90,227 150,227 200,224 C 270,220 330,222 410,210 C 430,207 438,202 440,198 C 436,204 425,214 405,218 C 330,230 260,231 190,232 C 140,233 80,233 65,229 Z"
          fill="#171717"
        />
        {/* Outsole Lugs Teeth Detail */}
        <path
          d="M 100,231 L 105,235 L 115,231 L 135,231 L 140,235 L 150,231 L 280,227 L 285,231 L 295,227 L 330,225 L 335,229 L 345,224 L 380,219 L 385,223 L 395,218"
          stroke="#0a0a0a"
          strokeWidth="3"
        />

        {/* Sculpted Midsole Cushion (Aerodynamic Foam) */}
        <path
          d="M 58,212 C 55,200 60,185 75,182 C 110,175 160,182 205,185 C 265,190 320,175 390,165 C 418,161 435,170 442,185 C 445,192 438,202 420,208 C 340,224 260,224 195,226 C 140,228 85,228 65,224 C 58,222 56,218 58,212 Z"
          fill={sole}
          filter="url(#shadowFilter)"
        />

        {/* Midsole Aerodynamic Chiseled Grooves / Carbon Shank window */}
        <path
          d="M 120,202 C 160,200 210,203 250,207"
          stroke="#000000"
          strokeOpacity="0.18"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 140,212 C 180,211 230,213 280,215"
          stroke="#000000"
          strokeOpacity="0.12"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Carbon Plate / Stabilizer Heel Clip */}
        <path
          d="M 68,185 C 62,175 65,160 80,158 C 95,156 110,162 118,178 C 98,181 80,182 68,185 Z"
          fill={accent}
        />

        {/* --- MAIN UPPER BODY --- */}
        {category === 'Boots' ? (
          /* Chelsea / High Shaft Upper */
          <path
            d="M 72,178 C 65,140 68,105 85,75 C 92,62 108,60 125,62 C 138,65 142,85 140,110 C 145,125 170,140 215,148 C 280,158 350,155 405,158 C 428,160 435,172 432,182 C 370,180 290,185 210,184 C 150,183 95,180 72,178 Z"
            fill={upper}
          />
        ) : (
          /* Aerodynamic Running & Court Sneaker Upper */
          <path
            d="M 72,178 C 62,150 68,120 90,105 C 105,95 125,98 140,115 C 158,135 185,140 230,138 C 290,135 345,138 395,152 C 425,160 435,174 430,182 C 365,178 285,184 210,183 C 145,182 95,180 72,178 Z"
            fill={upper}
          />
        )}

        {/* Upper Texture Overlay / Knit Mesh Pattern for Sport/Runners */}
        {category === 'Running' || category === 'Trail' ? (
          <path
            d="M 230,142 C 285,140 340,144 388,155 C 415,162 422,174 418,179 C 360,176 290,181 220,181 Z"
            fill={secondary}
            fillOpacity="0.25"
          />
        ) : null}

        {/* Collar & Ankle Support Padding */}
        <path
          d="M 90,105 C 100,98 118,98 135,110 C 142,118 138,128 128,130 C 112,132 98,120 90,105 Z"
          fill="#18181b"
        />

        {/* Mudguard / Reinforced Toe Box Cap */}
        <path
          d="M 370,154 C 395,158 425,164 430,182 C 405,183 380,182 360,176 C 362,168 365,160 370,154 Z"
          fill={secondary}
          fillOpacity="0.4"
        />

        {/* YaShoes Signature Aerodynamic Dynamic Wing/Streak */}
        <path
          d="M 130,148 C 175,138 245,138 310,154 C 335,160 350,170 345,178 C 300,172 230,165 165,168 C 145,169 135,160 130,148 Z"
          fill={accent}
          fillOpacity="0.95"
        />
        <path
          d="M 145,158 C 185,150 250,150 300,162 C 255,166 200,164 155,168 Z"
          fill="#ffffff"
          fillOpacity="0.35"
        />

        {/* Lacing System Eyelets & Engineered Laces */}
        {category !== 'Boots' && category !== 'Slides' ? (
          <g>
            {/* Lacing Eyestay Panel */}
            <path
              d="M 175,128 C 205,124 245,126 275,134 C 270,142 250,145 220,143 C 190,141 180,136 175,128 Z"
              fill={secondary}
              fillOpacity="0.3"
            />
            {/* Eyelet Rivets */}
            <circle cx="190" cy="132" r="3" fill="#ffffff" fillOpacity="0.8" />
            <circle cx="215" cy="133" r="3" fill="#ffffff" fillOpacity="0.8" />
            <circle cx="240" cy="136" r="3" fill="#ffffff" fillOpacity="0.8" />
            <circle cx="265" cy="140" r="3" fill="#ffffff" fillOpacity="0.8" />

            {/* Woven Laces Floating Strands */}
            <path
              d="M 190,132 C 198,125 210,126 215,133"
              stroke={laces}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 215,133 C 224,127 234,129 240,136"
              stroke={laces}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 240,136 C 248,131 258,133 265,140"
              stroke={laces}
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Lace Knot & Aglet ends */}
            <path
              d="M 185,132 C 172,122 165,116 160,120"
              stroke={laces}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        ) : null}

        {/* Chelsea Boot Elastic Gusset Side Panel */}
        {category === 'Boots' ? (
          <path
            d="M 98,85 L 128,88 L 122,145 L 105,143 Z"
            fill="#121214"
            opacity="0.85"
            stroke="#27272a"
            strokeWidth="1.5"
          />
        ) : null}

        {/* Monogram / Brand Heel Badge */}
        {monogram ? (
          <g>
            <rect x="75" y="145" width="24" height="14" rx="3" fill="#18181b" />
            <text
              x="87"
              y="155"
              textAnchor="middle"
              fill={accent}
              fontSize="7"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {monogram.slice(0, 3).toUpperCase()}
            </text>
          </g>
        ) : (
          <text
            x="85"
            y="172"
            fill={accent}
            fontSize="6"
            fontWeight="bold"
            letterSpacing="1"
            fontFamily="sans-serif"
            opacity="0.9"
          >
            YS-01
          </text>
        )}
      </svg>
    </div>
  );
};
