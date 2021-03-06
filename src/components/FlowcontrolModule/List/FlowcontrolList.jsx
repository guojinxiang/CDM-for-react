//流控信息---菜单操作功能

import React from 'react';
import { Row, Col } from 'antd';
import { getFlowcontrolUrl } from 'utils/request-urls';
import {  request } from 'utils/request-actions';

import QueueAnim from 'rc-queue-anim';

import FlowcontrolItem from "./FlowcontrolItem";
import './FlowcontrolList.less';

class FlowcontrolList extends React.Component{
    constructor( props ){
        super(props);
        this.getParams = this.getParams.bind(this);
        this.getFlowcontrolDatas = this.getFlowcontrolDatas.bind(this);
        this.handleUpdateFlowcontrolData = this.handleUpdateFlowcontrolData.bind(this);
        this.convertData = this.convertData.bind(this);
        this.state = {
            flowcontrolTimerId : 0
        };
    }
    // 拼接获取流控数据请求中所需参数
    getParams (){
        const { startWaypoints, waypoints, system, systemProgram} = this.props.flowcontrolParams;
        const { userId } = this.props;
        // 暂时取客户端当前日期
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        year = '' + year;
        month = month < 10 ? '0' + month : '' + month;
        day = day < 10 ? '0' + day : '' + day;
        let fullTime = year + month + day;

        const params = {
            "startTime": fullTime+"0000",
            "endTime":  fullTime+ "2359",
            "system": system,
            "systemProgram": systemProgram,
            "waypoints" : waypoints,
            "startWaypoints" : startWaypoints,
            "userId" : userId,
        };
        return params;
    }

    // 获取流控数据
    getFlowcontrolDatas(){
        // 获取参数
        let params = this.getParams();
        // 发送请求并指定回调方法
        request(getFlowcontrolUrl, 'POST', JSON.stringify(params), this.handleUpdateFlowcontrolData);
    }
    // 更新流控数据
    handleUpdateFlowcontrolData(res) {
        const {updateFlowcontrolDatas, updateFlowGenerateTime} = this.props;
        // 流控数据生成时间
        const {generateTime = ''} = res;
        // 更新流控数据生成时间
        updateFlowGenerateTime(generateTime);
        // 取流控数据
        const {result = {}, authMap = {} } = res;
        // 合并数据
        const flowDatas = this.convertData(result, authMap);

        // 更新流控数据
        updateFlowcontrolDatas(flowDatas);
        // 定时30秒后再次获取流控数据并更新
        const flowcontrolTimerId = setTimeout(() => {
            // 获取流控数据
            this.getFlowcontrolDatas();
        }, 30*1000);
        this.setState({
            flowcontrolTimerId
        });
    }
    // 将操作权限与流控数据合并
    convertData(dataMap,authMap) {
        let result = {};
        let map = Object.keys(dataMap);
        map.map((item,index) => {
            let auth = authMap[item];
            if(auth){
                result[item] = {...dataMap[item],auth}
            }
        });

        return result

    }

    // 立即调用
    componentDidMount(){
        // 获取流控数据
        this.getFlowcontrolDatas()
    }

    componentWillUnmount(){
        //清除定时器
        const { flowcontrolTimerId = 0} = this.state;
        clearTimeout( flowcontrolTimerId );
    }

    render(){
        // 流控数据
        const { flowcontrolViewMap = [], flowGenerateTime, systemConfig } = this.props;
        return (
            <Col span={24} className="flowcontrol-list">
                <Row className="flow-item-wrapper">
                    <QueueAnim delay={300} className="queue-simple">
                    {
                        flowcontrolViewMap.map((item,index) =>{
                            return (
                                    <FlowcontrolItem
                                        key={item.id}
                                        data = {item}
                                        indexNumber = { (index +1) }
                                        generateTime = { flowGenerateTime }
                                        systemConfig = { systemConfig }
                                    />
                            )
                        })
                    }
                    </QueueAnim>
                </Row>

            </Col>
        )
    }
};

export default FlowcontrolList;