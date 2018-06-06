import {Util} from "../util/index";

export default class StepMenuUtil {
    // 初始化配置文件的菜单对象：
    static instance: StepMenuUtil;
    util = new Util();

    static getInstance() {
        if ( !StepMenuUtil.instance ) {
            StepMenuUtil.instance = new StepMenuUtil();
        }
        return StepMenuUtil.instance;
    }
    // 初使化菜单配置
    setMenus(menus) {
        this.menus = menus;
    }
    getMenus() {
        return this.menus;
    }

    /**
     * 获取一级菜单 二级菜单列表
     * @returns {any[]}
     */
    handleMenuStruct(): any[] {

        // 获取context里面存储的 classifyMenus
        //let menuCache = getMenuCache();
        let classifyMenus = getClassifyTypeIDMenuCacheData(MENUKEYMAP.classifyMenus)//menuCache[MENUKEYMAP.classifyMenus];

        if( isEmptyObject(classifyMenus) ){
            var entry = getEntry();
            var { subMenu } = entry;
            var i  = 0, len = subMenu && subMenu.length || 0;
            let classifyMenusNew = [];
            for( ; i < len; i++ ){
                var { menuID,step, subMenuStepByStep, showStep } = subMenu[ i ];
                var menuInfo = getMenuInfoAccordingMenuID( menuID );
                if( menuInfo ){
                    menuInfo.step = step;
                    menuInfo.subMenuStepByStep = subMenuStepByStep;
                    menuInfo.showStep = showStep;
                    classifyMenusNew.push( menuInfo );
                }
            }

            setClassifyTypeIDMenuCacheData(MENUKEYMAP.classifyMenus,classifyMenusNew);
            //menuCache[MENUKEYMAP.classifyMenus] = classifyMenusNew;

            return classifyMenusNew;

        }

        return classifyMenus;
}

/**
 * 组装子菜单
 * @param menuID
 * @returns {null}
 */
function getMenuInfoAccordingMenuID( menuID:string ){
    //原始数据：
    let MenuIDMap = getMenuIDMap();

    var menuIDInfo = MenuIDMap[ menuID ];
    var menuInfo = null;

    if( isMenuExist(menuID) ){
        if( menuIDInfo ){
            let displayName = menuIDInfo["displayName"];
            let arrow = menuIDInfo["arrow"];
            let step = menuIDInfo["step"];
            let menuType = menuIDInfo["menuType"];
            let subMenuClassName = menuIDInfo["subMenuClassName"];
            let parentMenuID = menuIDInfo["parentMenuID"];
            let showStep = menuIDInfo["showStep"];
            let displaySubMenu = menuIDInfo["displaySubMenu"];
            //var { displayName, arrow, step, menuType, subMenuClassName,parentMenuID, showStep,displaySubMenu } = menuIDInfo;
            menuInfo = { parentMenuID, menuID, displayName, menuType,arrow, showStep, step, subMenuClassName,displaySubMenu };

            if( hasSubMenu(menuID) ){
                menuInfo.subMenu = getSubMenuInfo( menuID );
            } else {
                menuInfo.url = menuIDInfo["url"];
            }
        }
        return menuInfo;
    }
}

//判断菜单存在的工具方法：
function isMenuExist( menuID:string ){
    return true;
}

export function hasSubMenu( menuID:string ):boolean{

    let MenuIDMap = getMenuIDMap();
    var menuInfo = MenuIDMap[ menuID ];
    var menuType = menuInfo && menuInfo["menuType"] || "";
    var hasSubMenu = menuType === "branch";
    return hasSubMenu
}

export function hasSubMenuAndShow( menuID:string ):boolean{
    let MenuIDMap = getMenuIDMap();

    var menuInfo = MenuIDMap[ menuID ];
    var menuType = menuInfo && menuInfo["menuType"] || "";
    var hasSubMenu = menuType === "branch" && menuInfo["displaySubMenu"];
    return hasSubMenu
}


function getSubMenuInfo( menuID:string ){
    let MenuIDMap = getMenuIDMap();

    var menuInfo = MenuIDMap[ menuID ];
    var subMenus;

    if( menuInfo ){
        var subMenu = menuInfo["subMenu"];
        var i = 0, len = subMenu && subMenu.length || 0;
        var subMenuInfo;

        if( len ){
            subMenus = [];
        }

        for( ; i < len; i++ ){
            subMenuInfo = subMenu[ i ];
            menuID = subMenuInfo.menuID;
            subMenus.push( getMenuInfoAccordingMenuID(menuID) );
        }
    }

    return subMenus;
}

/**
 * todo menuIDMap 根据 classifyTypeID 分班设置读取不同的配置文件
 * @returns {{subMenu}|any}
 */
export function getEntry(){
    let MenuIDMap = getMenuIDMap();
    return MenuIDMap.entry;
}

//判读传入的menuNode的激活状态，可不可点击，
//有子菜单的，子菜单可不可显示。

export function getMenuItemStatus(menuInfo, activeMenuInfo:MenuNode, curMenuInfo:MenuNode){
    var menuLevelSteps = getMenuLevelStep( menuInfo.menuID );
    var activeMenuID,activeMenuIDs = [], curMenuID;
    var activeMenuInfoTemp = activeMenuInfo;
    var curMenuInfoTemp = curMenuInfo;

    while( activeMenuInfo ){
        activeMenuID = activeMenuInfo.menuID;
        activeMenuInfo = activeMenuInfo.subMenuInfo;
        activeMenuIDs.push( activeMenuID );
    }

    while( curMenuInfo ){
        curMenuID = curMenuInfo.menuID;
        curMenuInfo = curMenuInfo.subMenuInfo;
    }

    var activeLevelSteps = getMenuLevelStep( activeMenuID );
    var curLevelSteps = getMenuLevelStep( curMenuID );

    var i = 0, len = menuLevelSteps && menuLevelSteps.length || 0;
    var activeStates = [];
    var curStates = [];

    var isActive = false, isCur = false;
    var activeSteps = activeLevelSteps.join(",");
    var curSteps = curLevelSteps.join(",");
    var menuSteps = menuLevelSteps.join(",");

    var isNotSubMenuStepByStep = function(){
        var isActive = false;
        var i = 0, len = Math.min( activeLevelSteps.length, menuLevelSteps.length );
        var equleIdx = -1;

        for( ; i < len; i++ ){
            if( activeLevelSteps[i] == menuLevelSteps[i] ){
                equleIdx = i;
            } else {
                break;
            }
        }


        if( equleIdx !== -1 ){
            var activeMenuID = activeMenuIDs[ equleIdx ];
            var subMenu = getEntry().subMenu;
            var subIdx = getIndex( subMenu, function(menuInfo){
                return menuInfo.menuID == activeMenuID;
            })

            isActive = !subMenu[subIdx]["subMenuStepByStep"];
        }

        return isActive;
    };

    isActive = menuSteps <= activeSteps || isNotSubMenuStepByStep();
    //如果包含的话：
    var index = curSteps.indexOf(menuSteps);

    if( index === 0 ){
        isCur = true;
    }

    return { isActive, isCur };
}

export function getMenuLevelStep( menuID ){
    var levelSteps = [];

    if( menuID ){
        let MenuIDMap = getMenuIDMap();
        var menuInfo = MenuIDMap[menuID];
        if(menuInfo){
            levelSteps.push(menuInfo["step"] );
        }

        while( menuInfo && menuInfo["parentMenuID"] ){
            menuInfo = MenuIDMap[menuInfo["parentMenuID"]];
            levelSteps.push( menuInfo["step"] );
        }
    }
    levelSteps = levelSteps.reverse();
    return levelSteps;
}


//获取菜单的激活菜单的第一步：
export function getFirstActiveMenuInfo():MenuNode{
    var menus = handleMenuStruct();
    var idx = 0, menuInfo = menus[ idx ];
    var { menuID, subMenu } = menuInfo;
    var menuNode:MenuNode = { menuID };
    var refMenuNode = undefined;

    while( subMenu ){
        menuInfo = subMenu[ idx ];

        if( !refMenuNode ){
            refMenuNode = menuNode;
            refMenuNode["subMenuInfo"] = { menuID: menuInfo.menuID};
        } else {
            refMenuNode = refMenuNode["subMenuInfo"] = { menuID: refMenuNode.menuID};
        }

        subMenu = menuInfo && menuInfo.subMenu || null;
    }

    return menuNode;
}

function getSubMenuStep( subMenus, stepCount ){
    var i = 0, len = subMenus && subMenus.length || 0;
    var menuInfo;

    for( ; i < len; i++ ){
        menuInfo = subMenus[i];
        var { subMenu } = menuInfo;

        if( subMenu ){
            stepCount = getSubMenuStep( subMenu, stepCount );
        } else {
            stepCount++;
        }
    }

    return stepCount;
}


export function handleUrlToMenuNdoe( url ):MenuNode{
    var menuNode:MenuNode;

    if( url ){

        let MenuIDMap = getMenuIDMap();

        var url2MenuID = handleRouteUrl2MenuIDMap();
        var menuID = url2MenuID[url];

        var menuInfo = MenuIDMap[menuID];
        var menuIDs = [ menuID ];

        if( menuInfo ){
            while( menuInfo["parentMenuID"] ){
                menuID = menuInfo["parentMenuID"];
                menuIDs.push( menuID );
                menuInfo = MenuIDMap[menuID];
            }

            menuIDs = menuIDs.reverse();
            var refMenuNode;

            for( var i = 0, len = menuIDs.length; i < len; i++ ){
                if( !refMenuNode ){
                    menuNode = { menuID: menuIDs[i] };
                    refMenuNode = menuNode;
                } else {
                    refMenuNode = refMenuNode["subMenuInfo"] = {menuID:menuIDs[i]};
                }
            }
        }
    }


    return menuNode;
}

//var gUrl2MenuIDMap;

export function handleRouteUrl2MenuIDMap(){

    // 获取context里面存储的 gUrl2MenuIDMap
    //let menuCache = getMenuCache();
    let gUrl2MenuIDMap = getClassifyTypeIDMenuCacheData(MENUKEYMAP.gUrl2MenuIDMap)//menuCache[MENUKEYMAP.gUrl2MenuIDMap];

    if( isEmptyObject(gUrl2MenuIDMap) ){
        gUrl2MenuIDMap = {};

        var menus = handleMenuStruct();
        var i = 0, len = menus && menus.length || 0;

        for( ; i < len; i++ ){
            handleSubMenuItemUrl( menus[i],gUrl2MenuIDMap );
        }

        setClassifyTypeIDMenuCacheData(MENUKEYMAP.gUrl2MenuIDMap,gUrl2MenuIDMap);
        //menuCache[MENUKEYMAP.gUrl2MenuIDMap] = gUrl2MenuIDMap;
    }

    return gUrl2MenuIDMap;
}

export function handleSubMenuItemUrl( menuInfo,gUrl2MenuIDMap ){
    var { subMenu, menuType, url, menuID } = menuInfo;

    if( menuType === 'branch' ){
        var i = 0, len = subMenu.length;

        for( ; i < len; i++ ){
            handleSubMenuItemUrl( subMenu[i],gUrl2MenuIDMap );
        }
    } else {
        gUrl2MenuIDMap[url] = menuID;
    }
}


export function handleProcessToMenuNode( progress ):MenuNode{

    let menuInfo;
    let menuKey;
    let MenuIDMap = getMenuIDMap();
    for(let key in MenuIDMap){
        if(MenuIDMap[key]["displayName"] == progress){
            menuInfo = MenuIDMap[key];
            menuKey = key;
            break;
        }
    }
    let menuNode;
    if(menuInfo.menuType == "branch"){
        menuNode = {
            menuID:menuKey,
            subMenuInfo:{
                menuID:menuInfo.subMenu[0].menuID
            }
        }
    }else{
        menuNode = {
            menuID:menuKey
        }
    }


    return menuNode;
}

export function getMenuNodeByMenuID( menuID ):MenuNode{

    let MenuIDMap = getMenuIDMap();

    var menuNode;
    var menuInfo = MenuIDMap[menuID];

    if( menuInfo ){
        var menuIDs = [ menuID ];

        while( menuInfo["parentMenuID"] ){
            menuID = menuInfo["parentMenuID"];
            menuIDs.push( menuID );
            menuInfo = MenuIDMap[menuID];
        }

        menuIDs = menuIDs.reverse();
        var refMenuNode;

        for( var i = 0, len = menuIDs.length; i < len; i++ ){
            if( !refMenuNode ){
                menuNode = { menuID: menuIDs[i] };
                refMenuNode = menuNode;
            } else {
                refMenuNode = refMenuNode["subMenuInfo"] = {menuID:menuIDs[i]};
            }
        }

        return menuNode;
    } else {
        window.console && window.console.log( menuID );
    }

}

export function getPreviousStep( curMenuInfo ):MenuNode{
    var menuID = curMenuInfo.menuID;

    while( curMenuInfo.subMenuInfo ){
        curMenuInfo = curMenuInfo.subMenuInfo;
        menuID = curMenuInfo.menuID;
    }

    var menuID2Step = handleMenuIDToMappingStep();
    var step = menuID2Step[menuID];

    if( step > 1 ){
        step--;
    }

    for( var name in menuID2Step ){
        if( menuID2Step.hasOwnProperty(name) && menuID2Step[name] == step ){
            menuID = name;
            break;
        }
    }

    var menuNode:MenuNode = getMenuNodeByMenuID( menuID );
    return menuNode;
}

//通过menuID找到对应进行的第几步：
// var globalMenuID2Step, globalStep;
var globalStep;

export function handleMenuIDToMappingStep(){

    // 获取context里面存储的 globalMenuID2Step
    //let menuCache = getMenuCache();
    let globalMenuID2Step = getClassifyTypeIDMenuCacheData(MENUKEYMAP.globalMenuID2Step)//menuCache[MENUKEYMAP.globalMenuID2Step];

    if( isEmptyObject(globalMenuID2Step) ){
        globalMenuID2Step = {};
        globalStep = 0;
        var menus = handleMenuStruct();

        for( var i = 0; i < menus.length; i++ ){
            getMenuInfoMenuIDToStep( menus[i],globalMenuID2Step );
        }

        setClassifyTypeIDMenuCacheData(MENUKEYMAP.globalMenuID2Step,globalMenuID2Step);
        //menuCache[MENUKEYMAP.globalMenuID2Step] = globalMenuID2Step;
    }

    return globalMenuID2Step;
}


function getMenuInfoMenuIDToStep( menuInfo,globalMenuID2Step ){
    var { menuType, menuID,subMenu } = menuInfo;

    if( menuType === "branch" ){
        var i = 0, len = subMenu.length;

        for( ; i < len; i++ ){
            getMenuInfoMenuIDToStep( subMenu[i],globalMenuID2Step );
        }
    } else {
        globalMenuID2Step[menuID] = ++globalStep;
    }
}

export function getNextMenuStepInfo(activeMenuInfo:MenuNode):MenuNode{
    var menuID = activeMenuInfo.menuID;

    while( activeMenuInfo.subMenuInfo ){
        activeMenuInfo = activeMenuInfo.subMenuInfo;
        menuID = activeMenuInfo.menuID;
    }

    var menuID2Step = handleMenuIDToMappingStep();
    var step = menuID2Step[ menuID ];
    step++;

    for( var name in menuID2Step ){
        if( menuID2Step.hasOwnProperty(name) && menuID2Step[name] == step ){
            menuID = name;
            break;
        }
    }

    var menuNode:MenuNode = getMenuNodeByMenuID( menuID );
    return menuNode;
}

export function getStepByMenuNode( menuNode:MenuNode ){
    var menuID = menuNode.menuID;

    while( menuNode.subMenuInfo ){
        menuNode = menuNode.subMenuInfo;
        menuID = menuNode.menuID;
    }

    var menuID2Step = handleMenuIDToMappingStep();
    var step = menuID2Step[menuID];

    return step;
}


function getStepByMenuID( menuID ){
    var menuID2Step = handleMenuIDToMappingStep();
    var step = menuID2Step[ menuID ] || 0;
    return step;
}

export function getDistanceStepUrlByMenuInfo( curMenuInfo:MenuNode, distanceStep :number){
    var menuID = curMenuInfo.menuID;

    while( curMenuInfo.subMenuInfo ){
        curMenuInfo = curMenuInfo.subMenuInfo;
        menuID = curMenuInfo.menuID;
    }

    var step = getStepByMenuID( menuID );
    step += distanceStep;
    var targetMenuID;

    var menuID2Step = handleMenuIDToMappingStep();
    for( var menuID in menuID2Step ){
        if( menuID2Step[menuID] === step && menuID2Step.hasOwnProperty(menuID) ){
            targetMenuID = menuID;
        }
    }

    var url2MenuIDMap = handleRouteUrl2MenuIDMap();
    var routeUrl;

    if( url2MenuIDMap ){
        for( var url in url2MenuIDMap ){
            if( url2MenuIDMap.hasOwnProperty(url) ){
                if( url2MenuIDMap[url] === targetMenuID ){
                    routeUrl = url;
                    break;
                }
            }
        }
    }

    return routeUrl;
}

export function getUrlByMenuNode( menuNode:MenuNode ):string{
    var menuID = menuNode.menuID;

    while( menuNode.subMenuInfo ){
        menuNode = menuNode.subMenuInfo;
        menuID = menuNode.menuID;
    }

    var url2MenuIDMap = handleRouteUrl2MenuIDMap();
    var targetUrl;

    for( var url in url2MenuIDMap ){
        if( url2MenuIDMap.hasOwnProperty(url) && url2MenuIDMap[url] === menuID ){
            targetUrl = url;
            break;
        }
    }

    return targetUrl;
}

export function getProcessInfo( progress:string ){
    var menuNode:MenuNode = handleProcessToMenuNode( progress );

    if( !menuNode )
    {
        menuNode = getFirstActiveMenuInfo();
    }

    var entry = getEntry();
    var { subMenu } = entry;
    var step;
    var allStep = subMenu.length;

    var idx = getIndex(subMenu,function( menuInfo ){ return menuInfo.menuID === menuNode.menuID } );
    step = subMenu[idx]["step"];
    var url  =  getUrlByMenuNode( menuNode );
    return { step, allStep, progress, url };
}

// progress仅是一级菜单的值
export function getProcessByActiveMenuInfo( activeMenuInfo:MenuNode ){
    var menuID = activeMenuInfo.menuID;
    var progress = '';

    let MenuIDMap = getMenuIDMap();
    for(let key in MenuIDMap){
        if(key == menuID ){
            progress = MenuIDMap[key]["displayName"];
            break;
        }
    }
    return progress;

}

//
export function getFirstStepByTopMenuID( menuID ):MenuNode{
    let MenuIDMap = getMenuIDMap();
    var menuInfo = MenuIDMap[ menuID ];
    var menuNode:MenuNode;

    if( menuInfo ){
        var subMenu = menuInfo["subMenu"];

        while( subMenu ){
            subMenu = subMenu.sort(function(a,b){ return a.step - b.step } );
            menuInfo = subMenu[ 0 ];
            subMenu = menuInfo["subMenu"];
        }

        menuNode = getMenuNodeByMenuID( menuInfo["menuID"] );
    }

    return menuNode;
}

/**
 * 获取下一步的progress
 */

export function getNextProgress( classifyMenuInfo ){
    var progress = '';

    var { activeMenuInfo, curMenuInfo } = classifyMenuInfo;

    var activeStep = getStepByMenuNode( activeMenuInfo );
    var curStep = getStepByMenuNode( curMenuInfo );

    if( curStep === activeStep ){
        activeMenuInfo = getNextMenuStepInfo( activeMenuInfo );

        progress = getProcessByActiveMenuInfo( activeMenuInfo );
    }
    /*else if( curStep > activeStep ){
        activeMenuInfo = getNextMenuStepInfo( curMenuInfo );
    }*/

    return progress;
}

/**
 * 跳转下一步
 */
//router,location, menuActions, classifyMenuInfo,basicInfoActions,basicInfo successCallback failCallback
export function handleToNextStepMain(commitObj,props){//逆操作修改 跳转页面

    var {router,location, menuActions, classifyMenuInfo,basicInfoActions,basicInfo, successCallback,failCallback } = props;

    let instanceSubmitManager = InstanceSubmitManager.getInstance();

    var success = function(){

            var { curMenuInfo } = classifyMenuInfo;
            var menuInfo = $.extend( true, {}, curMenuInfo );
            menuActions.nextCurMenu( classifyMenuInfo );
            var url = getDistanceStepUrlByMenuInfo( menuInfo, 1 );

            var query = location && location.query || {};

            router.push({
                pathname: url,
                query,
            });
            successCallback&&successCallback();
        },
        fail = function(){
            failCallback&&failCallback();
        };

    //var commitObj = {};
    var progress = getNextProgress( classifyMenuInfo );

    //let basicInfo = classifyBasicInfo;
    if(progress && progress != basicInfo["progress"]){
        basicInfo["progress"] = progress;
        basicInfoActions.updateBasicInfo(basicInfo);
        progress && ( commitObj["progress"] = progress );
    }

    instanceSubmitManager.postDataToServerIfStateChangedWithCommitObj( commitObj, success, fail, fail );
}




}
