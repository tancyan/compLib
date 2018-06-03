import * as React from "react";
import {Table} from "antd";
import { TableProps } from "antd/lib/table/Table";
import classNames from "classnames";

export interface INormalTableProps extends TableProps<any> {
}

export interface INormalTableState {

}

export default class NormalTable extends React.Component<INormalTableProps, INormalTableState> {

    constructor(props: any) {
        super(props);
        this.state = {};

    }

    static defaultProps = {};

    render() {
        const {dataSource = [], className = ""} = this.props;
        let {pagination} = this.props;
        const tableCls = classNames({
            [className]: !!className,
            "default-table": true
        });
        pagination = pagination || {showSizeChanger: true, pageSize: 10, total: dataSource.length, showTotal: (num: number) => `共${num}条`};
        return <Table  {...this.props} className={tableCls} pagination={pagination} />;
    }
}
