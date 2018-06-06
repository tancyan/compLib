
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
        menus: IMainMenu[];
    }

    interface IMainMenu {
        menuID: string; // 一级菜单ID
        step: number; // 一级菜单所在step
        subMenuStepByStep: boolean; // 子菜单是否需要一步一步去激活
        showStep: boolean; // 是否在菜单display上显示step，如 1框架设置
    }
    interface IMenuDetail {

    }
}
