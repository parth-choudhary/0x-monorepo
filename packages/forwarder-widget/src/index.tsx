import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Web3 from 'web3';

import { AbiDecoder, BigNumber } from '@0xproject/utils';
import { Web3Wrapper } from '@0xproject/web3-wrapper';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { artifacts } from './artifacts';

import { ForwarderWrapper } from './contract_wrappers/forwarder_wrapper';

const web3Wrapper = new Web3Wrapper((window as any).web3.currentProvider);
const artifactJSONs = _.values(artifacts);
const abiArrays = _.map(artifactJSONs, artifact => artifact.networks[50].abi);
const abiDecoder = new AbiDecoder(abiArrays);

const forwarder = new ForwarderWrapper(web3Wrapper, 50, abiDecoder);

import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
registerServiceWorker();
