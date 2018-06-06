import * as React from "react";

export interface IStepMenuProps {
}

export interface IStepMenuState {

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
export default class StepMenu extends React.Component<IStepMenuProps, IStepMenuState> {

    constructor(props: any) {
        super(props);
        this.state = {};

    }

    static defaultProps = {};

    render() {
        return null;
    }
}
