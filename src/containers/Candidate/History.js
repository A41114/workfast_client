import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import './History.scss';
import {getAllRecruitment, DeleteRecruitmentService, UpdateStatusRecruitmentService, GetAppliedCv, UpdateAppliedCvStatus} from '../../services/employerService'
import {GetApplyHistory} from '../../services/candidateService'

import {toast} from "react-toastify"

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRegular} from '@fortawesome/free-regular-svg-icons'
import {faSolid,faGlobe, faArrowLeft,faArrowRight,faPersonCircleExclamation,faPersonCircleQuestion,faPersonCircleCheck,faPersonCircleXmark,
        faUserClock,faUserGroup,faUserTie,faUserSlash} from '@fortawesome/free-solid-svg-icons'
import {useState} from 'react'
import moment from 'moment';

import '../Candidate/ModalCvInfo'
import ModalCvInfo from '../Candidate/ModalCvInfo';
import Candidate from './Candidate';




class History extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            cvArr:'',

            cvDetail:'',
            isOpenModalCvInfo:false,
            previewImg:'',
            

        }
        
    }
    
    componentDidMount(){
        if(this.props.userInfo){
            this.getAllDataFromService(this.props.userInfo.id)
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.userInfo !== this.props.userInfo){
            this.getAllDataFromService(this.props.userInfo.id)
        }
    }
    getAllDataFromService=async(userId)=>{
        try {     
            let resCv = await GetApplyHistory(userId)

            this.setState({
                cvArr : resCv.cv,
            })
        } catch (e) {
            console.log(e)
        }
    }
    
    //toggle Modal cvInfo
    toggleModalCvInfo=()=>{ 
        this.setState({
            isOpenModalCvInfo : !this.state.isOpenModalCvInfo
        })
        console.log('states: ',this.state)
    }
    //modal cv info
    cvInfo=(item)=>{
        let imageBase64 = new Buffer(item.image,'base64').toString('binary')             
        this.setState({
            cvDetail:item,
            previewImg:imageBase64
        })
        this.toggleModalCvInfo()
    }

    render() {
        // console.log('states: ',this.state)

        return (
            <div className='apply-history-content'>
                <ModalCvInfo
                isOpen={this.state.isOpenModalCvInfo}
                cvDetailFromParent={this.state.cvDetail}
                toggleFromParent={this.toggleModalCvInfo}
                previewImgFromParent={this.state.previewImg}
                // RecruitmentDetail={this.state.RecruitmentDetail}
                />
                <div className='apply-history-title'>Lịch sử</div>
                <table id="TableApplyHistory">
                        <tbody>
                            <tr>
                            <th>Tên CV</th>
                            <th>Chi tiết CV</th>
                            <th>Đơn tuyển dụng</th>
                            <th>Trạng thái</th>
                            <th>Thời gian</th>
                            </tr>
                            { this.state.cvArr && this.state.cvArr.map((item, index)=>{
                                return(
                                    <tr key={index}>
                                        <td>{item.cvName}</td>
                                        <td><span className='cv-info-text' onClick={()=>this.cvInfo(item)}>Xem</span></td>
                                        <td><a href={'http://localhost:3000/recruitment-detail/'+item.recruitmentId} target="_blank">Xem tin tuyển dụng</a></td>
                                        <td>
                                            {item.value==='Đợi xác nhận'&&<div>
                                                    <button className={item.value==='Đợi xác nhận'?'btn-process active':'btn-process'}><FontAwesomeIcon icon={faUserClock}/></button>
                                                    <span>Đợi xác nhận</span>
                                                </div>
                                            }
                                            {item.value==='Chờ phỏng vấn'&&<div>
                                                    <button className={item.value==='Chờ phỏng vấn'?'btn-process active':'btn-process'}> <FontAwesomeIcon icon={faUserGroup}/> </button>
                                                    <span>Chờ phỏng vấn</span>
                                                </div>
                                            }
                                            {item.value==='Được nhận'&&<div>
                                                    <button className={item.value==='Được nhận'?'btn-pass active':'btn-pass'}> <FontAwesomeIcon icon={faUserTie}/></button>
                                                    <span>Được nhận</span>
                                                </div>
                                            }
                                            {item.value==='Bị loại'&&<div>
                                                <button className={item.value==='Bị loại'?'btn-fail active':'btn-fail'}><FontAwesomeIcon icon={faUserSlash}/></button>
                                                    <span>Bị loại</span>
                                                </div>
                                            }
                                        </td>
                                        <td>{moment(item.createdAt).format('DD/MM/YYYY')+' - '+moment(item.createdAt).format('hh:mm:ss A')}</td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                </table>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo : state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
