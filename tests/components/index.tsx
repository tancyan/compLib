import * as React from "react";
import {Row, Col} from "antd";
import "../../components/table/style/index";
import Table from "../../components/table";

export interface ITestProps {
}

export interface ITestState {

}

export default class Test extends React.Component<ITestProps, ITestState> {

    constructor(props: any) {
        super(props);
        this.state = {};

    }

    static defaultProps = {};

    render() {
        const dataSource = [{
            key: "1",
            name: "胡彦斌",
            age: 32,
            address: "西湖区湖底公园1号"
        }, {
            key: "2",
            name: "胡彦祖",
            age: 42,
            address: "西湖区湖底公园1号"
        }];

        const columns = [{
            title: "姓名",
            dataIndex: "name",
            key: "name",
        }, {
            title: "年龄",
            dataIndex: "age",
            key: "age",
        }, {
            title: "住址",
            dataIndex: "address",
            key: "address",
        }];

        return (
            <Row gutter={20}>
                <Col span={8}><Table dataSource={dataSource} columns={columns} /></Col>
            </Row>
        );
    }
}
