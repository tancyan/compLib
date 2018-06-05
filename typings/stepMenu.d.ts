
declare module "stepMenu" {
    namespace StepMenu {
        interface IMenuInfo { // active menuInfo
            openKeys: string[];
            selectedKeys: string[];
        }
    }
    export = StepMenu;
}
