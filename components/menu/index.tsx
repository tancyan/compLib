import * as React from "react";

export interface ISystemMenuProps {
}

export interface ISystemMenuState {

}

/**
 * 菜单，包含左侧、顶部上下结构
 */
export default class SystemMenu extends React.Component<ISystemMenuProps, ISystemMenuState> {

    constructor(props: any) {
        super(props);
        this.state = {};

    }

    static defaultProps = {};

    render() {
         return null;
    }
}
