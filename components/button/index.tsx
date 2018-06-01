import * as React from "react";
import {Button} from "antd";
import { ButtonProps } from "antd/lib/button/button";

export interface IHButtonProps extends ButtonProps {
}

export interface IHButtonState {

}

export default class HButton extends React.Component<IHButtonProps, IHButtonState> {

    constructor(props: any) {
        super(props);
        this.state = {};

    }

    static defaultProps = {};

    render() {
        const {} = this.props;

        return <Button {...this.props} />;
    }
}
