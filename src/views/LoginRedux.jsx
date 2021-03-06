//action-type
const UPDATE_USERINFO = 'loginUserInfo/update';
const UPDATE_SYSTEMCONFIG = 'systemConfig/update';
const UPDATE_FLOWCONTROL_PARAMS = 'flowcontrolParams/update';
const USER_LOGOUT = 'userLogout';

//action-creator
//存储用户信息（用户名  密码）
const updateUserInfo = userObj => ({
    type: UPDATE_USERINFO,
    userObj
})

//用户登出
const userLogout = userObj => ({
    type: USER_LOGOUT,
    userObj
})

//reducer user info
const obj = {
    username: '', // 用户名
    loginStatus: false, // 是否已登录
    userId :'', // 用户Id
    errmsg: '', // 登录失败信息
    allAuthority : [], // 用户权限集合
    airports: '', // 用户机场
    description: '', // 用户中文名
    deiceGroupName: '', // 除冰分组
}
const loginUserInfo = ( state = obj, action ) => {
    switch( action.type ){
        case UPDATE_USERINFO:{
            const { userObj = {} } = action;
            return {
                ...state,
                username: userObj.username || '',
                password: userObj.password || '',
                loginStatus: userObj.loginStatus || '',
                userId : userObj.userId || '',
                errmsg: userObj.errmsg || '',
                allAuthority: userObj.allAuthority || [],
                airports: userObj.airports || '',
                description: userObj.description || '',
                deiceGroupName: userObj.deiceGroupName || '',
            }
        }
        case USER_LOGOUT:{
            return obj
        }
        default:
            return state;
    }
}


//存储系统参数配置
const updateSystemConfig = configObj => ({
    type: UPDATE_SYSTEMCONFIG,
    configObj
})

//reducer system config
const config = {
    system: '', // 所属系统
    systemAirport: '', // 属性系统机场
    systemElem: '', //
    systemName: '', // 系统名称
}

const systemConfig = ( state = config, action ) => {
    switch( action.type ){
        case UPDATE_SYSTEMCONFIG:{
            return {
                ...state,
                system: action.configObj.system ||'',
                systemAirport: action.configObj.systemAirport ||'',
                systemElem: action.configObj.systemElem || '',
                systemName: action.configObj.systemName ||'',
            }
        }
        default:
            return state;
    }
}


//存储获取流控数据请求中所需参数
const updateFlowcontrolParams = paramObj => ({
    type: UPDATE_FLOWCONTROL_PARAMS,
    paramObj
})

//reducer system config
const params = {
    startWaypoints : '', // 用户关注机场,即开始点
    waypoints : '', // 用户关注受控点
    system : '', // 用户所属平台
    systemProgram : '' // 用户所属平台分组
}

const flowcontrolParams = ( state = params, action ) => {
    switch( action.type ){
        case UPDATE_FLOWCONTROL_PARAMS:{
            return {
                ...state,
                startWaypoints: action.paramObj.startWaypoints ||'',
                waypoints: action.paramObj.waypoints ||'',
                system: action.paramObj.system || '',
                systemProgram: action.paramObj.systemProgram ||'',
            }
        }
        default:
            return state;
    }
}



export { updateUserInfo, loginUserInfo, updateSystemConfig, systemConfig, updateFlowcontrolParams, flowcontrolParams, userLogout}