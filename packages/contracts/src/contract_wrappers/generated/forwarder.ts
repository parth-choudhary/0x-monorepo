/**
 * This file is auto-generated using abi-gen. Don't edit directly.
 * Templates can be found at https://github.com/0xProject/0x.js/tree/development/packages/abi-gen-templates.
 */
// tslint:disable:async-suffix member-ordering no-consecutive-blank-lines
// tslint:disable-next-line:no-unused-variable
import { TxData, TxDataPayable } from '@0xproject/types';
import { BigNumber, classUtils, promisify } from '@0xproject/utils';
import * as Web3 from 'web3';

import {BaseContract} from './base_contract';

export class ForwarderContract extends BaseContract {
    public initialize = {
        async sendTransactionAsync(
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ForwarderContract;
            const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(txData);
            const txHash = await self._web3ContractInstance.initialize(
                txDataWithDefaults,
            );
            return txHash;
        },
        async callAsync(
            txData: TxData = {},
        ): Promise<void
    > {
            const self = this as ForwarderContract;
            const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(txData);
            const returnValue = await self._web3ContractInstance.initialize.call(
                txDataWithDefaults,
            );
            return returnValue;
        },
    };
    public fillOrder = {
        async sendTransactionAsync(
            orderAddresses: string[],
            orderValues: BigNumber[],
            v: number|BigNumber,
            r: string,
            s: string,
            txData: TxDataPayable = {},
        ): Promise<string> {
            const self = this as ForwarderContract;
            const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(txData);
            const txHash = await self._web3ContractInstance.fillOrder(
                orderAddresses,
                orderValues,
                v,
                r,
                s,
                txDataWithDefaults,
            );
            return txHash;
        },
        async callAsync(
            orderAddresses: string[],
            orderValues: BigNumber[],
            v: number|BigNumber,
            r: string,
            s: string,
            txData: TxDataPayable = {},
        ): Promise<void
    > {
            const self = this as ForwarderContract;
            const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(txData);
            const returnValue = await self._web3ContractInstance.fillOrder.call(
                orderAddresses,
                orderValues,
                v,
                r,
                s,
                txDataWithDefaults,
            );
            return returnValue;
        },
    };
    constructor(web3ContractInstance: Web3.ContractInstance, defaults?: Partial<TxData>) {
        super(web3ContractInstance, defaults);
        classUtils.bindAll(this, ['_web3ContractInstance', '_defaults']);
    }
} // tslint:disable:max-file-line-count
