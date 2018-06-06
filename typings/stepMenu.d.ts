
import {RegMenu} from "./regMenu";
import menuType = RegMenu.menuType;
declare namespace StepMenu {
    interface IMenuNode {
        menuID: string;
        subMenuInfo?: IMenuNode;
    }

    interface IMenuInfo {
        activeMenuInfo?: IMenuNode; // progress指向的菜单信息 instance走到最大步骤的菜单
        curMenuInfo?: IMenuNode; // 当前路由所在的菜单信息
    }

    interface IMenu {
        id: string; // 菜单ID
        name: React.ReactNode; // 菜单名字
        progressName: string; // 显示在progress的名字，默认与name一致，以防像排课系统一样，如 name:查看课表 progressName:总课程表
        icon?: string; // 菜单icon img url
        type: menuType; // 菜单类型 branch:父节点有子节点 leaf:是子节点
        subMenus?: IMenu[]; // 子菜单列表
        url?: string; // 跳转路由 type=leaf的才需要路由跳转
        step?: number; // 可不传，通过index推导出来 菜单所在step
        parentMenuID?: string; // 可不传，可推导出来 当前菜单主菜单ID
        subMenuStepByStep: boolean; // 子菜单是否需要一步一步去激活
        showStep: boolean; // 是否在菜单displayName上显示step，如 1框架设置
        displaySubMenu: boolean; // 是否显示子菜单 默认显示
        menuClsName: string; // 菜单的特殊类
    }
}
