import * as React from "react";
import {Link} from "react-router";

import {Menu} from "antd";
const SubMenu = Menu.SubMenu;
const Item = Menu.Item;
import {Util} from "../util/index";
import {RegMenu} from "../../typings/regMenu";
import IMenu = RegMenu.IMenu;
import IMenuInfo = RegMenu.IMenuInfo;
import MenuUtil from "../menuUtil/index";

export interface ISystemMenuProps {
    menus: IMenu[]; // 菜单列表
    menuInfo: IMenuInfo; // 当前菜单状态 {openKeys,selectedKeys}
    mode?: "vertical" | "horizontal" | "inline";
    menuClick?: (menuInfo: IMenuInfo, url?: string) => void; // 菜单点击事件
}

export interface ISystemMenuState {

}

/**
 * 菜单，包含左侧、顶部上下结构
 */
export default class SystemMenu extends React.Component<ISystemMenuProps, ISystemMenuState> {

    constructor(props: any) {
        super(props);
        this.state = {};

    }

    static defaultProps = {};

    // SubMenu 展开/关闭的回调
    menuClick = (keysArr: any[]) => {

        const openKey = keysArr.pop();
        if ( !openKey) {
            return;
        }
        const {menus, menuClick} = this.props;
        const firstItem = menus.find(item => item.id === openKey);
        const secondItem = firstItem.subMenus && firstItem.subMenus[0];
        const {id: selectedKey} = secondItem;
        const menuInfo = {openKeys: [openKey], selectedKeys: [selectedKey]} as IMenuInfo;
        if (menuClick !== undefined) {
            menuClick(menuInfo, secondItem.url);
        }
       // router.push({pathname: secondItem.url});
       // actions.changeMenu(menuInfo);
    }

    // 点击 MenuItem 调用此函数
    menuItemClick = (e: any) => {
        const {keyPath} = e;
        let [selectedKeys, openKeys] = keyPath;
        openKeys = [openKeys];
        selectedKeys = [selectedKeys];
        const menuInfo = {openKeys, selectedKeys} as IMenuInfo;
        const {menuClick} = this.props;
        if (menuClick !== undefined) {
            menuClick(menuInfo);
        }
        // this.props.actions.changeMenu(menuInfo);
    }
    getMenu = () => {
        const {menus, menuInfo, mode} = this.props;

        let i;
        const l = menus && menus.length || 0;
        const items = [];

        const renderItem = ( menuItem: any ) => {
            const { type, url, id, name, subMenus, icon } = menuItem;

            if ( type === "branch" ) {
                let j;
                const l2 = subMenus && subMenus.length || 0;
                const items2 = [];

                for ( j = 0; j < l2; j++  ) {
                    items2.push( renderItem(subMenus[j]) );
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
            <Menu {...{mode}} onClick={this.menuItemClick} onOpenChange={this.menuClick}  {...menuInfo}>
                {items}
            </Menu>
        ) : "";
    }

    componentWillMount() {
        this.init(this.props);
    }

    componentWillReceiveProps(newProps) {
        const util = new Util();
        if (!util.deepEq(this.props, newProps)) {
            this.init(newProps);
        }
    }

    init = (props: ISystemMenuProps) => {
        MenuUtil.getInstance().setMenus(props.menus); // 菜单初始化
    }

    render() {
        return  <div className="menu-wrap">{this.getMenu()}</div>;
    }
}
