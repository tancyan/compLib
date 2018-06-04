import * as React from "react";
import { CardProps } from "antd/lib/card";
import {Card} from "antd";
export interface IRegularCardProps extends CardProps {
}

export interface IRegularCardState {

}

/**
 * 卡片默认样式
 */
export default class RegularCard extends React.Component<IRegularCardProps, IRegularCardState> {

    constructor(props: any) {
        super(props);
        this.state = {};

    }

    static defaultProps = {};

    render() {
        return <Card {... this.props} />;
    }
}
