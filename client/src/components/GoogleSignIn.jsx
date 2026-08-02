import { useEffect, useRef, useState } from 'react';

const GOOGLE_IDENTITY_SCRIPT = 'https://accounts.google.com/gsi/client';
const SCRIPT_ID = 'google-identity-services';

const GoogleSignIn = ({ onCredential, onError }) => {
  const buttonRef = useRef(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setMessage('Google sign-in is not configured yet.');
      return undefined;
    }

    let cancelled = false;

    const renderButton = () => {
      if (cancelled || !buttonRef.current || !window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          if (!credential) {
            onError('Google did not return a sign-in credential.');
            return;
          }

          try {
            await onCredential(credential);
          } catch (error) {
            onError(error.response?.data?.message || 'Google sign-in failed. Please try again.');
          }
        },
      });

      buttonRef.current.replaceChildren();
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: Math.min(Math.max(buttonRef.current.clientWidth, 240), 400),
      });
    };

    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) {
      renderButton();
    } else {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = GOOGLE_IDENTITY_SCRIPT;
      script.async = true;
      script.defer = true;
      script.onload = renderButton;
      script.onerror = () => {
        if (!cancelled) onError('Google sign-in could not be loaded. Check your connection and try again.');
      };
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, [onCredential, onError]);

  return (
    <div className="google-sign-in" aria-live="polite">
      <div ref={buttonRef} className="google-sign-in-button" />
      {message && <p className="google-sign-in-message">{message}</p>}
    </div>
  );
};

export default GoogleSignIn;
