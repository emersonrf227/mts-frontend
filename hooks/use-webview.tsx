import { useEffect, useState } from 'react';

export const useIsWebView = () => {
  const [isWebView, setIsWebView] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('DubaiCashApp-WebView')) {
      setIsWebView(true);
    }
  }, []);

  return isWebView;
};
