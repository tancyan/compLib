import * as React from "react";
import {Link} from "react-router";

import {Menu} from "antd";
const SubMenu = Menu.SubMenu;
const Item = Menu.Item;

export interface ISystemMenuProps {
}

export interface ISystemMenuState {

}
const menuConfig = [
    {
        name: "分班统计分析",
        id: "1",
        icon: "",
        type: "branch",
        childMenus: [
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
];
/**
 * 菜单，包含左侧、顶部上下结构
 */
export default class SystemMenu extends React.Component<ISystemMenuProps, ISystemMenuState> {

    constructor(props: any) {
        super(props);
        this.state = {};

    }

    static defaultProps = {};

    getMenu = () => {
        const {menus, menuInfo, mode} = this.props;

        let i;
        const l = menus && menus.length || 0;
        const items = [];
        const menuInfos = menuInfo.toJS();

        const renderItem = ( menuItem: any ) => {
            const { type, url, id, name, childMenus, icon } = menuItem;

            if ( type === "branch" ) {
                let j;
                const l2 = childMenus && childMenus.length || 0;
                const items2 = [];

                for ( j = 0; j < l2; j++  ) {
                    items2.push( renderItem(childMenus[j]) );
                }
                return <SubMenu key={id} title={<span><img className = "menuItem" src= {icon} alt="" /><span>{name}</span></span>} children={items2} />;
            } else {
                return (
                    <Item key={id}>
                        <Link to={url}>
                            <span className="dot" />
                            <span className="second-title">{name}</span>
                        </Link>
                    </Item>
                );
            }
        };

        for ( i = 0; i < l; i++ ) {
            items.push( renderItem(menus[i]) );
        }

        return l ? (
            <Menu {...{mode}} onClick={this.menuItemClick} onOpenChange={this.menuClick}  {...menuInfos}>
                {items}
            </Menu>
        ) : "";
    }

    render() {
        return null;
    }
}
