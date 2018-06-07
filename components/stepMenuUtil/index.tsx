import {Util} from "../util/index";
import objectAssign from "object-assign";
import {StepMenu} from "../../typings/stepMenu";
import IMenu = StepMenu.IMenu;
import IMenuInfo = StepMenu.IMenuInfo;
import IMenuNode = StepMenu.IMenuNode;

export default class StepMenuUtil {
    // 初始化配置文件的菜单对象：
    static instance: StepMenuUtil;
    private menus: IMenu[]; // 传入的菜单配置
    private menuIDMap: any; // 以menuID为key的menuMap
    private urlMenuMap: any; // 以 url 为key的menuMap
    private progressLevel: number | 0; // progress指定第几级菜单 0为默认，0代表一级 如排课指定二级菜单、分班云计算指定一级菜单，二级菜单不显示
    private calculatedLeafStep = 0; // 根据叶子节点个数，得出
    util = new Util();

    static getInstance() {
        if ( !StepMenuUtil.instance ) {
            StepMenuUtil.instance = new StepMenuUtil();
        }
        return StepMenuUtil.instance;
    }
    // 初使化菜单配置
    initMenus(menus, progressLevel) {
        this.menus = menus;
        this.calculatedLeafStep = 0;
        const combMap = this.getMenuIDMap(menus);
        const {ids, urls} = combMap;
        this.menuIDMap = ids;
        this.urlMenuMap = urls;
        this.progressLevel = progressLevel;
    }
    getMenus() {
        return this.menus;
    }

    // menus 以 menuID 为key 的 menu信息 {id:{}, url:{}}
    getMenuIDMap(menus: IMenu[], map= {ids: {}, urls: {}} , parentMenuID = "") {
        const t = this;
        for ( let i = 0; i < menus.length; i++) {
            const menu = menus[i];
            const {id, subMenus, type , url} = menu;
            const menuNew = objectAssign(menu, {step: i + 1, parentMenuID});
            if (url && type === "leaf") {
                map.urls[url] = menuNew;
                menuNew["calculatedLeafStep"] = ++ t.calculatedLeafStep;
            }
            map.ids[id] = menuNew;
            if (subMenus && subMenus.length > 0) {
                map = t.getMenuIDMap(subMenus, map, id);
            }
        }
        return map;
    }

    // 是否有子菜单
    hasSubMenu( menuID: string): boolean {
        const menuIDMap = this.menuIDMap;
        const menuInfo: IMenu = menuIDMap[ menuID ];
        const {type} = menuInfo;
        return type === "branch";
    }

    // 是否在菜单栏中显示子菜单
    hasSubMenuAndShow( menuID: string ): boolean {
        const menuIDMap = this.menuIDMap;
        const menuInfo: IMenu = menuIDMap[ menuID ];
        const {type, displaySubMenu} = menuInfo;
        return type === "branch" && displaySubMenu;
    }

    // 获取传入菜单的状态，1：是否可点击 2：是否是当前路由所在菜单
    getMenuItemStatus(menu: IMenu, stateMenuInfo: IMenuInfo) {
        const t = this;
        let {activeMenuInfo, curMenuInfo} = stateMenuInfo;
        const {id} = menu;
        // 当前menu的steps
        const menuLevelSteps = this.getLevelStepsByMenuID(id);
        let activeMenuID;
        let curMenuID;
        const activeMenuIDs = [];

        while (activeMenuInfo) {
            activeMenuID = activeMenuInfo.menuID;
            activeMenuInfo = activeMenuInfo.subMenuInfo;
            activeMenuIDs.push( activeMenuID );
        }

        while (curMenuInfo) {
            curMenuID = curMenuInfo.menuID;
            curMenuInfo = curMenuInfo.subMenuInfo;
        }

        // 当前progress所在的steps
        const activeLevelSteps = this.getLevelStepsByMenuID( activeMenuID );
        // 当前路由所在的steps
        const curLevelSteps = this.getLevelStepsByMenuID( curMenuID );

        const activeSteps = activeLevelSteps.join(",");
        const curSteps = curLevelSteps.join(",");
        const menuSteps = menuLevelSteps.join(",");

        const isNotSubMenuStepByStep = () => { // 5_2>5_1 需要判断 subMenuStepByStep
            let isActive2 = false;
            const len = Math.min( activeLevelSteps.length, menuLevelSteps.length );
            let equFirstIdx = -1; // 一级菜单index

            for ( let i = 0 ; i < len; i++ ) {
                if ( activeLevelSteps[i] === menuLevelSteps[i] ) {
                    equFirstIdx = i;
                } else {
                    break;
                }
            }
            if ( equFirstIdx !== -1 ) {
                const activeMenuID2 = activeMenuIDs[ equFirstIdx ];
                const sameFirstMenu = t.menus.find(menuC => menuC.id === activeMenuID2);
                isActive2 = sameFirstMenu.subMenuStepByStep;
            }

            return isActive2;
        };

        const isActive = menuSteps <= activeSteps || isNotSubMenuStepByStep();
        // 如果包含的话
        const isCur = curSteps.indexOf(menuSteps) === 0;
        return { isActive, isCur };
    }

    /**
     * 点击下一步时，更新progress activeMenuInfo curMenuInfo 需要跳转的url
     * @param {StepMenu.IMenuInfo} menuInfo
     */
    updateMenuInfoWhenNextStep(menuInfo: IMenuInfo) {
        let { activeMenuInfo, curMenuInfo } = menuInfo;
        const nextProgress = this.getNextProgress(menuInfo);
        const activeMenu = this.getMenuByMenuNode(activeMenuInfo);
        const activeStep = activeMenu.calculatedLeafStep;
        const curMenu = this.getMenuByMenuNode( curMenuInfo );
        const curStep = curMenu.calculatedLeafStep;

        if (curStep === activeStep) {
            activeMenuInfo = this.getNextStepMenuNode( activeMenuInfo );
        } else if ( curStep > activeStep ) {
            activeMenuInfo = this.getNextStepMenuNode( curMenuInfo );
        }
        curMenuInfo = this.getNextStepMenuNode( curMenuInfo );
        const curNextMenu = this.getMenuByMenuNode(curMenuInfo);
        const jumpUrl = this.util.recursiveObj( curNextMenu, `url`) || "";
        return {progress: nextProgress, menuInfo: {activeMenuInfo, curMenuInfo }, url: jumpUrl};
    }

    /**
     * 点击上一步时，更新 activeMenuInfo curMenuInfo 需要跳转的url
     * @param {StepMenu.IMenuInfo} menuInfo
     */
    updateMenuInfoWhenPrevStep(menuInfo: IMenuInfo) {
        let {curMenuInfo } = menuInfo;
        curMenuInfo = this.getPreviousStepMenuNode(curMenuInfo);
        const curPrevMenu = this.getMenuByMenuNode(curMenuInfo);
        const jumpUrl = this.util.recursiveObj( curPrevMenu, `url`) || "";
        return {menuInfo: {activeMenuInfo: menuInfo.activeMenuInfo, curMenuInfo }, url: jumpUrl};
    }

    // 根据menuID获取step的数组 [1,2] ：1级菜单下的第一个菜单的子菜单中的第2个菜单
    getLevelStepsByMenuID( menuID ) {
        let levelSteps = [];
        if ( menuID ) {
            const menuIDMap = this.menuIDMap;
            let menuInfo: IMenu = menuIDMap[menuID];
            const {step, parentMenuID} = menuInfo;
            if (menuInfo) {
                levelSteps.push(step);
            }
            while (parentMenuID) {
                menuInfo = menuIDMap[parentMenuID];
                levelSteps.push( menuInfo.step );
            }
        }
        levelSteps = levelSteps.reverse();
        return levelSteps;
    }

    // 根据url获取菜单节点信息
    getMenuNodeByUrl( url ): IMenuNode {
        let menuNode: IMenuNode;
        if (url) {
            const urlMenuMap = this.urlMenuMap;
            const menuInfo: IMenu = urlMenuMap && urlMenuMap[url];
            const {id, parentMenuID} = menuInfo;

            if (menuInfo) {
                // 根据menuID找到对应的menuIDs
                const menuIDs = this.getMenuIDsByMenuID(id);
                let refMenuNode;
                for ( let i = 0, len = menuIDs.length; i < len; i++ ) {
                    if (!refMenuNode) {
                        menuNode = { menuID: menuIDs[i] };
                        refMenuNode = menuNode;
                    } else {
                        // todo 此处不满足3级菜单
                        if (!refMenuNode) {
                            menuNode = { menuID: menuIDs[i] };
                            refMenuNode = menuNode;
                        } else {
                            refMenuNode = refMenuNode["subMenuInfo"] = {menuID: menuIDs[i]};
                        }
                    }
                }
            }
        }
        return menuNode;
    }

    // 根据 progress 获取当前的menu节点
    getMenuNodeByProgress( progress ): IMenuNode {
        const menuIDMap = this.menuIDMap;
        let menuKey;
        let menuInfo: IMenu;
        for (const key in menuIDMap) {
            if (menuIDMap.hasOwnProperty(key)) {
                const tmpMenuInfo: IMenu = menuIDMap[key];
                const {progressName} = tmpMenuInfo;
                if (progressName === progress) {
                    menuInfo = tmpMenuInfo;
                    menuKey = key;
                    break;
                }
            }
        }
        const menuNode = {menuID: menuKey};
        if (menuInfo.type === "branch") { // 含有子菜单
            menuNode["subMenuInfo"] = menuInfo.subMenus[0].id;
        }
        return menuNode;
    }

    // 根据menuID获取menuIDs列表，顺序为1级 2级……
    getMenuIDsByMenuID(menuID): string[] {
        const menuIDMap = this.menuIDMap;
        let menuInfo: IMenu = menuIDMap && menuIDMap[menuID];
        if (menuInfo) {
            let menuIDs = [menuID];
            const {parentMenuID} = menuInfo;
            while (parentMenuID) {
                menuIDs.push(parentMenuID);
                menuInfo = menuIDMap[parentMenuID];
            }
            menuIDs = menuIDs.reverse();
            return menuIDs;
        } else {
            return null; // 不存在的menuID
            console.log("不存在的menuID=" + menuID);
        }
    }

    // 根据menuID获取菜单节点
    getMenuNodeByMenuID( menuID ): IMenuNode {

        // 根据menuID找到对应的menuIDs
        const menuIDs = this.getMenuIDsByMenuID(menuID);
        let menuNode;
        if (menuIDs) {
            let refMenuNode;
            for ( let i = 0, len = menuIDs.length; i < len; i++ ) {
                if ( !refMenuNode ) {
                    menuNode = { menuID: menuIDs[i] };
                    refMenuNode = menuNode;
                } else {
                    refMenuNode = refMenuNode["subMenuInfo"] = {menuID: menuIDs[i]};
                }
            }
            return menuNode;
        }
    }

    // 根据curMenuInfo获取上一步的菜单节点
    getPreviousStepMenuNode( curMenuInfo: IMenuNode ): IMenuNode {
        return this.getPreNexMenuNode(curMenuInfo, -1);
    }

    //
    getNextStepMenuNode(activeMenuInfo: IMenuNode): IMenuNode {
        return this.getPreNexMenuNode(activeMenuInfo, 1);
    }

    /**
     * @param {StepMenu.IMenuNode} stateTreeMenuInfo
     * @param {number} stepS 获取preStep -1   nextStep +1
     * @returns {StepMenu.IMenuNode}
     */
    getPreNexMenuNode(stateTreeMenuInfo: IMenuNode, stepS: number) {
        const t = this;
        const menuIDMap = this.menuIDMap;
        const menuInfo = this.getMenuByMenuNode(stateTreeMenuInfo);
        let { calculatedLeafStep} = menuInfo;
        let menuID = menuInfo.id;
        if ( calculatedLeafStep > 1 ) {
            calculatedLeafStep += stepS;
        }

        for ( const key in menuIDMap ) {
            if (menuIDMap.hasOwnProperty(key) && menuIDMap[key]["calculatedLeafStep"] === calculatedLeafStep) {
                menuID = menuIDMap[key].id;
                break;
            }
        }
        const menuNode = this.getMenuNodeByMenuID( menuID );
        return menuNode;
    }

    // 通过菜单节点，获取菜单信息
    getMenuByMenuNode( menuNode: IMenuNode): IMenu {
        let menuID = menuNode.menuID;
        while (menuNode.subMenuInfo) {
            menuNode = menuNode.subMenuInfo;
            menuID = menuNode.menuID;
        }
        const menuIDMap = this.menuIDMap;
        return menuIDMap && menuIDMap[menuID];
    }

    /**
     * 通过当前菜单节点，获取目标step的菜单信息
     * 主要用于当前菜单的上一步、下一步 的菜单信息
     * @param {StepMenu.IMenuNode} curMenuInfo
     * @param {number} distanceStep 将当前 step 运算变成 目标step
     * @returns {StepMenu.IMenu | string}
     */
    getMenuByMenuNodeCalculatedStep( curMenuInfo: IMenuNode, distanceStep: number): IMenu {
        const menuNode = this.getPreNexMenuNode(curMenuInfo, distanceStep);
        const menuID = menuNode.menuID;
        const menuIDMap = this.menuIDMap;
        const menuInfo: IMenu = menuIDMap && menuIDMap[menuID];
        return menuInfo;
    }

    /**
     * todo 需要想想是否还需要其他字段
     * 通过progress获取，当前菜单信息
     * 主要用于在任务列表显示时，需要展示任务进度，1/3
     * @param {string} progress
     * @returns {{step: any; allStep: any; progress: string; url: any}}
     */
    getProcessInfo( progress: string ) {
        const menuNode: IMenuNode = this.getMenuNodeByProgress( progress );
        const menus = this.menus;
        // 总step num
        const allStep = menus && menus.length || 0;
        // 当前所在step
        const firstLevelMenu: IMenu = menus.find(menu => menu.id === menuNode.menuID);
        const step = firstLevelMenu && firstLevelMenu.step;
        const subMenuInfo = this.getMenuByMenuNode(menuNode);
        const url  =  subMenuInfo && subMenuInfo.url;
        return { step, allStep, progress, url };
    }

    // 通过 最远生效的菜单节点，推导出 progress 信息
    getProcessByActiveMenuInfo( activeMenuInfo: IMenuNode ): string {
        let effMenuID = activeMenuInfo.menuID;
        const menuIDs = this.getMenuIDsByMenuID(effMenuID);
        const progressLevel = this.progressLevel;
        if (progressLevel > 0 ) {
            for (let i = 0; i < progressLevel; i++) {
                effMenuID = menuIDs[progressLevel];
            }
        }
        const menuIDMap = this.menuIDMap;
        const progress = this.util.recursiveObj(menuIDMap, `${effMenuID}|progressName`) || "";
        return progress;
    }

    /**
     * 一级菜单点击时，需要默认选中其子菜单的第一个
     * @param menuID
     * @returns {StepMenu.IMenuNode}
     */
    getFirstStepByTopMenuID( menuID ): IMenuNode {
        const menuIDMap = this.menuIDMap;
        const subMenus: IMenu[] = this.util.recursiveObj(menuIDMap, `${menuID}|subMenus`) || [];
        const firstSubMenuID = subMenus[0] && subMenus[0].id;
        const menuNode = this.getMenuNodeByMenuID(firstSubMenuID);
        return menuNode;
    }

    // 根据状态数上的菜单信息，推导出下一步的progress
    getNextProgress( menuInfo: IMenuInfo ) {
        let progress = "";
        let { activeMenuInfo} = menuInfo;

        const activeMenu = this.getMenuByMenuNode(activeMenuInfo);
        const curMenu = this.getMenuByMenuNode(menuInfo.curMenuInfo);

        if (activeMenu.calculatedLeafStep === curMenu.calculatedLeafStep) {
            activeMenuInfo = this.getNextStepMenuNode( activeMenuInfo );
            progress = this.getProcessByActiveMenuInfo( activeMenuInfo );
        }
        return progress;
    }
}
