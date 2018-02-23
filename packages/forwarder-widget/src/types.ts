import * as Web3 from 'web3';

export type ArtifactContractName = 'ZRX' | 'TokenTransferProxy' | 'TokenRegistry' | 'Token' | 'Exchange' | 'EtherToken';

export interface Artifact {
    contract_name: ArtifactContractName;
    abi: Web3.ContractAbi;
    networks: {
        [networkId: number]: {
            address: string;
        };
    };
}
