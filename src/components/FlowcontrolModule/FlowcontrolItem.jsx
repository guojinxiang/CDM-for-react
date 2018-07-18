//流控信息---菜单操作功能

import React from 'react';
import { Row, Col, Icon } from 'antd';
import './FlowcontrolItem.less';
import { convertFlowcontrolData } from '../../utils/flowcontrol-data-util';

class FlowcontrolItem extends React.Component{
    constructor( props ){
        super(props);

    }


    render(){
        const { data, generateTime } = this.props;
        const { indexNumber} = this.props;
        const formatData = convertFlowcontrolData(data,generateTime);
        const { name, id, publishUserZh, reason, placeType,
            status, statusClassName, controlPoints, type, value, controlDirection,
            effectiveTime, effectiveDate, casaStatus,
        } = formatData;
        return (
            <Col span={24} className="flow-item">
                <Row className="title">
                    <Col span={12} className={ statusClassName ? `${statusClassName} status` : 'status'}
                         title={ `流控名称:${name}  ${status} ${casaStatus}`}
                    >
                        <span className="number" >{indexNumber}</span>
                        {name}
                        {/*<div className={ statusClassName ? `${statusClassName} status` : 'status'} >*/}
                            {/**/}
                            {/**/}
                            {/*/!*<span className="place-type">{placeType}</span>*!/*/}

                            {/*/!*<span className="calculate-status" >*!/*/}
                                {/*/!*<Icon type="loading" />*!/*/}
                            {/*/!*</span>*!/*/}
                        {/*</div>*/}
                    </Col>
                    <Col  span={4} className="place-type" title={placeType ? `${placeType}流控`: ''} >{placeType}</Col>
                    <Col  span={8} className="effective-time" title={effectiveDate ? `${effectiveDate}`: ''} >
                        生效时间: {effectiveTime}
                    </Col>

                </Row>

                <Row className="row">
                    <Col span={4} >限制类型</Col>
                    <Col span={4} >限制数值</Col>
                    <Col span={6} >受控航路点</Col>
                    <Col span={6} >受控降落机场</Col>
                    <Col span={4} >原因</Col>
                </Row>
                <Row className="row value">
                    <Col span={4} className="type" title={type ? `限制类型:${type}` : ''}>{type}</Col>
                    <Col span={4} className="value" title={ value ? `限制数值:${value}` : '' }> { value } </Col>
                    <Col span={6} className="points" title={controlPoints ? `受控航路点${controlPoints}` : ''}>{controlPoints}</Col>
                    <Col span={6} className="control-direction" title={controlDirection ? `受控降落机场:${controlDirection}`: '' }>{controlDirection}</Col>
                    <Col span={4} className="reason" title={reason ? `原因:${reason}` : ''}>{reason}</Col>
                </Row>
                <Row className="row operator">
                    <Col span={24}>
                        <a href="javascript:;">详情</a>
                        <a href="javascript:;">影响</a>
                        <a href="javascript:;">修改</a>
                        <a href="javascript:;">终止</a>
                    </Col>

                </Row>
            </Col>




        )
    }
};

export default FlowcontrolItem;