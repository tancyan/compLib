import * as React from "react";
import {Row, Col} from "antd";
import "../../components/table/style/index";
import Table from "../../components/table";

import "../../components/card/style/index";
import Card from "../../components/card";

import "../../components/button/style/index";
import Button from "../../components/button";

import "../../components/menu/style/index";
import Menu from "../../components/menu";
import {RegMenu} from "../../typings/regMenu";
import IMenu = RegMenu.IMenu;

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

        const menuConfig = [
            {
                id: "1",
                name: "分班统计分析",
                icon: "",
                type: "branch",
                subMenus: [
                    {
                        name: "行政班班级数据",
                        id: "1_1",
                        type: "leaf",
                        url: ""
                    },
                    {
                        name: "教学班班级数据",
                        id: "1_2",
                        type: "leaf",
                        url: ""
                    }
                ]
            }
        ] as IMenu[];

        return (
            <div>
                <Row gutter={20}>
                    <Col span={8}><Table dataSource={dataSource} columns={columns} /></Col>
                    <Col span={8}>
                        <Card title="Card title">
                            <p>Card content</p>
                            <p>Card content</p>
                            <p>Card content</p>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Button heightSize={"xxl"}>xxl</Button>
                        <Button heightSize={"lg"}>lg</Button>
                        <Button heightSize={"sm"}>sm</Button>
                        <Button heightSize={"xs"}>xs</Button>
                    </Col>
                </Row>
                <Row gutter={20}>
                    <Col span={8}><Menu menus={menuConfig} mode={"inline"} menuInfo={{openKeys: ["1"], selectedKeys: ["1_1"]}} /></Col>
                </Row>
            </div>
        );
    }
}
