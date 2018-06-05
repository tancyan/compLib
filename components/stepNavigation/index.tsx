import * as React from "react";

export interface IStepNavigationProps {
}

export interface IStepNavigationState {

}

/**
 * 带step的导航
 * 用例 分班云计算、排课系统 需要按step完成，才能点击下一步，激活下一步菜单
 */
export default class StepNavigation extends React.Component<IStepNavigationProps, IStepNavigationState> {

    constructor(props: any) {
        super(props);
        this.state = {};

    }

    static defaultProps = {};

    render() {
         return null;
    }
}
