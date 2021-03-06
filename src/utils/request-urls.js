const host = "http://192.168.243.187:28180";
// 用户登录
const loginUrl = `${host}/userLogon.bo`;
// 用户登出
const logoutUrl = `${host}/userLogout.bo`;
//获取系统参数
const getSystemConfigUrl = `${host}/retrieveSystemConfig.bo`;
//获取用户配置数据
const getUserPropertyUrl = `${host}/retrieveNeedBasicParam.bo`;
//获取全部航班数据
const getAllAirportsUrl = `${host}/retrieveAirportFlights.bo`;
//根据航班id获取单条航班数据
const getSingleAirportUrl = `${host}/retrieveFlightDetailById.bo`;
//根据航班id获取单条航班协调记录数据
const getSingleCollaborateRecordUrl = `${host}/retrieveRecordById.bo`;
//根据航班id获取前段航班信息
const getSingleFormerFlightUrl = `${host}/retrieveFormerFlightById.bo`;
//指定前序航班
const updateFormerFlightUrl = `${host}/updateFormerFlight.bo`;
//通过流控ID获取流控影响航班信息
const retrieveFlowcontrolImpactFlightsUrl = `${host}/retrieveFlowcontrolImpactFlights.bo`;

const flowcontrolHost = "http://192.168.243.120:38181";
//获取全部流控信息
const getFlowcontrolUrl = `${flowcontrolHost}/flow/retrieveFlowcontrols.action`;
// 根据流控ID获取流控信息
const getFlowcontrolByIdUrl = `${flowcontrolHost}/flow/retrieveFlowcontrolById.action`;
// 获取流控信息详情
const getFlowcontrolDetailUrl = `${flowcontrolHost}/flow/retrieveflowcontrolDetail.action`;
//依据用户名获取流控模板
const getFlowcontrolTemplateUrl = `${flowcontrolHost}/flowTemplate/retrieveByUsername`;

//依据机场获取流控点(受控点)数据
const getPointByAirportUrl = `${flowcontrolHost}/flowcontrolPoints/retrievePointsByAirport.action`;
// 发布流控
const publishFlowcontrolUrl = `${flowcontrolHost}/flow/publish.action`;
// 修改流控
const updateFlowcontrolUrl = `${flowcontrolHost}/flow/update.action`;
// 终止流控
const terminateFlowcontrolUrl = `${flowcontrolHost}/flow/terminate.action`;

// 获取通告信息
const getNoticeUrl = `${host}/retrieveNoticeInformation.bo`;
// 通告详情
const getNoticeDetailUrl = `${host}/retrieveNoticeInformationById.bo`;
// 获取限制信息
const getRestrictionUrl = `${host}/retrieveRestriction.bo`;
// 获取限制信息详情
const getRestrictionDetailUrl = `${host}/retrieveRestrictionById.bo`;


export {
    host,
    loginUrl, logoutUrl,
    getSystemConfigUrl, getUserPropertyUrl,
    getAllAirportsUrl, getSingleAirportUrl, getSingleCollaborateRecordUrl, getSingleFormerFlightUrl, updateFormerFlightUrl,
    getFlowcontrolUrl, getNoticeUrl,
    getPointByAirportUrl, getRestrictionUrl,
    publishFlowcontrolUrl, updateFlowcontrolUrl, getFlowcontrolTemplateUrl, getFlowcontrolByIdUrl,
    getFlowcontrolDetailUrl, terminateFlowcontrolUrl, retrieveFlowcontrolImpactFlightsUrl, getNoticeDetailUrl, getRestrictionDetailUrl,
};