import React, { useEffect, useRef } from 'react';

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

function getGoogleClient() {
  return window.google?.accounts?.id;
}

export function GoogleLoginButton({ onCredential, buttonConfig = {} }) {
  const buttonContainerRef = useRef(null);
  const onCredentialRef = useRef(onCredential);

  useEffect(() => {
    onCredentialRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error('Missing VITE_GOOGLE_CLIENT_ID environment variable.');
      return undefined;
    }

    let isMounted = true;
    const initializeGoogle = () => {
      if (!isMounted) return;

      const googleClient = getGoogleClient();
      const container = buttonContainerRef.current;

      if (!googleClient || !container) {
        return;
      }

      googleClient.initialize({
        client_id: clientId,
        callback: (response) => {
          onCredentialRef.current?.(response);
        },
        ux_mode: 'popup',
        auto_select: false,
      });

      googleClient.renderButton(container, {
        type: 'standard',
        shape: 'pill',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        logo_alignment: 'left',
        ...buttonConfig,
      });

      googleClient.prompt();
    };

    const maybeInitialize = () => {
      if (getGoogleClient()) {
        initializeGoogle();
      }
    };

    maybeInitialize();

    let script;
    if (!getGoogleClient()) {
      script = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
      script?.addEventListener('load', maybeInitialize);
    }

    return () => {
      isMounted = false;
      script?.removeEventListener('load', maybeInitialize);
    };
  }, []);

  return <div ref={buttonContainerRef} className="google-login-button" />;
}
