import { Content, Field, Label } from 'bloomer';
import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Web3 from 'web3';

import { Blockie } from './Blockie';

interface AccountBlockiePropTypes {
    account?: string;
    ethBalance?: string;
    selectedToken?: string;
    tokenBalance?: string;
}

class AccountBlockie extends React.Component<AccountBlockiePropTypes> {
    // tslint:disable-next-line:prefer-function-over-method member-access
    minimisedAccount(account: string): string {
        //   0xea95a7...609353b2
        const initial = account.substring(0, 6);
        const end = account.substring(account.length - 6, account.length);
        const minimised = `${initial}...${end}`;
        return minimised;
    }
    // tslint:disable-next-line:prefer-function-over-method member-access
    render() {
        if (!this.props.account) {
            return (<Content/>);
        }
        return (
            <Content>
                <Field isMarginless={true} hasAddons={'centered'}>
                    <Blockie style={{'border-radius': '50%'}} seed={this.props.account} />
                </Field>
                <Field isMarginless={true} hasAddons={'centered'}>
                    <Label style={{color: '#3636367d'}} isSize={'small'}> {this.minimisedAccount(this.props.account)} </Label>
                </Field>
                <Field isMarginless={true} hasAddons={'centered'}>
                    <Label isSize={'small'}> {this.props.ethBalance} ETH</Label>
                </Field>
                <Field isMarginless={true} hasAddons={'centered'}>
                    <Label isSize={'small'}> {this.props.tokenBalance} {this.props.selectedToken}</Label>
                </Field>
            </Content>
        );
    }
}

export { AccountBlockie };
