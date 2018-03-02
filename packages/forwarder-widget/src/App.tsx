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
providerEngine.addProvider(new RedundantRPCSubprovider(['http://127.0.0.1:8545', 'http://localhost:8545']));
providerEngine.start();

const web3 = new Web3(providerEngine);
const web3Wrapper = new Web3Wrapper(web3.currentProvider);

const artifactJSONs = _.values(artifacts);
const abiArrays = _.map(artifactJSONs, artifact => artifact.networks[50].abi);
const abiDecoder = new AbiDecoder(abiArrays);

const forwarder = new ForwarderWrapper(web3Wrapper, TEST_NETWORK_ID, abiDecoder);
const portalOrder = {
    signedOrder: {
        maker: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
        taker: '0x0000000000000000000000000000000000000000',
        makerFee: new BigNumber('0'),
        takerFee: new BigNumber('0'),
        makerTokenAmount: new BigNumber('10000000000000000000'),
        takerTokenAmount: new BigNumber('10000000000000000000'),
        makerTokenAddress: '0x1d7022f5b17d2f8b695918fb48fa1089c9f85401',
        takerTokenAddress: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
        expirationUnixTimestampSec: new BigNumber('2524626000'),
        feeRecipient: '0x0000000000000000000000000000000000000000',
        salt: new BigNumber('71886430203710850866337815888072658913407492763827374884110341019669344324912'),
        ecSignature: {
            v: 28,
            r: '0x877e9694595fe4a8fac0c5bbfcc65b4ec38ffe338a0f47d52ce875a532e6ffbc',
            s: '0x2d56099f38c96d8bb8862d7d33358d9c97086dced98657a05e7937cc23ba8d89',
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
    const txHash = await forwarder.fillOrderAsync(portalOrder.signedOrder, new BigNumber(1), addresses[0]);
    // tslint:disable-next-line:no-console
    console.log(txHash);
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
          <button onClick={fillOrder} >Buy!</button>
        </p>
      </div>
    );
  }
}

// tslint:disable-next-line:no-default-export
export default App;
