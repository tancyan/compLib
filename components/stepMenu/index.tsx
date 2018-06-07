import * as React from "react";
import classNames from "classnames";
import {StepMenu} from "../../typings/stepMenu";
import IMenu = StepMenu.IMenu;
import IMenuInfo = StepMenu.IMenuInfo;
import StepMenuUtil from "../stepMenuUtil/index";
import {Util} from "../util/index";

export interface IStepMenuComProps {
    menus: IMenu[]; // 菜单列表
    menuInfo: IMenuInfo; // 当前菜单状态 {openKeys,selectedKeys}
    mode?: "vertical" | "horizontal" | "inline";
    menuClick?: (menuInfo: IMenuInfo, url?: string) => void; // 菜单点击事件
    speMenuNodeMap?: any; // 以menuID为key值的dom元素，某些菜单节点，需要特殊显示形式的，如排课系统调课页面需要特殊显示小红点 {adjustSchedule:<div>a</div>}
}

export interface IStepMenuComState {

}

/**
 * 带step的导航
 * 用例 分班云计算、排课系统 需要按step完成，才能点击下一步，激活下一步菜单
 */
const MenuIDMap = [
    {
        id: "scheduleSetting",
        step: 1,
        subMenuStepByStep: true,
        showStep: false,
        menuType: "branch",
        displayName: "课程设置",
        url: "/schedule/scheduleSetting",
        subMenuClassName: "",
        subMenus: [
            {
                id: "iframeSetting",
                menuType: "leaf",
                parentMenuID: "scheduleSetting",
                step: 1,
                displayName: "框架设置",
                url: "/schedule/curriculumSetting/frameSetting",
            },
            {
                id: "scheduleImport",
                menuType: "leaf",
                step: 2,
                parentMenuID: "scheduleSetting",
                displayName: "常规课程",
                url: "/schedule/curriculumSetting/courseImport",
            },
            {
                id: "shiftCourse",
                menuType: "leaf",
                step: 3,
                parentMenuID: "scheduleSetting",
                displayName: "走班课程",
                url: "/schedule/curriculumSetting/shiftCourse"
            }
        ]
    },
    {
        id: "preSchedule",
        step: 3,
        subMenuStepByStep: true,
        showStep: false,
        menuType: "branch",
        displayName: "预排课程",
        subMenuClassName: "",
        subMenus: [
            {
                id: "preTakeClassSchedule",
                menuType: "leaf",
                step: 1,
                parentMenuID: "preSchedule",
                displayName: "走班预排",
                url: "/schedule/preSchedule/preTakeClassSchedule",
            },
            {
                id: "preNormalSchedule",
                menuType: "leaf",
                step: 2,
                parentMenuID: "preSchedule",
                displayName: "常规预排",
                url: "/schedule/preSchedule/preNormalSchedule",
            },
        ]
    },
    {
        id: "autoSchedule",
        step: 4,
        subMenuStepByStep: false,
        showStep: false,
        menuType: "leaf",
        displayName: "自动排课",
        url: "/schedule/autoSchedule",
    },
    {
        id: "lookUpSchedule",
        step: 5,
        subMenuStepByStep: false, // 子菜单是否需要一步一步去激活
        showStep: false,
        menuType: "branch",
        displayName: "查看课表",
        subMenuClassName: "",
        subMenus: [
            {
                id: "scheduleOverview",
                menuType: "leaf",
                parentMenuID: "lookupSchedule",
                displayName: "总课程表",
                url: "/schedule/curriculumSchedule/scheduleOverview",
                step: 1,
                showStep: false,
            },
            {
                id: "classScheduleOverview",
                menuType: "leaf",
                parentMenuID: "lookupSchedule",
                displayName: "班级课表",
                url: "/schedule/curriculumSchedule/classSchedule",
                step: 2,
                showStep: false,
            },
            {
                id: "courseScheduleOverview",
                menuType: "leaf",
                displayName: "总任课表",
                parentMenuID: "lookupSchedule",
                url: "/schedule/curriculumSchedule/courseScheduleOverview",
                step: 3,
                showStep: false,
            }
        ]
    }
];
export default class StepMenuCom extends React.Component<IStepMenuComProps, IStepMenuComState> {

    constructor(props: any) {
        super(props);
        this.state = {};
    }
    private stepMenuUtil = new StepMenuUtil();
    private util = new Util();

    //上一步菜单不校验
    isStepPre(nextMenuID,curMenuID){//step 点击的步数 curMenuID 当前页面的menuID

        var menuMap = {};// 菜单对应的步数 first: second:

        let entrySubMenus = recursiveObj(MenuIDMap,"entry|subMenu") || [];

        //
        entrySubMenus.forEach(function(menuObj){
            menuMap[menuObj.menuID] = {
                first: menuObj.step,
                second: 1,//一级菜单 默认跳转到二级菜单第一步
            };
            if(menuObj.subMenuStepByStep){//是否有二级菜单
                let secondSubMenu = MenuIDMap[menuObj.menuID].subMenu;
                for(var i=0;i<secondSubMenu.length;i++){

                    var secondMenuID = secondSubMenu[i].menuID;
                    menuMap[secondMenuID] = {
                        first:menuObj.step,
                        second:MenuIDMap[secondMenuID].step
                    }
                }

            }
        })

        var curStepObj = menuMap[curMenuID]||{};//当前
        var nextStepObj = menuMap[nextMenuID]||{};//点击

        if(curStepObj.first>nextStepObj.first){
            return true;
        }else if(curStepObj.first==nextStepObj.first){
            if(curStepObj.second>nextStepObj.second){
                return true;
            }
        }

        return false;
    }

    // 改成string 双击时，可以不更新App.tsx
    linkToPage( menuInfo,curMenuID )
    {
        var isNotCheck = this.isStepPre(menuInfo.menuID,curMenuID);
        if(!isNotCheck){
            //菜单跳转的校验
            var checkFuncMeunMap = getCheckFuncMenuMap();
            if(checkFuncMeunMap[curMenuID]){
                var checkFuncProps = getCheckFuncProps(curMenuID);


                var isChecked = checkFuncMeunMap[curMenuID](menuInfo,checkFuncProps);
                if(!isChecked){//校验不通过
                    return
                }

            }
        }


        let curMenuRouterStatus = StateQueryService.getInstance().iSLoadingMenuRouterFinish();
        var { url} = menuInfo;
        //console.log(`click start,url=${url},curMenuRouterStatus=${curMenuRouterStatus}`);
        if(!curMenuRouterStatus || (curMenuRouterStatus && curMenuRouterStatus != url )){
            var { router,location, actions } = this.props;
            var query = location && location.query || {};
            var moduleHandler = ModuleHandler.getInstance();

            var success = function(){
                    actions.changeCurClickRouterStatus(url);
                    router.push({
                        pathname: url,
                        query,
                    });

                    var curMenuInfo = getMenuNodeByMenuID( menuInfo.menuID );
                    actions.changeCurMenuInfo(curMenuInfo);
                },
                fail = function(){};
            if(isNotCheck){
                success()
            }else{
                moduleHandler.postDataToServerIfStateChanged( {}, success, fail, fail );

            }
        }

    }

    handleTopLevelMenuItem( menuInfo, curMenuID ) {
        const stepMenuUtil = this.stepMenuUtil;
        var isNotCheck = this.isStepPre(menuInfo.menuID,curMenuID);
        if( !isNotCheck ){
            //菜单跳转的校验
            var checkFuncMeunMap = getCheckFuncMenuMap();
            if(checkFuncMeunMap[curMenuID]){
                var checkFuncProps = getCheckFuncProps(curMenuID);


                var isChecked = checkFuncMeunMap[curMenuID](menuInfo,checkFuncProps);
                if(!isChecked){//校验不通过
                    return
                }

            }
        }
        var curMenuInfo = stepMenuUtil.getFirstStepByTopMenuID( menuInfo.menuID );
        var url = getUrlByMenuNode( curMenuInfo );
        if(!curMenuRouterStatus || (curMenuRouterStatus && curMenuRouterStatus != url )){

            var { router,location, actions } = this.props;
            var query = location && location.query || {};
            var moduleHandler = ModuleHandler.getInstance();

            var success = function(){
                    actions.changeCurClickRouterStatus(url);
                    router.push({
                        pathname: url,
                        query,
                    });

                    //var curMenuInfo = getMenuNodeByMenuID( menuInfo.menuID );
                    actions.changeCurMenuInfo(curMenuInfo);
                },
                fail = function(){};
            if(isNotCheck){
                success();
            }else{
                moduleHandler.postDataToServerIfStateChanged( {}, success, fail, fail );
            }
        }
    }

    getMenuDom() {
        const menus = this.props.menus;
        const lis = [];
        const levelIdx = 0; // menu level
        for ( let i = 0, len = menus.length; i < len; i++ ) {
            lis.push( this.getMenuItem( menus[i], levelIdx, i ) );
        }
        return <ul className="schedule-menu-wrapper">{lis}</ul>;
    }

    getMenuItem( menu: IMenu, levelIdx, itemIdx ) {
        const t = this;
        const stepMenuUtil = this.stepMenuUtil;
        const util = this.util;
        const { menuInfo, speMenuNodeMap } = this.props;
        const {curMenuInfo} = menuInfo;
        const { id, subMenus, name, arrow, className, step, showStep, icon } = menu;
        const subLen = subMenus && subMenus.length || 0;
        // 获取当前菜单 isActive：是否可点，isCur：是否是当前的
        const menuItemStatus = stepMenuUtil.getMenuItemStatus( menu, menuInfo);
        let { isActive,  isCur } = menuItemStatus;

        const noForceStep = util.recursiveObj( this.props, "location|query|noForceStep" );
        if (noForceStep) {
            isActive = true;
        }
        const menuClsName = classNames(
            {
                [className]: !!className,
                "menu-item": true,
                "menu-item-useable": isActive,
                "menu-item-active": isCur
            }
        );

        // 当前页面的menuID
        const curPageMenuInfo = stepMenuUtil.getMenuByMenuNode(curMenuInfo);
        const curMenuID = curPageMenuInfo && curPageMenuInfo.id;
        if (subLen) { // 无子菜单节点
            const lis = [];
            for ( let i = 0; i < subLen; i++ ) {
                lis.push(this.getMenuItem(subMenus[i], levelIdx + 1, i));
            }
            const clickHandleFunc = isActive ? this.handleTopLevelMenuItem.bind(this, menuInfo, curMenuID) : () => {};
            return (
                <li key={levelIdx + "-" + itemIdx}  className={menuClsName}>
                    <div className="menu-item-name" onClick={clickHandleFunc}>
                        <span className="head-name">{speMenuNodeMap && speMenuNodeMap[id] || {name}}</span>
                        {arrow ? arrow : ""}
                    </div>
                    <ul className="sub-menu">{lis}</ul>
                </li>
            );
        } else { // 有子菜单节点
            // 菜单跳转的校验
            const clickHandle = isActive ?  this.linkToPage.bind(this, menuInfo, curMenuID) :  () => {};
            return (
                <li key={levelIdx + "-" + itemIdx} className={menuClsName} >
                    <div className="menu-item-name" onClick={clickHandle}>
                        <span  className="head-name">
                            {step  &&  showStep && <em>{step}</em>}
                            {icon   && <img  className="icon-img" src={icon} alt = "图标"/>}
                            {speMenuNodeMap && speMenuNodeMap[id] || <span>{name}</span>}
                        </span>
                        {arrow ? arrow : ""}
                    </div>
                </li>
            );
        }

    }

    static defaultProps = {};

    render() {
        return null;
    }
}
