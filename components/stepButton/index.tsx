import * as React from "react";

export interface IStepButtonProps {
}

export interface IStepButtonState {

}

/**
 * 带step页面的会经常涵盖一些 上一步 下一步的处理
 */
export default class StepButton extends React.Component<IStepButtonProps, IStepButtonState> {

    constructor(props: any) {
        super(props);
        this.state = {};

    }

    static defaultProps = {};

    render() {
         return null;
    }
}
