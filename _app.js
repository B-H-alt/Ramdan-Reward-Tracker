// pages/_app.js
import '../styles/globals.css';
import { AuthProvider } from '../utils/auth';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
