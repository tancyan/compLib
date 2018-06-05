import {RegMenu} from "../../typings/regMenu";
import IMenuInfo = RegMenu.IMenuInfo;
import IMenu = RegMenu.IMenu;
import {Util} from "../util/index";
export default class MenuUtil {
    static instance: MenuUtil;
    private menus: IMenu[];
    private urlPathsMap;
    util = new Util();

    static getInstance() {
        if ( !MenuUtil.instance ) {
            MenuUtil.instance = new MenuUtil();
        }
        return MenuUtil.instance;
    }
    // 初使化菜单配置
    setMenus(menus) {
        this.menus = menus;
    }
    getMenus() {
        return this.menus;
    }
    // 每个菜单对应路径的[id]列表
    getUrlPathsMap() {
        let urlPathsMap = this.urlPathsMap;
        if (!urlPathsMap) {
            const menus = this.getMenus();
            urlPathsMap = this.handleUrlPathsMap(menus);
            this.urlPathsMap = urlPathsMap;
        }
        return urlPathsMap;
    }

    /**
     * 根据地址栏url，推导出当前menu的openKeys selectedKeys
     * 调用之前需先初使化菜单哟
     * 主要场景用于，初使化菜单 stateTree
     * @returns {IMenuInfo}
     */
    getMenuKeysWithPathname() {
        const urlPathsMap = this.getUrlPathsMap();
        const pathname = this.util.getUrlRelativePath();
        let paths = urlPathsMap[ pathname ];
        paths = $.extend( true, [], paths );
        let selectedKeys = paths.pop();
        selectedKeys = [selectedKeys];
        const openKeys = paths;
        const menuInfo = { selectedKeys, openKeys} as IMenuInfo;
        return menuInfo;
    }

    handleUrlPathsMap( menus ) {
        const urlPathsMap = {};
        let i;
        const l = menus && menus.length || 0;
        let menuItemInfo;

        const walkTree = ( menuItem, paths, parentPaths ) => {
            const { subMenus, id, url } = menuItem;
            paths.push( id );
            parentPaths = $.extend( true, [], paths );

            let j;
            const l2 = subMenus && subMenus.length || 0;

            if ( l2 ) {
                for ( j = 0; j < l2; j++ ) {
                    paths = $.extend( true, [], parentPaths );
                    walkTree( subMenus[j], paths, parentPaths );
                }
            } else {
                urlPathsMap[url] = paths;
            }

        };

        for ( i = 0; i < l; i++ ) {
            menuItemInfo = menus[ i ];
            walkTree( menuItemInfo, [], [] );
        }

        return urlPathsMap;
    }

}
