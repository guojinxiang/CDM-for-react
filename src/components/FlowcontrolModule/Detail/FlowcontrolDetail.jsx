//流控详情页面
import React from 'react';
import {Row, Col, Icon, Card, Table} from 'antd';
import DraggableModule from "components/DraggableModule/DraggableModule";
import {getFlowcontrolDetailUrl} from 'utils/request-urls';
import {FlowcontrolUtil} from 'utils/flowcontrol-data-util';
import {formatTimeString, getDayTimeFromString} from "utils/basic-verify";
import {request} from 'utils/request-actions';
import { convertFlowcontrolData } from 'utils/flowcontrol-data-util';
import './FlowcontrolDetail.less';

class FlowcontrolDetail extends React.Component {
    constructor(props) {
        super(props);
        this.getFlowcontrolDetail = this.getFlowcontrolDetail.bind(this);
        this.handleFlowcontrolDetailData = this.handleFlowcontrolDetailData.bind(this);
        this.convertFlowcontrolData = convertFlowcontrolData.bind(this);
        this.converFlowRecords = this.converFlowRecords.bind(this);
        this.getColums = this.getColums.bind(this);
        this.batchFormattingTime = this.batchFormattingTime.bind(this);

        this.state = {}
    }

    // 获取流控详情数据
    getFlowcontrolDetail() {
        const {loginUserInfo, id, placeType} = this.props;
        const {userId} = loginUserInfo;

        // 获取参数
        let params = {
            userId,
            flowcontrol: {
                id,
                placeType
            }
        };
        // 发送请求并指定回调方法
        request(getFlowcontrolDetailUrl, 'POST', JSON.stringify(params), this.handleFlowcontrolDetailData);
    }

    // 处理流控详情数据
    handleFlowcontrolDetailData(res) {
        // 取响应结果中的流控数据
        if (res) {
            const { flow, flowRecords } = res;
            // 转换流控信息数据
            const flowFormatDatas = this.convertFlowcontrolData( flow );
            this.setState({
                ...flowFormatDatas
            });
            // 转换流控协调记录数据
            this.converFlowRecords( flowRecords );
        }
    }

    //批量格式化
    batchFormattingTime(array) {
        if(!array){
            return '';
        }
        let arr = array.split(',');
        arr = arr.map((item) => {
            return getDayTimeFromString(item)
        });
        return arr.join(',');
    };

    // 转换流控协调记录数据
    converFlowRecords( flowRecords ){

        // 转换协调类型
       const setType =(record) => {
            const { type } = record;
            let res = '';
            if(type == 'PUBLISH'){
                res = '发布'
            }else if(type == 'TIME_SEGMENT'){
                res = '二类放行'
            }else if(type == 'RESERVE_SLOT'){
                res = '预留时隙'
            }else if(type == 'COMPRESS_STRATEGY'){
                res = '压缩窗口'
            }else if(type == 'TERMINATE'){
                res = '人工终止'
            }else if(type == 'UPDATE'){
                res = '修改'
            }else if(type == 'STOP'){
                res = '系统终止'
            }else if(type == 'PER_TERMINATE'){
                res = '即将终止'
            }else if(type == 'FINISHED'){
                res = '正常结束'
            }else if(type == 'ADJUST_SYSTEM_STATUS'){
                res = '系统维护'
            }
            return res;
        };
        // 转换协调状态
       const setRecordStatus =(record) => {
            const { status } = record;
            let res = '';
            if(status == 'PUBLISH'){
                res = '发布'
            }else if(status == 'UPDATE'){
                res = '修改'
            }else if(status == 'STOP'){
                res = '停止'
            }else if(status == 'ADJUST'){
                res = '调整'
            }
            return res;
        };
       // 转换协调前数值
       const setPrevious =(record) => {
           const { type, originalValue, originalId } = record;
           let res = '';
           if(type == 'COMPRESS_STRATEGY' ){ // 压缩窗口
                if(originalValue){
                    const val = originalValue.split('#')[0];
                    if(val == 'PART'){
                        res = '公司申请变更'
                    }else if(val == 'ALL'){
                        res = '公司申请变更'
                    }else if(val == 'NONE'){
                        res = '公司申请变更'
                    }
                }
           }else if(type == 'UPDATE'){ // 修改
               res = `${originalValue}(${originalId})`
           }else if(type == 'RESERVE_SLOT'){ // 预留时隙
               res = this.batchFormattingTime(originalValue);
           }else if(type == 'TIME_SEGMENT'){ // 二类放行
               res = this.batchFormattingTime(originalValue);
           }else if(originalValue == 'PUBLISH'){ //
               res = '已发布'
           }else if(originalValue == 'FUTURE'){
               res = '将要执行'
           }else if(originalValue == 'RUNNING'){
               res = '正在执行'
           }else if(originalValue == 'PRE_PUBLISH'){
               res = '窗口期预发布'
           }else if(originalValue == 'PRE_UPDATE'){
               res = '窗口期预修改'
           }else if(originalValue == 'PRE_TERMINATED'){
               res = '窗口期预终止'
           }else if(type == 'ADJUST_SYSTEM_STATUS'){ // 系统维护
               res = `${originalValue}(${originalId})`
           }
           return res;
       };

       // 转换协调后数值
       const setCoordinated = (record) => {
           const { type, value, imitativeId } = record;
           let res = '';
           if(type == 'COMPRESS_STRATEGY' ){ // 压缩窗口
               if(value){
                   const val = value.split('#')[0];
                   if(val == 'PART'){
                       res = '公司申请变更'
                   }else if(val == 'ALL'){
                       res = '公司申请变更'
                   }else if(val == 'NONE'){
                       res = '公司申请变更'
                   }
               }
           }else if(type == 'PUBLISH' || type == 'UPDATE'){ // 发布或修改
               res =  `${value}(${imitativeId})`
           }else if(type == 'RESERVE_SLOT'){ // 预留时隙
               res = this.batchFormattingTime(value);
           }else if(type == 'TIME_SEGMENT'){ // 二类放行
               res = this.batchFormattingTime(value);
           }else if(value == 'STOP'){ //
               res = '系统终止'
           }else if(value == 'FINISHED'){
               res = '正常结束'
           }else if(value == 'TERMINATED'){
               res = '人工终止'
           }else if(value == 'PUBLISH'){
               res = '已发布'
           }else if(value == 'FUTURE'){
               res = '将要执行'
           }else if(value == 'RUNNING'){
               res = '正在执行'
           }else if(value == 'PRE_PUBLISH'){
               res = '即将发布'
           }else if(value == 'PRE_UPDATE'){
               res = '即将修改'
           }else if(value == 'PRE_TERMINATED'){
               res = '即将终止'
           }else if(value == 'DISCARD'){
               res = '已废弃'
           }else if(type == 'ADJUST_SYSTEM_STATUS'){ // 系统维护
               res =  `${value}(${imitativeId})`
           }
           return res;
       };


        const converRecord = (record) => {
            // id
            let id = record.id;

            let fid = record.fid || '';
            // 协调类型
            let type = setType(record);
            // 协调状态
            let status = setRecordStatus(record);
            // 协调时间
            let timesTamp = record.timesTamp || '';
            // 协调用户
            let username = record.username || '';
            // 协调用户中文
            let usernamezh = (username == 'FlOWMAINTAINCE') ? '流控维护程序' : record.usernamezh || '';
            // 协调用户IP
            let ipAddress = record.ipAddress || '';
            // 协调备注
            let comment = record.comment || '';
            // 协调前
            let previous = setPrevious(record);
            // 协调后
            let coordinated = setCoordinated(record);
            return {
                id,
                type,
                status,
                timesTamp,
                usernamezh,
                ipAddress,
                comment,
                previous,
                coordinated
            }
        };

        let records = [];
        if( Object.keys(flowRecords).length > 0 ){
            flowRecords.map((item) =>{
                records.push(converRecord(item));
            });
        }

        this.setState({
            flowRecords : records
        })
    };
    // 协调记录表格列
    getColums(){

        //时间格式化
        const columnsTimeFormat = (value, row, index) => {
            //格式化后的value值
            const formatValue = getDayTimeFromString( value ) || "";
            //title值
            const title = formatTimeString(value) || "";

            return {
                children: formatValue,
                props:{
                    title: title
                }
            }
        };

       let columns = [
            {
                title: "协调类型	",
                dataIndex: "type",
                align: 'center',
                key: "type",
                width: 100
            },{
                title: "协调前",
                dataIndex: "previous",
                align: 'center',
                key: "previous",
                width: 100
            },{
                title: "协调后",
                dataIndex: "coordinated",
                align: 'center',
                key: "coordinated",
                width: 100
            },{
                title: "协调备注",
                dataIndex: "comment",
                align: 'center',
                key: "comment",
                width: 100
            },{
                title: "协调状态",
                dataIndex: "status",
                align: 'center',
                key: "status",
               width: 100
            },{
                title: "协调时间",
                dataIndex: "timesTamp",
                align: 'center',
                key: "timesTamp",
                render: columnsTimeFormat,
               width: 100
            },{
                title: "协调用户",
                dataIndex: "usernamezh",
                align: 'center',
                key: "usernamezh",
               width: 100
            },{
                title: "协调用户IP",
                dataIndex: "ipAddress",
                align: 'center',
                key: "ipAddress",
               width: 100
            },
        ];
        return columns;
    }
    componentDidMount() {
        // 获取流控详情数据
        this.getFlowcontrolDetail()
    }

    render() {
        const {titleName, clickCloseBtn, width = 800, dialogName, x, y } = this.props;
        const {
            name, id, effectiveTime, flowStatus, flowStatusClassName, source, placeType, publishUser, originalPublishUnit,
            type, value, reason, controlPoints, flowcontrolDirection, controlDepDirection,controlDirection, flowcontrolType,
            exemptDepDirection, exemptDirection, controlLevel, reserveSlots, startTime, endTime, generateTime,
            lastModifyTime, startFlowCasaTime, compressAtStartStrategy, compressAtStartWinStart, compressAtEndWinEnd,
            comments, flowRecords} = this.state;
        const Layout1 = {span: 1};
        const Layout2 = {span: 2};
        const Layout3 = {span: 3};
        const Layout4 = {span: 4};
        const Layout8 = {span: 8};
        const Layout18 = {span: 18};
        const Layout24 = {span: 24};
        const columns = this.getColums();
        return (
            <DraggableModule
                bounds=".root"
                x = {x}
                y = {y}
            >
                <div className="box center no-cursor" style={{width: width}}>
                    <div className="dialog">
                        {/* 头部*/}
                        <Row className="title drag-target cursor">
                            <span>{ titleName }</span>
                            <div
                                className="close-target"
                                onClick={ (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    clickCloseBtn(dialogName);
                                } }
                            >
                                <Icon type="close" title="关闭"/>
                            </div>
                        </Row>
                        {/* 表单内容*/}
                        <Row className="content flowcontol-detail">
                            <Col {...Layout24}>
                                <Row>
                                    <Col {...Layout24} className="head">
                                        <h1 className="name">{ name }</h1>
                                        <div className="effective-time">生效时间:{effectiveTime}</div>
                                        <div className={ flowStatusClassName ? `status ${flowStatusClassName}` : 'status'}>{flowStatus}</div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} >
                                        <Row>
                                            <Col className="description">基本信息</Col>
                                        </Row>
                                        <Row className="sub-content">
                                            <Col {...Layout24}>
                                                <Col {...Layout4}>
                                                    <div className="trem">流控名称</div>
                                                </Col>
                                                <Col {...Layout8}>
                                                    <div className="detail">{ `${name}(${id})` }</div>
                                                </Col>
                                                <Col {...Layout4}>
                                                    <div className="trem">来源</div>
                                                </Col>
                                                <Col {...Layout4}>
                                                    <div className="detail">{source}</div>
                                                </Col>
                                                <Col {...Layout2}>
                                                    <div className="trem">类型</div>
                                                </Col>
                                                <Col {...Layout2}>
                                                    <div className="detail">{placeType}</div>
                                                </Col>
                                            </Col>
                                            <Col {...Layout24}>
                                                <Col {...Layout4}>
                                                    <div className="trem">发布用户</div>
                                                </Col>
                                                <Col {...Layout8}>
                                                    <div className="detail">{ publishUser }</div>
                                                </Col>
                                                <Col {...Layout4}>
                                                    <div className="trem">原发布单位</div>
                                                </Col>
                                                <Col {...Layout4}>
                                                    <div className="detail">{ originalPublishUnit }</div>
                                                </Col>
                                                <Col {...Layout1}>
                                                    <div className=""></div>
                                                </Col>
                                                <Col {...Layout3}>
                                                    <div className="detail">{ flowcontrolType }</div>
                                                </Col>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} >
                                        <Row>
                                            <Col className="description">限制时间 </Col>
                                        </Row>
                                        <Row type="flex" justify="start" className="sub-content">
                                            <Col {...Layout4}>
                                                <div className="trem">开始时间</div>
                                            </Col>
                                            <Col {...Layout8}>
                                                <div className="detail">{ startTime }</div>
                                            </Col>
                                            <Col {...Layout4}>
                                                <div className="trem">结束时间</div>
                                            </Col>
                                            <Col {...Layout8}>
                                                <div className="detail">{ endTime }</div>
                                            </Col>
                                            <Col {...Layout4}>
                                                <div className="trem">创建时间</div>
                                            </Col>
                                            <Col {...Layout8}>
                                                <div className="detail">{ generateTime }</div>
                                            </Col>
                                            <Col {...Layout4}>
                                                <div className="trem">修改时间</div>
                                            </Col>
                                            <Col {...Layout8}>
                                                <div className="detail">{ lastModifyTime }</div>
                                            </Col>
                                            <Col {...Layout4}>
                                                <div className="trem">纳入计算时间</div>
                                            </Col>
                                            <Col {...Layout8}>
                                                <div className="detail">{ startFlowCasaTime }</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} >
                                        <Row>
                                            <Col className="description">限制类型 </Col>
                                        </Row>
                                        <Row type="flex" justify="start" className="sub-content">
                                            <Col {...Layout4}>
                                                <div className="trem">限制类型</div>
                                            </Col>
                                            <Col {...Layout8}>
                                                <div className="detail">{ type }</div>
                                            </Col>
                                            <Col {...Layout4}>
                                                <div className="trem">限制数值</div>
                                            </Col>
                                            <Col {...Layout8}>
                                                <div className="detail">{ value }</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} >
                                        <Row>
                                            <Col className="description">限制方向</Col>
                                        </Row>
                                        <Row type="flex" justify="start" className="sub-content">
                                            <Col {...Layout4}>
                                                <div className="trem">受控航路点</div>
                                            </Col>
                                            <Col {...Layout8}>
                                                <div className="detail">{ controlPoints }</div>
                                            </Col>
                                            <Col {...Layout4}>
                                                <div className="trem">受控方向</div>
                                            </Col>
                                            <Col {...Layout8}>
                                                <div className="detail">{ flowcontrolDirection }</div>
                                            </Col>
                                            <Col {...Layout4}>
                                                <div className="trem">受控起飞机场</div>
                                            </Col>
                                            <Col {...Layout8}>
                                                <div className="detail">{ controlDepDirection }</div>
                                            </Col>
                                            <Col {...Layout4}>
                                                <div className="trem">豁免起飞机场</div>
                                            </Col>
                                            <Col {...Layout8}>
                                                <div className="detail">{ exemptDepDirection }</div>
                                            </Col>
                                            <Col {...Layout4}>
                                                <div className="trem">受控降落机场</div>
                                            </Col>
                                            <Col {...Layout8}>
                                                <div className="detail">{ controlDirection }</div>
                                            </Col>
                                            <Col {...Layout4}>
                                                <div className="trem">豁免降落机场</div>
                                            </Col>
                                            <Col {...Layout8}>
                                                <div className="detail">{ exemptDirection }</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} >
                                        <Row>
                                            <Col className="description">限制高度 </Col>
                                        </Row>
                                        <Row type="flex" justify="start" className="sub-content">
                                            <Col {...Layout4}>
                                                <div className="trem">限制高度</div>
                                            </Col>
                                            <Col {...Layout18}>
                                                <div className="detail">{ controlLevel }</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} >
                                        <Row>
                                            <Col className="description">限制原因 </Col>
                                        </Row>
                                        <Row type="flex" justify="start" className="sub-content">
                                            <Col {...Layout4}>
                                                <div className="trem">限制原因</div>
                                            </Col>
                                            <Col {...Layout18}>
                                                <div className="detail">{ reason }</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} >
                                        <Row>
                                            <Col className="description">预留时隙 </Col>
                                        </Row>
                                        <Row type="flex" justify="start" className="sub-content">
                                            <Col {...Layout4}>
                                                <div className="trem">时隙时间</div>
                                            </Col>
                                            <Col {...Layout18}>
                                                <div className="detail">{ reserveSlots }</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} >
                                        <Row>
                                            <Col className="description">预锁航班时隙变更策略 </Col>
                                        </Row>
                                        <Row type="flex" justify="start" className="sub-content">
                                            <Col {...Layout4}>
                                                <div className="trem">变更策略</div>
                                            </Col>
                                            <Col {...Layout8}>
                                                <div className="detail">{ compressAtStartStrategy }</div>
                                            </Col>
                                            <Col {...Layout4}>
                                                <div className="trem">压缩时间范围</div>
                                            </Col>
                                            <Col {...Layout8}>
                                                <div className="detail">{ compressAtStartWinStart ? `${compressAtStartWinStart} ~ ${compressAtEndWinEnd}` : '' }</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} >
                                        <Row>
                                            <Col className="description">备注信息 </Col>
                                        </Row>
                                        <Row type="flex" justify="start" className="sub-content">
                                            <Col {...Layout4}>
                                                <div className="trem">备注</div>
                                            </Col>
                                            <Col {...Layout18}>
                                                <div className="detail">{ comments }</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col {...Layout24} >
                                        <Row>
                                            <Col className="description">协调记录 </Col>
                                        </Row>
                                        <Row type="flex" justify="start" className="sub-content">
                                            <Col {...Layout24}>
                                                <Table
                                                    columns={ columns }
                                                    dataSource={ flowRecords }
                                                    size="small"
                                                    pagination = { false }
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                    </div>
                </div>
            </DraggableModule>
        )
    }
}
;

export default FlowcontrolDetail ;