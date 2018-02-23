import { AbiDecoder, BigNumber } from '@0xproject/utils';
import { Web3Wrapper } from '@0xproject/web3-wrapper';

import { artifacts } from '../artifacts';

import { ContractWrapper } from './contract_wrapper';
import { ForwarderContract } from './generated/forwarder';

export class ForwarderWrapper extends ContractWrapper {
    constructor(web3Wrapper: Web3Wrapper, networkId: number, abiDecoder: AbiDecoder) {
        super(web3Wrapper, networkId, abiDecoder);
        // tslint:disable-next-line
        console.log(this._getForwarderContractAsync());
    }

    private async _getForwarderContractAsync(): Promise<ForwarderContract> {
        const web3ContractInstance = await this._instantiateContractIfExistsAsync(artifacts.Forwarder);
        const contractInstance = new ForwarderContract(web3ContractInstance, this._web3Wrapper.getContractDefaults());

        return contractInstance;
    }
}
