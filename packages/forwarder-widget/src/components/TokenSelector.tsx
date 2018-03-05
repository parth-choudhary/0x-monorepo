import {
    Button,
    Column,
    Columns,
    Content,
    Control,
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
    Select,
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
                    <Field>
                        <Control hasIcons={['left', 'right']}>
                            <Button className={'select is-fullwidth'}>
                                <Label style={{ paddingTop: '5px' }} isSize={'small'}>
                                    ZRX - 0x Token
                                </Label>
                                <span className={'icon-ZeroEx is-left icon'} />
                            </Button>
                        </Control>
                    </Field>
                </DropdownTrigger>
                <DropdownMenu>
                    <DropdownContent>
                        <DropdownItem onClick={this.handleItemSelected} href="#">
                            <Field hasAddons={true} style={fullWidth}>
                                <span className="icon-BAT_icon is-left icon">
                                    <span className="path1" />
                                    <span className="path2" />
                                    <span className="path3" />
                                    <span className="path4" />
                                    <span className="path5" />
                                </span>
                                <Control isExpanded={true} hasIcons={'left'}>
                                    <Label style={{ paddingLeft: '5px', paddingTop: '5px' }} isSize={'small'}>
                                        BAT - Basic Attention Token
                                    </Label>
                                </Control>
                            </Field>
                        </DropdownItem>
                        <DropdownItem onClick={this.handleItemSelected} href="#">
                            <Field hasAddons={true}>
                                <span className={'icon-ZeroEx is-left icon'} />
                                <Control hasIcons={'left'}>
                                    <Label style={{ paddingLeft: '5px', paddingTop: '5px' }} isSize={'small'}>
                                        ZRX - 0x Token
                                    </Label>
                                </Control>
                            </Field>
                        </DropdownItem>
                    </DropdownContent>
                </DropdownMenu>
            </Dropdown>
        );
    }
}

export { TokenSelector };
