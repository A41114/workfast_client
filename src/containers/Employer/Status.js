import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import './TableManageStatus.scss';
import {getAllRecruitment, DeleteRecruitmentService, UpdateStatusRecruitmentService} from '../../services/employerService'
import {toast} from "react-toastify"


import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRegular} from '@fortawesome/free-regular-svg-icons'
import {faSolid, faFile, faSignal, faUsers, faChartLine, faGlobe} from '@fortawesome/free-solid-svg-icons'
import {useState} from 'react'






class TableManageStatus extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            recruitmentArr:'',
            userInfo:'',
            status:'',
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
            this.setState({
                recruitmentArr : resRecruitment.data
            })
        } catch (e) {
            console.log(e)
        }
    }

    handlePublicRecruitment=async(recruitment)=>{
        console.log('recruitment status: ', recruitment.public)

        if(recruitment.public==='show'){
            
            await UpdateStatusRecruitmentService({
                recruitmentId : recruitment.id,
                status : 'hide'
            })
            toast.success('Ẩn đơn tuyển dụng thành công !!!')
            this.componentDidMount()
        }

        if(recruitment.public==='hide'){
            
            await UpdateStatusRecruitmentService({
                recruitmentId : recruitment.id,
                status : 'show'
            })
            toast.success('Công khai đơn tuyển dụng thành công !!!') 
            this.componentDidMount()
        }
        
    }
    

    handleDeleteRecruitment=async(recruitment)=>{
        //console.log('Props: ', this.props)
        await DeleteRecruitmentService(recruitment.id)
        toast.success('Xóa đơn tuyển dụng thành công !!!')
        this.componentDidMount()
        
    }
    render() {

        
        return (
            <div className='manage-status-content'>
                <table id="TableManageStatus">
                        <tbody>
                            <tr>
                            <th>Tên</th>
                            <th>Vị trí</th>
                            <th>Lĩnh vực</th>
                            <th>Địa điểm</th>
                            <th>Kinh nghiệm</th>
                            <th>Lương</th>
                            <th>Ngày kết thúc</th>  
                            <th>Trạng thái</th>
                            </tr>
                            { this.state.recruitmentArr && this.state.recruitmentArr.map((item, index)=>{
                                return(
                                    <tr key={index}>
                                        <td>{item.title}</td>
                                        <td>{item.position}</td>
                                        <td>{item.field}</td>
                                        <td>{item.workLocation}</td>
                                        <td>{item.yearOfExperience}</td>
                                        <td>{item.salary}</td>
                                        <td>{item.endDate}</td>
                                        <td>
                                            <button className={item.public==='show'?'btn-public active':'btn-public'} onClick={()=>this.handlePublicRecruitment(item)}><FontAwesomeIcon icon={faGlobe}/></button>
                                            <button className='btn-delete' onClick={()=>this.handleDeleteRecruitment(item)}><i className="fas fa-trash"></i></button>
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

export default connect(mapStateToProps, mapDispatchToProps)(TableManageStatus);
