export const path = {
    drug: {
    /*-------- 药物查询 ---------*/
        // 影响驾驶能力药物及不良反应
        queryListXH: "/platform-api/Platform/services/yxjsyaowu/queryList",
        // 药物相互作用影响驾驶能力查询
        queryListYW: "/platform-api/Platform/services/yaowuxhzy/queryList",
    /*-------- 药物查询 end ---------*/
    /*-------- 药物维护 ---------*/
        // 影响驾驶能力药物分页
        yxjsyaowu:"/platform-api/Platform/services/yxjsyaowu/pageYaowu",
        add:"/platform-api/Platform/services/yxjsyaowu/add",
        update:"/platform-api/Platform/services/yxjsyaowu/update",
        delete:"/platform-api/Platform/services/yxjsyaowu/delete",
        // 影响驾驶能力药不良反应查询
        queryListFy: "/platform-api/Platform/services/buLiangFy/queryList",
        // 影响驾驶能力药物分类查询
        queryListYw: "/platform-api/Platform/services/yaowuFl/queryList",
        downYaowuExcel:"/platform-api/Platform/services/yxjsyaowu/downYaowuExcel",
        modifyPassword: "/platform-api/user/modifyPassword",
    /*-------- 药物维护 end ---------*/

    /*-------- 药物相互作用 ---------*/
        pageXianghuzy:"/platform-api/Platform/services/yaowuxhzy/pageXianghuzy",
        addXianghuzy:"/platform-api/Platform/services/yaowuxhzy/add",
        updateXianghuzy:"/platform-api/Platform/services/yaowuxhzy/update",
    /*-------- 药物相互作用 end ---------*/
    },
    group: {
        list: '/platform-api/Platform/services/troopsOrg/list',
        addOrg: '/platform-api/Platform/services/troopsOrg/insertOrg',
        updateOrg: '/platform-api/Platform/services/troopsOrg/updateOrg',
        deleteOrg: '/platform-api/Platform/services/troopsOrg/deleteOrg'　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　
    },

    log: {
        list: '/platform-api/log/list'
    },
    menu: {
        init: '/platform-api/config/sysmenu',
        listTreeTable: '/platform-api/menu/listTreeTable',
        list: '/platform-api/menu/listAll',
        add: '/platform-api/menu/add',
        delete: '/platform-api/menu/del',
        update: '/platform-api/menu/update',
        userRoleListTreeTable: '/platform-api/menu/userRoleListTreeTable'
    },
    login: {
        login: '/platform-api/login/ajaxLogin',
        logout: '/platform-api/login/ajaxLogout',
        getKey: '/platform-api/login/getKey',
        getVerifyCodeConfig: '/platform-api/login/getVerifyCodeConfig',
        getVerifyCodeImage: '/platform-api/login/getVerifyCodeImage'
    },
    org: {
        query: '/platform-api/org/query',
        add: '/platform-api/org/add',
        update: '/platform-api/org/update',
        delete: '/platform-api/org/delete'
    },
    role: {
        add: '/platform-api/role/add',
        update: '/platform-api/role/update',
        delete: '/platform-api/role/delete',
        page: '/platform-api/role/pageList',
        getRoleType: '/platform-api/role/getRoleType',
        getAuth: '/platform-api/role/getAuth',
        auth: '/platform-api/role/auth'
    },
    user: {
        pageUser: '/platform-api/user/pageUser',
        save: '/platform-api/user/save',
        update: '/platform-api/user/update',
        orgTree: '/platform-api/user/orgTree',
        listRoles: '/platform-api/user/listRoles',
        delete: '/platform-api/user/delete',
        roles: '/platform-api/user/roles',
        listRoleByUser: '/platform-api/user/listRoleByUser'
    },
    config: {
        page: '/platform-api/config/page',
        add: '/platform-api/config/add',
        update: '/platform-api/config/update',
        delete: '/platform-api/config/delete'
    },
    dept: {
        query: '/platform-api/dept/query',
        add: '/platform-api/dept/add',
        update: '/platform-api/dept/update',
        delete: '/platform-api/dept/delete',
        queryOrg: '/platform-api/dept/queryOrg'
    },
    todo: {
        page: '/platform-api/todo/listPage',
        getUser: '/platform-api/todo/getUser',
        getOrg: '/platform-api/todo/getOrg',
        add: '/platform-api/todo/addList',
        delete: '/platform-api/todo/delete'
    },
    home: {
        getNotRead: '/platform-api/home/getNotRead',
        read: '/platform-api/home/read'
    },
    message: {
        getList: '/platform-api/message/getList',
        read: '/platform-api/message/readMsg',
        delete: '/platform-api/message/deleteMsg',
        getNotReadList: '/platform-api/message/getNotReadList',
        getReadList: '/platform-api/message/getReadList',
        readAll: '/platform-api/message/readAllMsg',
        deleteAll: '/platform-api/message/deleteAllMsg'
    },
    timer: {
        page: '/platform-api/timer/page',
        add: '/platform-api/timer/add',
        update: '/platform-api/timer/update',
        delete: '/platform-api/timer/delete',
        updateStatus: '/platform-api/timer/updateStatus'
    },
    online: {
        page: '/platform-api/online/getOnline',
        kickout: '/platform-api/online/kickout'
    },
    whitelist: {
        page: '/platform-api/whitelist/page',
        update: '/platform-api/whitelist/update',
        add: '/platform-api/whitelist/add',
        delete: '/platform-api/whitelist/delete'
    },
    blacklist: {
        page: '/platform-api/blacklist/page',
        update: '/platform-api/blacklist/update',
        add: '/platform-api/blacklist/add',
        delete: '/platform-api/blacklist/delete'
    },

};
