import {
    Button,
    Column,
    Columns,
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
        const fullWidth = {
            width: '100%',
        };
        return (
            <Dropdown isHoverable={true} style={fullWidth}>
                <DropdownTrigger style={fullWidth}>
                    <Button isOutlined={true} isFullWidth={true} aria-haspopup="true" aria-controls="dropdown-menu">
                        <span className={'icon-ZeroEx'} style={{paddingRight: '10px'}} />
                        <Label style={{ paddingTop: '5px' }} isSize={'small'}>
                            ZRX - 0x Token
                        </Label>
                        <Icon icon="angle-down" isSize="small" isPulled={'right'} style={{ marginLeft: '8px' }} />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu>
                    <DropdownContent>
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
        );
    }
}

export { TokenSelector };
