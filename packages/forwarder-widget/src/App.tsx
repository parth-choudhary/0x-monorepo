import { SignedOrder, ZeroEx } from '0x.js';
import { InjectedWeb3Subprovider, RedundantRPCSubprovider } from '@0xproject/subproviders';
import { AbiDecoder, BigNumber } from '@0xproject/utils';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Web3 from 'web3';
import * as Web3ProviderEngine from 'web3-provider-engine';

import { artifacts } from './artifacts';
import { ForwarderWrapper } from './contract_wrappers/forwarder_wrapper';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const TEST_NETWORK_ID = 50;
const TEST_RPC = 'http://127.0.0.1:8545';

const providerEngine = new Web3ProviderEngine();
providerEngine.addProvider(new InjectedWeb3Subprovider((window as any).web3.currentProvider));
providerEngine.addProvider(new RedundantRPCSubprovider([TEST_RPC]));
providerEngine.start();

const web3 = new Web3(providerEngine);
const web3Wrapper = new Web3Wrapper(web3.currentProvider);

const artifactJSONs = _.values(artifacts);
const abiArrays = _.map(artifactJSONs, artifact => artifact.networks[50].abi);
const abiDecoder = new AbiDecoder(abiArrays);

const forwarder = new ForwarderWrapper(web3Wrapper, TEST_NETWORK_ID, abiDecoder);
function convertPortalOrder(json: any): SignedOrder {
    const rawSignedOrder = json.signedOrder;
    rawSignedOrder.makerFee = new BigNumber(rawSignedOrder.makerFee);
    rawSignedOrder.takerFee = new BigNumber(rawSignedOrder.takerFee);
    rawSignedOrder.makerTokenAmount = new BigNumber(rawSignedOrder.makerTokenAmount);
    rawSignedOrder.takerTokenAmount = new BigNumber(rawSignedOrder.takerTokenAmount);
    rawSignedOrder.expirationUnixTimestampSec = new BigNumber(rawSignedOrder.expirationUnixTimestampSec);
    rawSignedOrder.salt = new BigNumber(rawSignedOrder.salt);
    return rawSignedOrder;
}
const portalOrder = {
    signedOrder: {
        maker: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
        taker: '0x0000000000000000000000000000000000000000',
        makerFee: '0',
        takerFee: '0',
        makerTokenAmount: '10000000000000000000000',
        takerTokenAmount: '100000000000000000000',
        makerTokenAddress: '0x1d7022f5b17d2f8b695918fb48fa1089c9f85401',
        takerTokenAddress: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
        expirationUnixTimestampSec: '1540526400',
        feeRecipient: '0x0000000000000000000000000000000000000000',
        salt: '23433586706610925175853369729596048196456691624026467508430363568280503696203',
        ecSignature: {
            v: 27,
            r: '0x270b339c817b8459e62738f56b8a42af136c46fe79b9564f9ff6c642a94ea552',
            s: '0x3695efb6bf5c88243865c3a6f35a3e2f6e26723c8da905c520ccc29fa23e2353',
        },
        exchangeContractAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
    },
    metadata: {
        makerToken: {
            name: '0x Protocol Token',
            symbol: 'ZRX',
            decimals: 18,
        },
        takerToken: {
            name: 'Ether Token',
            symbol: 'WETH',
            decimals: 18,
        },
    },
};
async function fillOrder() {
    const addresses = await web3Wrapper.getAvailableAddressesAsync();
    const fillAmount = ZeroEx.toBaseUnitAmount(new BigNumber(1), 18);
    const signedOrder = convertPortalOrder(portalOrder);
    const msgSender = addresses[0];
    const txHash = await forwarder.fillOrderAsync(signedOrder, fillAmount, msgSender);
    const zeroEx = new ZeroEx(web3.currentProvider, { networkId: TEST_NETWORK_ID });
    const receipt = await zeroEx.awaitTransactionMinedAsync(txHash);
    const forwarderAddress = await forwarder.getForwarderContractAddressAsync();
    const orderHash = ZeroEx.getOrderHashHex(signedOrder);
    const unavailableAmount = await zeroEx.exchange.getUnavailableTakerAmountAsync(orderHash);
    const forwarderEthBlanace = await web3Wrapper.getBalanceInWeiAsync(forwarderAddress);
    // tslint:disable:no-console
    console.log(txHash);
    console.log(receipt.status, receipt.logs);
    console.log('unavailableAmount', unavailableAmount.toString());
    console.log('balance of maker', signedOrder.maker);
    console.log(
        'maker tokens: ',
        (await zeroEx.token.getBalanceAsync(signedOrder.makerTokenAddress, signedOrder.maker)).toString(),
    );
    console.log(
        'taker tokens: ',
        (await zeroEx.token.getBalanceAsync(signedOrder.takerTokenAddress, signedOrder.maker)).toString(),
    );
    console.log(
        'allowance maker tokens:',
        (await zeroEx.token.getProxyAllowanceAsync(signedOrder.makerTokenAddress, signedOrder.maker)).toString(),
    );
    console.log(
        'allowance taker tokens:',
        (await zeroEx.token.getProxyAllowanceAsync(signedOrder.takerTokenAddress, signedOrder.maker)).toString(),
    );
    console.log('balance of taker', msgSender);
    console.log(
        'maker tokens: ',
        (await zeroEx.token.getBalanceAsync(signedOrder.makerTokenAddress, msgSender)).toString(),
    );
    console.log(
        'taker tokens: ',
        (await zeroEx.token.getBalanceAsync(signedOrder.takerTokenAddress, msgSender)).toString(),
    );
    console.log(
        'allowance maker tokens:',
        (await zeroEx.token.getProxyAllowanceAsync(signedOrder.makerTokenAddress, msgSender)).toString(),
    );
    console.log(
        'allowance taker tokens:',
        (await zeroEx.token.getProxyAllowanceAsync(signedOrder.takerTokenAddress, msgSender)).toString(),
    );
    console.log('balance of forwarder', forwarderAddress);
    console.log(
        'maker tokens: ',
        (await zeroEx.token.getBalanceAsync(signedOrder.makerTokenAddress, forwarderAddress)).toString(),
    );
    console.log(
        'taker tokens: ',
        (await zeroEx.token.getBalanceAsync(signedOrder.takerTokenAddress, forwarderAddress)).toString(),
    );
    console.log('eth: ', forwarderEthBlanace.toString());
    console.log(
        'allowance maker tokens:',
        (await zeroEx.token.getProxyAllowanceAsync(signedOrder.makerTokenAddress, forwarderAddress)).toString(),
    );
    console.log(
        'allowance taker tokens:',
        (await zeroEx.token.getProxyAllowanceAsync(signedOrder.takerTokenAddress, forwarderAddress)).toString(),
    );
}

import './App.css';

class App extends React.Component {
    // tslint:disable-next-line:prefer-function-over-method member-access
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">0x Forwarding Contract</h1>
                </header>
                <p className="App-intro">
                    <button onClick={fillOrder}>Buy!</button>
                </p>
            </div>
        );
    }
}

// tslint:disable-next-line:no-default-export
export default App;
