import * as React from "react";
import {Table} from "antd";

export interface INormalTableProps {
    dataSource?: any[];
    columns: any[];

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
        const {dataSource, columns} = this.props;
        return <Table
            dataSource = {dataSource}
            columns = {columns}
            pagination = {{pageSize: 10, total: dataSource.length, showTotal: (num: number) => `共${num}条`}} />;
    }
}
