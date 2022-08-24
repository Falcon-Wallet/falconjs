import { AminoSignResponse, StdSignDoc } from '@cosmjs/amino';
import {
  AccountData,
  DirectSignResponse,
  OfflineSigner,
} from '@cosmjs/proto-signing';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

export type FalconAccount = AccountData & {
  name: string;
  isHardware: boolean;
};

export interface Falcon {
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
