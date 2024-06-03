import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import './AppliedCv.scss';
import {getAllRecruitment, DeleteRecruitmentService, UpdateStatusRecruitmentService, GetAppliedCv, UpdateAppliedCvStatus} from '../../services/employerService'
import {toast} from "react-toastify"


import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRegular} from '@fortawesome/free-regular-svg-icons'
import {faSolid,faGlobe, faArrowLeft,faArrowRight,faPersonCircleExclamation,faPersonCircleQuestion,faPersonCircleCheck,faPersonCircleXmark,
        faUserClock,faUserGroup,faUserTie,faUserSlash} from '@fortawesome/free-solid-svg-icons'
import {useState} from 'react'

import '../Candidate/ModalCvInfo'
import ModalCvInfo from '../Candidate/ModalCvInfo';




class AppliedCv extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            recruitmentArr:'',
            userInfo:'',
            status:'',

            recruitmentId:'',
            cvArr:'',

            cvDetail:'',
            isOpenModalCvInfo:false,
            previewImg:'',
            

        }
        
    }
    
    
    componentDidMount(){
        if(this.props.userInfo){
            this.getAllRecruitmentById(this.props.userInfo.id)
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.userInfo !== this.props.userInfo){
            this.getAllRecruitmentById(this.props.userInfo.id)
        }
    }
    getAllRecruitmentById=async(userId)=>{
        try {
            let resRecruitment = await getAllRecruitment(userId)
            let resCv = await GetAppliedCv(resRecruitment.data[0].id)
            //console.log('resCv: ',resCv)

            this.setState({
                recruitmentArr : resRecruitment.data,
                recruitmentId : resRecruitment.data[0].id,
                cvArr : resCv.cv,
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
   
        // console.log('id: ',event.target.value)
        let resCv = await GetAppliedCv(event.target.value)
        
        this.setState({
            recruitmentId :event.target.value,
            cvArr : resCv.cv,
 
        })
    }
    //update cv status
    handleUpdateAppliedCvStatus=async(cvId,status)=>{
        //console.log('id-status: ',cvId,status)
        let res = await UpdateAppliedCvStatus({
            cvId:cvId,
            status:status
        })
        if(res.errCode===0){
            toast.success('Cập nhật trạng thái CV thành công !!!')
            // this.componentDidMount()
            //lấy và cập nhật mảng từ csdl
            let resCv = await GetAppliedCv(this.state.recruitmentId)
            this.setState({
                cvArr : resCv.cv,
            })
        }else{
            toast.error('Cập nhật trạng thái CV thất bại...')
        }
        console.log('res: ',res)
    }
    
    //toggle Modal cvInfo
    toggleModalCvInfo=()=>{ 
        this.setState({
            isOpenModalCvInfo : !this.state.isOpenModalCvInfo
        })
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
        let recruitmentArr = this.state.recruitmentArr
        //console.log('recruitmentArr: ',recruitmentArr)
        console.log('states: ',this.state)
        return (
            <div className='applied-cv-content'>

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
                <table id="TableAppliedCv">
                        <tbody>
                            <tr>
                            <th>Tên</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>Xem CV</th>
                            <th>Trạng thái</th>
                            </tr>
                            { this.state.cvArr && this.state.cvArr.map((item, index)=>{
                                return(
                                    <tr key={index}>
                                        <td>{item.fullName}</td>
                                        <td>{item.phonenumber}</td>
                                        <td>{item.email}</td>
                                        <td><span className='cv-info-text' onClick={()=>this.cvInfo(item)}>Xem</span></td>
                                        <td>
                                            <button className={item.value==='Đợi xác nhận'?'btn-process active':'btn-process'} onClick={()=>this.handleUpdateAppliedCvStatus(item.id,'Đợi xác nhận')}><FontAwesomeIcon icon={faUserClock}/> </button>
                                            <FontAwesomeIcon icon={faArrowRight}/>
                                            <button className={item.value==='Chờ phỏng vấn'?'btn-process active':'btn-process'} onClick={()=>this.handleUpdateAppliedCvStatus(item.id,'Chờ phỏng vấn')}> <FontAwesomeIcon icon={faUserGroup}/> </button>
                                            <FontAwesomeIcon icon={faArrowRight}/>
                                            <button className={item.value==='Được nhận'?'btn-pass active':'btn-pass'} onClick={()=>this.handleUpdateAppliedCvStatus(item.id,'Được nhận')}> <FontAwesomeIcon icon={faUserTie}/></button>
                                            <button className={item.value==='Bị loại'?'btn-fail active':'btn-fail'} onClick={()=>this.handleUpdateAppliedCvStatus(item.id,'Bị loại')}><FontAwesomeIcon icon={faUserSlash}/></button>
                                        </td>
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

export default connect(mapStateToProps, mapDispatchToProps)(AppliedCv);
