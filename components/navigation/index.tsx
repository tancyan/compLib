import * as React from "react";

export interface INavigationProps {
}

export interface INavigationState {

}

/**
 * 系统导航
 * 系统名称 + 系统logo + 系统navigation
 */
export default class Navigation extends React.Component<INavigationProps, INavigationState> {

    constructor(props: any) {
        super(props);
        this.state = {};

    }

    static defaultProps = {};

    render() {
         return null;
    }
}
