import { AccountData, DirectSignResponse } from '@cosmjs/proto-signing';
import { fromHex, toHex } from '@cosmjs/encoding';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import Long from 'long';
import { CosmJSOfflineDirectSigner } from './cosmjs';
import { capitalize } from './utils';

type EventListener = {
  addMessageListener: (fn: (e: any) => void) => void;
  removeMessageListener: (fn: (e: any) => void) => void;
  postMessage: (message: any) => void;
};

export class Falcon {
  constructor(protected eventListener: EventListener) {}

  protected _handleRequest(type: string, payload?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const handleResponse = (response) => {
        if (!response) {
          reject(new Error('Response is null'));
        }
        if (response.type !== `on${capitalize(type)}`) {
          reject(
            new Error(`Mismatched response type ${type} ${response.type}`)
          );
        }
        if (response.payload && response.payload.error) {
          reject(new Error(response.payload.error));
        }
        resolve(response.payload);
      };
      this.eventListener.postMessage({ type, payload, falcon: true });
      this.eventListener.addMessageListener(handleResponse);
    });
  }

  async connect(): Promise<void> {
    await this._handleRequest('connect');
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: SignDoc
  ): Promise<DirectSignResponse> {
    if (!chainId) {
      throw new Error('Chain ID is required');
    }
    if (!signer) {
      throw new Error('Signer is required');
    }
    if (!signDoc) {
      throw new Error('SignDoc is required');
    }
    const response = await this._handleRequest('signDirect', {
      chainId,
      signer,
      signDoc: {
        accountNumber: signDoc.accountNumber.toString(),
        authInfoBytes: toHex(signDoc.authInfoBytes),
        bodyBytes: toHex(signDoc.bodyBytes),
        chainId: signDoc.chainId,
      },
    });
    return {
      signature: response.signature,
      signed: {
        bodyBytes: fromHex(response.signed.bodyBytes),
        authInfoBytes: fromHex(response.signed.authInfoBytes),
        chainId: response.signed.chainId,
        accountNumber: Long.fromString(response.signed.accountNumber),
      },
    } as DirectSignResponse;
  }

  async getAccount(chainId: string): Promise<AccountData> {
    if (!chainId) {
      throw new Error('Chain ID is required');
    }
    const account = await this._handleRequest('getAccount', { chainId });
    return {
      ...account,
      pubkey: fromHex(account.pubkey),
    } as AccountData;
  }

  async getOfflineSigner(chainId: string) {
    return new CosmJSOfflineDirectSigner(chainId, this);
  }

  async importZone(config: any) {
    if (!config) {
      throw new Error('Config is required');
    }
    await this._handleRequest('importZone', { config });
  }
}
