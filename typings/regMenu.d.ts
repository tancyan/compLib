import * as React from "react";
declare namespace RegMenu {
    // 菜单类型 branch:父节点有子节点 leaf:是子节点
    type menuType = "branch" | "leaf";
    // menu 节点
    interface IMenuInfo { // active menuInfo
        openKeys: string[];
        selectedKeys: string[];
    }
    // menu config
    interface IMenu {
        id: string;
        name: React.ReactNode;
        icon?: string; // 菜单icon img url
        type: menuType;
        subMenus?: IMenu[];
        url?: string; // 跳转路由
    }
}
