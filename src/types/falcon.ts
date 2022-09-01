import { AminoSignResponse, StdSignDoc } from '@cosmjs/amino';
import {
  AccountData,
  DirectSignResponse,
  OfflineSigner,
} from '@cosmjs/proto-signing';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

export type FalconAccount = AccountData & {
  name: string;
  bech32Address: string;
  isHardware: boolean;
};

export interface BaseFalcon {
  connect(): Promise<void>;
  getAccount(chainId: string): Promise<AccountData>;
  getKey(chainId: string): Promise<FalconAccount>;
  signDirect(
    chainId: string,
    signer: string,
    signDoc: SignDoc
  ): Promise<DirectSignResponse>;
  signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc
  ): Promise<AminoSignResponse>;
  getOfflineSigner(chainId: string): OfflineSigner;
  getOfflineAminoSigner(chainId: string): OfflineSigner;
  getOfflineSignerAuto(chainId: string): Promise<OfflineSigner>;
  importZone(config: unknown): Promise<void>;
}

// Extends BaseFalcon with functions to match other wallet injections
export interface Falcon extends BaseFalcon {
  // Keplr
  enable(): Promise<void>;
  getOfflineSignerOnlyAmino(chainId: string): OfflineSigner;
  experimentalSuggestChain(config: unknown): Promise<void>;
  mode: string;
}
