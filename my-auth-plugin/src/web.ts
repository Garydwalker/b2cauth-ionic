import { PublicClientApplication } from '@azure/msal-browser';
import { WebPlugin } from '@capacitor/core';

import type { BaseOptions, MsAuthPlugin } from './definitions';

interface WebBaseOptions extends BaseOptions {
  redirectUri?: string;
}

interface WebLoginOptions extends WebBaseOptions {
  scopes: string[];
}

type WebLogoutOptions = WebBaseOptions;

interface AuthResult {
  accessToken: string;
  idToken: string;
  scopes: string[];
  
}

export class MsAuth extends WebPlugin implements MsAuthPlugin {
  // Singleton instance of MSAL
  private static msalInstance: PublicClientApplication | null = null;
  private static lastOptions: WebBaseOptions | null = null;

  async login(options: WebLoginOptions): Promise<AuthResult| null> {
    console.log("MSAL PLUGIN: login called");
    const context = await this.getOrCreateContext(options);
   if(context.getAllAccounts().length ===0){
     await this.acquireTokenInteractively(context, options.scopes);
     return null;
   }
   else{
    try {
      return await this.acquireTokenSilently(context, options.scopes);
    } catch (error) {
      console.error('MSAL: Error occurred while logging in', error);
      await this.acquireTokenInteractively(context, options.scopes);
      return null;
    }
  }}

  async logout(options: WebLogoutOptions): Promise<void> {
    console.log("MSAL PLUGIN: logout called");
    const context = await this.getOrCreateContext(options);

    if (!context.getAllAccounts()[0]) {
      return Promise.reject(new Error('Nothing to sign out from.'));
    } else {
      return context.logoutRedirect();
    }
  }

  async handleRedirect(options?: WebLoginOptions): Promise<AuthResult | null> {
    console.log("MSAL PLUGIN: redirect called");
    
    try {
      // Use provided options or fall back to last used options
      const optsToUse = options || MsAuth.lastOptions as WebLoginOptions;
      
      if (!optsToUse) {
        console.error('No options provided for handleRedirect and no previous options found');
        return null;
      }
      
      const context = await this.getOrCreateContext(optsToUse);

      const response = await context.handleRedirectPromise();
      
      // If no response, we didn't get a successful redirect
      if (!response) {
        return null;
      }

      // Get tokens from the response
      const { accessToken, idToken, scopes } = response;
      return { accessToken, idToken, scopes };
    } catch (error) {
      console.error('Error handling redirect:', error);
      return null;
    }
  }

  async getAccount(options?: WebLoginOptions): Promise<AuthResult | null> {
    console.log("MSAL PLUGIN: getAccount called");
    try {
      // Use provided options or fall back to last used options
      const optsToUse = options || MsAuth.lastOptions as WebLoginOptions;
      
      if (!optsToUse) {
        console.error('No options provided for getAccount and no previous options found');
        return null;
      }
      
      const context = await this.getOrCreateContext(optsToUse);
      const accounts = context.getAllAccounts();
      
      if (accounts.length === 0) {
        return null;
      }

      // Try to silently get tokens for the first account
      const scopes = optsToUse.scopes || ['openid', 'profile'];
      try {
        return await this.acquireTokenSilently(context, scopes);
      } catch {
        return null;
      }
    } catch (error) {
      console.error('Error getting account:', error);
      return null;
    }
  }

  // Get existing context or create a new one
  private async getOrCreateContext(options: WebBaseOptions): Promise<PublicClientApplication> {
    // If we already have an instance and the options haven't changed materially, reuse it
    if (MsAuth.msalInstance && this.areOptionsSame(options, MsAuth.lastOptions)) {
      console.log('Reusing existing MSAL instance with options:');
      return MsAuth.msalInstance;

    }

    // Otherwise create a new instance
    MsAuth.lastOptions = {...options};
    
    const config = {
      auth: {
        clientId: options.clientId,
        domainHint: options.domainHint,
        authority: options.authorityUrl ?? `https://login.microsoftonline.com/${options.tenant ?? 'common'}`,
        knownAuthorities: options.knownAuthorities,
        redirectUri: options.redirectUri ?? this.getCurrentUrl(),
      },
      cache: {
        cacheLocation: 'sessionStorage', // Still using sessionStorage for token cache
      },
    };

    MsAuth.msalInstance = new PublicClientApplication(config);
    await MsAuth.msalInstance.initialize();
    return MsAuth.msalInstance;
  }

  // Helper to compare options objects for material changes
  private areOptionsSame(newOpts: WebBaseOptions | null, oldOpts: WebBaseOptions | null): boolean {
    if (!newOpts || !oldOpts) return false;
    
    // Compare critical properties that would require a new MSAL instance
    return newOpts.clientId === oldOpts.clientId && 
           newOpts.tenant === oldOpts.tenant &&
           newOpts.authorityUrl === oldOpts.authorityUrl &&
           newOpts.redirectUri === oldOpts.redirectUri;
  }

  private getCurrentUrl(): string {
    return window.location.href.split(/[?#]/)[0];
  }

  private async acquireTokenInteractively(context: PublicClientApplication, scopes: string[]): Promise<void> {
    return context.acquireTokenRedirect({
      scopes,
      prompt: 'login',
    });
  }

  private async acquireTokenSilently(context: PublicClientApplication, scopes: string[]): Promise<AuthResult> {
    const { accessToken, idToken } = await context.acquireTokenSilent({
      scopes,
      account: context.getAllAccounts()[0],
    });

    return { accessToken, idToken, scopes };
  }
}