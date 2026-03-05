import { createRoot } from 'react-dom/client';
import App from './App';

// Inject Vaul drawer styles once at app boot
const vaulStyle = document.createElement('style');
vaulStyle.textContent = `
  [vaul-drawer]::after { display: none !important; }
  [vaul-overlay] { position: fixed; inset: 0; }
`;
document.head.appendChild(vaulStyle);

createRoot(document.getElementById('root')).render(<App />);
