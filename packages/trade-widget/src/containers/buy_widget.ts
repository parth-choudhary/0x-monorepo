import { SignedOrder, ZeroEx } from '0x.js';
import { BigNumber } from '@0xproject/utils';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { connect } from 'react-redux';

import * as BuyWidgetComponent from '../components/BuyWidget';
import { Dispatcher } from '../redux/dispatcher';
import { State } from '../redux/reducer';
import { AccountTokenBalances, AccountWeiBalances, AssetToken, QuoteRequest, TokenBalances } from '../types';

interface ConnectedState {
    networkId: number;
    address: string;
    selectedToken: AssetToken;
    tokenBalances: AccountTokenBalances;
    weiBalances: AccountWeiBalances;
}

interface BuyWidgetProps {
    zeroEx: ZeroEx;
    web3Wrapper: Web3Wrapper;
    dispatcher: Dispatcher;
    requestQuote: QuoteRequest;
}

const mapStateToProps = (state: State, ownProps: BuyWidgetProps): ConnectedState => ({
    networkId: state.networkId,
    address: state.userAddress,
    weiBalances: state.usersWeiBalance,
    tokenBalances: state.userTokenBalances,
    selectedToken: state.selectedToken,
});

export const BuyWidget: React.ComponentClass<BuyWidgetProps> = connect(mapStateToProps)(BuyWidgetComponent.default);
