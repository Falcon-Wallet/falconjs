import {
  AccountData,
  OfflineDirectSigner,
  DirectSignResponse,
} from '@cosmjs/proto-signing';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
// TODO: Implement offline amino signer too
// import { OfflineAminoSigner } from '@cosmjs/amino';
import { Falcon } from './falcon';

export class CosmJSOfflineDirectSigner implements OfflineDirectSigner {
  constructor(
    protected readonly chainId: string,
    protected readonly falcon: Falcon
  ) {}

  async getAccounts(): Promise<AccountData[]> {
    const account = await this.falcon.getAccount(this.chainId);
    return [account];
  }

  async signDirect(
    signerAddress: string,
    signDoc: SignDoc
  ): Promise<DirectSignResponse> {
    const account = await this.falcon.getAccount(this.chainId);
    if (this.chainId !== signDoc.chainId) {
      throw new Error('Chain ID does not match offline signer');
    }
    if (account.address !== signerAddress) {
      throw new Error('Signer address does not match offliner signer');
    }
    const response = await this.falcon.signDirect(
      this.chainId,
      signerAddress,
      signDoc
    );
    return response;
  }
}
