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
    Input,
    Label,
    TextArea,
} from 'bloomer';
import 'bulma/css/bulma.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';

import { BuyWidget } from './components/BuyWidget';
import registerServiceWorker from './registerServiceWorker';

import './App.css';

class App extends React.Component {
    // tslint:disable-next-line:prefer-function-over-method member-access
    render() {
        return (
            <Container style={{ marginTop: 20, marginLeft: 20 }}>
                <Columns>
                    <Column isSize={{ mobile: 8, default: '1/3' }}>
                        <Columns>
                            <Column isSize={{ mobile: 8, default: '2/3' }}>
                                <Card>
                                    <CardHeaderTitle>
                                        <Label isSize={'small'}>0x TRADE WIDGET</Label>
                                    </CardHeaderTitle>
                                    <CardContent>
                                        <BuyWidget />
                                    </CardContent>
                                </Card>
                            </Column>
                        </Columns>
                    </Column>
                    <Column isSize={{ mobile: 8 }}>
                        <pre>
                            <code>1. Paste in a X/WETH 0x order from Portal</code>
                        </pre>
                        <pre>
                            <code>2. Fill in the amount you want to take in ETH</code>
                        </pre>
                        <pre>
                            <code>3. Order is filled, no allowances needed!</code>
                        </pre>
                    </Column>
                </Columns>
            </Container>
        );
    }
}

// tslint:disable-next-line:no-default-export
export default App;
