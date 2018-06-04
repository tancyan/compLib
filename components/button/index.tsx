import * as React from "react";
import {Button} from "antd";
import {ButtonProps} from "antd/lib/button/Button";
import classNames from "classnames";
export declare type btnHeightSize = "xxl" | "lg" | "sm" | "xs"; // 54px 40px 30px 28px

export interface IBtnProps extends ButtonProps {
    heightSize?: btnHeightSize;
}

export interface IBtnState {

}

/**
 * button
 * 新增btn高度属性
 */
export default class Btn extends React.Component<IBtnProps, IBtnState> {

    constructor(props: any) {
        super(props);
        this.state = {};

    }

    static defaultProps = {};

    render() {
        const {heightSize} = this.props;
        let {className} = this.props;
        if (heightSize) {
           className = classNames({
               [className]: !!className,
               [`btn-${heightSize}`]: !!heightSize
           });
        }
        return <Button {...this.props} className={className} />;
    }
}
