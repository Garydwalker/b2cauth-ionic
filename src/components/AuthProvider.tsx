import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

import { Capacitor } from '@capacitor/core';

import { LoginOptions, MsAuthPlugin } from 'gwmsauthplugin';


type AuthContextType = {
  token: string | null;
  user: any | null;
  login: () => Promise<void>;
  logout: () => void;
  error: string | null;
  mode: string;
  config: LoginOptions;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Helper to decode a JWT (idToken)
function decodeJwt(token: string | null): any | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}
type AuthMode = 'android' | 'web';


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [decodedIdToken, setDecodedIdToken] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
const [loginAttempted, setLoginAttempted] = useState(false);
const [interactionInProgress, setInteractionInProgress] = useState(false);

  const [mode, setMode] = useState<AuthMode>(
    Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android' ? 'android' : 'web'
  );
  
const config: Record<AuthMode, LoginOptions> = {
};

  // Handle redirect response separately from the login flow
  const handleRedirect = useCallback(async () => {
    let hasFoundAccount =false;
  if (mode === 'web') {
    try {
      const url = window.location.href;
      console.log("Current URL:", url);
      
      if (url.includes('#state=')) {
        setInteractionInProgress(true);
  
        console.log("Handling redirect for web mode...");
        const result = await MsAuthPlugin.handleRedirect({...config[mode]});
        console.log("Redirect result:", result);
        
        if (result && result.accessToken) {
          console.log("Access token found in redirect response");
          setToken(result.accessToken);
          setIdToken(result.idToken);
          setDecodedIdToken(decodeJwt(result.idToken));
          
          // Remove the URL fragments after processing
          if (window.history && window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          
          hasFoundAccount = true;
        }
      } 

    }catch (err: any) {
      console.error("Error in handleRedirect:", err);
      setError(err.message || 'Failed to handle redirect');
    } finally {
      setInteractionInProgress(false);
    }
  }
  return hasFoundAccount;
}, [mode, config, loginAttempted]);

  const login = useCallback(async () => {
    setError(null);
    // Don't attempt login if interaction is already in progress

    if (interactionInProgress) {
    console.log("Login skipped - interaction already in progress");
    return;
  }
    try {
    setInteractionInProgress(true);
      const result = await MsAuthPlugin.login(config[mode]);
      if(result !== null){
      setToken(result?.accessToken);
      setIdToken(result?.idToken);
      setDecodedIdToken(decodeJwt(result.idToken));
      }
    } catch (err: any) {
     
      if (err.message && err.message.includes('interaction_in_progress')) {
      console.log("Interaction already in progress. Waiting for completion...");
      await login();
    } else {
      setError(err.message || 'Login failed');
      setToken(null);
      setIdToken(null);
      setDecodedIdToken(null);
    }}
     finally {
    setInteractionInProgress(false);
     setLoginAttempted(false);
  }
  }, [mode, config,interactionInProgress]);

  const logout = useCallback(async () => {

    setToken(null);
    setIdToken(null);
    setDecodedIdToken(null);
    setError(null);
    try {
      await MsAuthPlugin.logout({...config[mode]});
      setIsInitializing(false);
      setLoginAttempted(false);
      setInteractionInProgress(false);
    } catch (err: any) {
      setError(err.message || 'Logout failed');
    }     
  }, [mode, config]);
console.log({isInitializing, interactionInProgress, loginAttempted, token, idToken, decodedIdToken});
  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
     console.log({isInitializing, interactionInProgress})
    console.log("Starting auth initialization...");
        if (interactionInProgress) {
      console.log("Skipping auth initialization - interaction already in progress");
      return;
    }
    
    // First try to handle any redirect response
    console.log("Checking for redirect response...");
    console.log(mode)
    console.log("Current URL:", window.location.href);
    if( mode === 'web' && window.location.href.includes('#')) { 
    const redirectHandled = await handleRedirect();
    
    console.log("Redirect handled:", redirectHandled);
    }
   
      };

  initAuth();

}, [handleRedirect, mode, interactionInProgress]);

useEffect(() => {
    const autoLogin = async () => {
      // Don't auto-login if we already have a token

      if (token) {
        console.log("Already authenticated, skipping auto-login");
        return;
      }

      // Don't auto-login if we already attempted to login or interaction is in progress
    if (loginAttempted || interactionInProgress) {
      console.log(`Skipping auto-login: loginAttempted=${loginAttempted}, interactionInProgress=${interactionInProgress}`);
      return;
    }

      // Don't auto-login if we're in the middle of processing a redirect
      if (window.location.href.includes('#')) {
        console.log("URL contains hash fragments, skipping auto-login");
        return;
      }
      
      console.log("Starting automatic login...");
      setLoginAttempted(true);
      try {
        console.log("LOGIN CALLED");
        
     console.log({isInitializing, interactionInProgress})
        await login();
      } catch (err) {
        console.error("Auto-login failed:", err);
      }
    };

    // Short delay to allow redirect handling to complete first
    const timer = setTimeout(() => {
      autoLogin();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [token, loginAttempted, interactionInProgress,login]);
 

  return (
    <AuthContext.Provider value={{ 
      token, 
      login, 
      logout, 
      error, 
      mode, 
      config: config[mode], 
      user: decodedIdToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};