// Este es un set completo de archivos para un proyecto Next.js con Tailwind, chat IA y Stripe.
// Ideal para subir a GitHub y desplegar en Vercel.

/* ESTRUCTURA DE ARCHIVOS SUGERIDA:

/my-financial-future/
 ├─ app/
 │   ├─ page.jsx                -> frontend principal (código del componente grande que te di)
 │   ├─ globals.css             -> estilos Tailwind base
 │   ├─ api/
 │   │    ├─ chat/route.js      -> endpoint de chat IA
 │   │    └─ create-checkout-session/route.js -> endpoint Stripe
 ├─ package.json                -> dependencias del proyecto
 ├─ tailwind.config.js          -> configuración Tailwind
 ├─ postcss.config.js           -> configuración PostCSS
 └─ .gitignore                  -> para ignorar node_modules y .env
*/

/* --------------------------------
1) package.json
-------------------------------- */
{
  "name": "financial-future",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "stripe": "latest"
  },
  "devDependencies": {
    "tailwindcss": "latest",
    "postcss": "latest",
    "autoprefixer": "latest"
  }
}

/* --------------------------------
2) tailwind.config.js
-------------------------------- */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

/* --------------------------------
3) postcss.config.js
-------------------------------- */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

/* --------------------------------
4) app/globals.css
-------------------------------- */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Puedes agregar estilos adicionales aquí */

/* --------------------------------
5) app/page.jsx
-------------------------------- */
// Aquí va el código grande que te di antes con el componente React FinancialFuture.jsx
// Asegúrate de importarlo aquí si lo pones en otro archivo

import FinancialFuture from './FinancialFuture';

export default function Page() {
  return <FinancialFuture />;
}

/* --------------------------------
6) app/api/chat/route.js
-------------------------------- */
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { text } = await req.json();
    const reply = `Echo IA: ${text}`; // Reemplaza con OpenAI u otra IA
    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error en chat' }, { status: 500 });
  }
}

/* --------------------------------
7) app/api/create-checkout-session/route.js
-------------------------------- */
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET);

export async function POST(req) {
  try {
    const { priceId } = await req.json();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/success`,
      cancel_url: `${req.headers.get('origin')}/cancel`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error creando sesión' }, { status: 500 });
  }
}

/* --------------------------------
8) .gitignore
-------------------------------- */
node_modules
.env.local
.next
.DS_Store

/* --------------------------------
VARIABLES DE ENTORNO (Vercel / .env.local)
--------------------------------
STRIPE_SECRET=sk_test_XXXXXXXXXXXXXXXXXXXX
OPENAI_KEY=sk-XXXXXXXXXXXXXXXXXXXX
*/
