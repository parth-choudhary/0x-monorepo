import { SignedOrder, ZeroEx } from '0x.js';
import { InjectedWeb3Subprovider, RedundantRPCSubprovider } from '@0xproject/subproviders';
import { AbiDecoder, BigNumber } from '@0xproject/utils';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeaderTitle,
    Column,
    Columns,
    Container,
    Content,
    Control,
    Field,
    Image,
    Input,
    Label,
    Select,
    TextArea,
} from 'bloomer';
import 'bulma/css/bulma.css';
import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Web3 from 'web3';
import * as Web3ProviderEngine from 'web3-provider-engine';

import { artifacts } from '..//artifacts';
import { ForwarderWrapper } from '../contract_wrappers/forwarder_wrapper';

import { AccountBlockie } from './AccountBlockie';
import { TokenSelector } from './TokenSelector';

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
const zeroEx = new ZeroEx(web3.currentProvider, { networkId: TEST_NETWORK_ID });

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

async function fillOrder(fillAmount: BigNumber, signedOrder: SignedOrder) {
    const addresses = await web3Wrapper.getAvailableAddressesAsync();
    const msgSender = addresses[0];
    const txHash = await forwarder.fillOrderAsync(signedOrder, fillAmount, msgSender);
    const receipt = await zeroEx.awaitTransactionMinedAsync(txHash);

    // DEBUG
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

class BuyWidget extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = { amount: '1', order: undefined };

        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleOrderChange = this.handleOrderChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // tslint:disable-next-line:member-access
    handleAmountChange = (event: any) => {
        const rawValue = event.target.value;
        let value: undefined | BigNumber;
        if (!_.isUndefined(rawValue) && !_.isEmpty(rawValue)) {
            const ethValue = new BigNumber(rawValue);
            const fillAmount = ZeroEx.toBaseUnitAmount(ethValue, 18);
            value = fillAmount;
        }
        this.setState((prev, props) => {
            return { ...prev, amount: value };
        });
        event.preventDefault();
    }
    // tslint:disable-next-line:member-access
    handleOrderChange = (event: any) => {
        const rawValue = event.target.value;
        let value: undefined | string;
        if (!_.isUndefined(rawValue) && !_.isEmpty(rawValue)) {
            value = JSON.parse(rawValue);
        }
        this.setState((prev, props) => {
            return { ...prev, order: value };
        });
        event.preventDefault();
    }

    public async handleSubmit(event: any) {
        event.preventDefault();
        const signedOrder = convertPortalOrder((this.state as any).order);
        const fillAmount = (this.state as any).amount;
        await fillOrder(fillAmount, signedOrder);
    }
    // tslint:disable-next-line:prefer-function-over-method member-access
    render() {
        return (
            <Content>
                <AccountBlockie />
                <Label isSize="small">SELECT TOKEN</Label>
                <Field>
                    <TokenSelector />
                </Field>
                <Label style={{marginTop: 30}} isSize="small">BUY AMOUNT</Label>
                <Field isHorizontal={true} isGrouped={true}>
                    <Control isExpanded={true}>
                        <Input style={{width: '130px'}} type="text" placeholder="1" onChange={this.handleAmountChange.bind(this)} />
                        <Select>
                            <option>ETH</option>
                            <option>GWEI</option>
                        </Select>
                    </Control>
                </Field>
                {/* <Field>
                    <Label>ORDER</Label>
                    <Control>
                        <TextArea placeholder={''} onChange={this.handleOrderChange.bind(this)} />
                    </Control>
                </Field> */}
                {/* <Field>
                    <strong> ESTIMATED COST </strong>
                </Field> */}
                <Field style={{marginTop: 20}}>
                    <Button style={{width: '220px' }} isColor="info" onClick={this.handleSubmit}>
                        SUBMIT ORDER
                    </Button>
                </Field>
                <Field style={{marginTop: 20}} isGrouped={'centered'}>
                    <img style={{ marginLeft: '0px', height: '20px'}} src="/images/powered.png" />
                </Field>
            </Content>
        );
    }
}

// tslint:disable-next-line:no-default-export
export { BuyWidget };
