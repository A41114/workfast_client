import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import './StatisticalReport.scss';
import {getAllRecruitment, DeleteRecruitmentService, UpdateStatusRecruitmentService, GetAppliedCv, UpdateAppliedCvStatus, GetStatisticsService} from '../../services/employerService'
import {toast} from "react-toastify"


import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRegular} from '@fortawesome/free-regular-svg-icons'
import {faSolid,faGlobe, faArrowLeft,faArrowRight,faPersonCircleExclamation,faPersonCircleQuestion,faPersonCircleCheck,faPersonCircleXmark,
        faUserClock,faUserGroup,faUserTie,faUserSlash} from '@fortawesome/free-solid-svg-icons'
import {useState} from 'react'

import '../Candidate/ModalCvInfo'
import ModalCvInfo from '../Candidate/ModalCvInfo';




class StatisticalReport extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            recruitmentArr:'',
            userInfo:'',
            status:['Đợi xác nhận', 'Chờ phỏng vấn', 'Được nhận', 'Bị loại'],

            recruitmentId:'',

            cvDetail:'',
            isOpenModalCvInfo:false,
            previewImg:'',
            
            statistics:'',
            

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
            let resRecruitment = await getAllRecruitment(userId)         
            let resStatistics = await GetStatisticsService(resRecruitment.data[0].id)
            // console.log('resStatitics: ',resStatistics.statisticsPercentage)

            this.setState({
                recruitmentArr : resRecruitment.data,
                recruitmentId : resRecruitment.data[0].id,
                statistics:resStatistics.statistics,
            })
        } catch (e) {
            console.log(e)
        }
    }
    
    //get id from title
    // handleGetIdFromTitle=(title)=>{
    //     let id = ''
    //     for(let i = 0;i<title.length;i++){
    //         if(title[i]==='-'){
    //             break;
    //         }
    //         else{
    //             id+=title[i]
    //         }
    //     }
    //     return id;
    // }
    //Change recruitment
    handleOnChangeRecruitment=async(event)=>{
        //console.log('id: ',id)

        let resStatistics = await GetStatisticsService(event.target.value)
        
        this.setState({
            recruitmentId :event.target.value,
            statistics:resStatistics.statistics,
        })
    }
    

    render() {
        let recruitmentArr = this.state.recruitmentArr
        console.log('recruitmentArr: ',recruitmentArr)
        console.log('states: ',this.state)



        return (
            <div className='statistical-report-content'>

                <ModalCvInfo
                isOpen={this.state.isOpenModalCvInfo}
                
                cvDetailFromParent={this.state.cvDetail}
                toggleFromParent={this.toggleModalCvInfo}
                previewImgFromParent={this.state.previewImg}
                // RecruitmentDetail={this.state.RecruitmentDetail}
                />
                <div className='select-cv-container'>
                    <label className='choose-cv-title'>Tin tuyển dụng</label>
                    <select className='form-control choose-cv'
                    onChange={(event)=>this.handleOnChangeRecruitment(event)}
                    value={this.state.salary}
                    >
                    {recruitmentArr&&recruitmentArr.length>0&&
                        recruitmentArr.map((item, index)=>{
                        return(
                            <option key={index} value={item.id}>{item.title}</option>
                        )
                        })
                    }
                    </select>
                    <a href={'http://localhost:3000/recruitment-detail/'+this.state.recruitmentId} target="_blank">Xem tin tuyển dụng</a>
                </div>
                <table id="TableStatisticalReport">
                        <tbody>
                            <tr>
                            <th>Trạng thái</th>
                            <th>Số lượng</th>
                            
                            <th>Tỷ lệ</th>
                            </tr>
                            { this.state.statistics && this.state.statistics.map((item, index)=>{
                                return(
                                    <tr key={index}>
                                        {index===0&&<td ><FontAwesomeIcon className='btn-process active' icon={faUserClock}/> {this.state.status[index]}</td>}
                                        {index===1&&<td><FontAwesomeIcon className='btn-process active' icon={faUserGroup}/> {this.state.status[index]}</td>}
                                        {index===2&&<td><FontAwesomeIcon className='btn-pass active' icon={faUserTie}/> {this.state.status[index]}</td>}
                                        {index===3&&<td><FontAwesomeIcon className='btn-fail active' icon={faUserSlash}/> {this.state.status[index]}</td>}
                                        <td>{item[0].count}</td>
                                        <td>{item[1].percentage}%</td>
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

export default connect(mapStateToProps, mapDispatchToProps)(StatisticalReport);
