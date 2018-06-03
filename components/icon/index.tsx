import * as React from "react";

export interface IIconExtendProps {
}

export interface IIconExtendState {

}

/**
 * icon 默认显示anticon，不存在的icon可以选择在 http://iconfont.cn/collections/index?type=3 进行扩展
 */
export default class IconExtend extends React.Component<IIconExtendProps, IIconExtendState> {

    constructor(props: any) {
        super(props);
        this.state = {};

    }

    static defaultProps = {};

    render() {
         return null;
    }
}
