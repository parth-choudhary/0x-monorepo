import * as Web3 from 'web3';
import ProviderEngine = require('web3-provider-engine');
import RpcSubprovider = require('web3-provider-engine/subproviders/rpc');

import { CoverageSubprovider } from './coverage_subprovider';

export class CoverageProvider {
    private _provider: any; // We don't have Porvider Engine types yet
    private _coverageSubprovider: CoverageSubprovider;
    constructor(
        artifactsPath: string,
        contractsPath: string,
        networkId: number,
        defaultFromAddress: string,
        rpcUrl: string,
    ) {
        this._coverageSubprovider = new CoverageSubprovider(
            artifactsPath,
            contractsPath,
            networkId,
            defaultFromAddress,
        );
        this._provider = new ProviderEngine();
        this._provider.addProvider(this._coverageSubprovider);
        this._provider.addProvider(new RpcSubprovider({ rpcUrl }));
        this._provider.start();
    }
    public sendAsync(
        payload: Web3.JSONRPCRequestPayload,
        callback: (err: Error, result: Web3.JSONRPCResponsePayload) => void,
    ): void {
        this._provider.sendAsync(payload, callback);
    }
    public async writeCoverageAsync(): Promise<void> {
        await this._coverageSubprovider.writeCoverageAsync();
    }
}
