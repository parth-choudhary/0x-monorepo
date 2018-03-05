import {
    Button,
    Content,
    Dropdown,
    DropdownContent,
    DropdownDivider,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Field,
    Icon,
    Image,
    Label,
} from 'bloomer';
import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { TokenSelectorItem } from './TokenSelectorItem';

class TokenSelector extends React.Component {
    private _tokens: any[];
    constructor(props: any) {
        super(props);
        this.state = { active: false };
        this.handleItemSelected = this.handleItemSelected.bind(this);
        this._tokens = [];
    }

    public handleItemSelected(event: any) {
        // tslint:disable-next-line:no-console
        console.log(event.target);
        this.setState((prev, props) => {
            return { ...prev, active: false };
        });
    }

    // tslint:disable-next-line:prefer-function-over-method member-access
    render() {
        const divStyle = {
            // padding: '20px',
            marginLeft: '8px',
        };
        return (
                <Field>
                    <Dropdown isHoverable={true}>
                        <DropdownTrigger>
                            <Button style={{width: '220px' }} isOutlined={true} aria-haspopup="true" aria-controls="dropdown-menu">
                                <span className={'icon-ZeroEx'} />
                                <Label isSize={'small'}>
                                <div style={divStyle}>
                                    ZRX - 0x Token
                                    <Icon icon="angle-down" isSize="small" style={divStyle}/>
                                </div>
                                </Label>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownContent style={{width: '220px'}}>
                                <DropdownItem onClick={this.handleItemSelected} href="#">
                                    <span>
                                        <span className="icon-BAT_icon">
                                            <span className="path1" />
                                            <span className="path2" />
                                            <span className="path3" />
                                            <span className="path4" />
                                            <span className="path5" />
                                        </span>
                                        {'  '}
                                        <strong>BAT</strong> - Basic Attention Token
                                    </span>
                                </DropdownItem>
                                <DropdownItem onClick={this.handleItemSelected} href="#" isActive={true}>
                                    <span>
                                        <span className={'icon-ZeroEx'} />
                                        {'  '}
                                        <strong>ZRX</strong> - 0x Token
                                    </span>
                                </DropdownItem>
                            </DropdownContent>
                        </DropdownMenu>
                    </Dropdown>
                </Field>
        );
    }
}

export { TokenSelector };
