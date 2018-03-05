import {
    Button,
    Content,
    Dropdown,
    DropdownContent,
    DropdownDivider,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Icon,
    Image,
} from 'bloomer';
import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

class TokenSelectorItem extends React.Component {
    constructor(props: any) {
        super(props);
    }

    // tslint:disable-next-line:prefer-function-over-method member-access
    render() {
        return (
            <DropdownItem onClick={(this.props as any).handleItemSelected} href="#">
                <span>
                    <span className="icon-BAT_icon">
                        <span className="path1" />
                        <span className="path2" />
                        <span className="path3" />
                        <span className="path4" />
                        <span className="path5" />
                    </span>
                    {'  '}
                    BAT
                </span>
            </DropdownItem>
        );
    }
}

export { TokenSelectorItem };
