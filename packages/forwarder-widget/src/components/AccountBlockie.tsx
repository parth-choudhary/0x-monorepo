import { Content, Field, Label } from 'bloomer';
import * as React from 'react';
import Blockies from 'react-blockies';
import * as ReactDOM from 'react-dom';
import * as Web3 from 'web3';

import { Blockie } from './Blockie';
class AccountBlockie extends React.Component {
    // tslint:disable-next-line:prefer-function-over-method member-access
    render() {
        return (
            <Content>
                <Field isMarginless={true} hasAddons={'centered'}>
                    <Blockie style={{'border-radius': '50%'}} seed="0x trade widget" />
                </Field>
                <Field isMarginless={true} hasAddons={'centered'}>
                    <Label style={{color: '#3636367d'}} isSize={'small'}> 0xea95a7...609353b2 </Label>
                </Field>
                <Field isMarginless={true} hasAddons={'centered'}>
                    <Label isSize={'small'}> Balance: 5.12 ETH </Label>
                </Field>
            </Content>
        );
    }
}

export { AccountBlockie };
