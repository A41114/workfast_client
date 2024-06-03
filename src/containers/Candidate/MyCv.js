import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import './MyCv.scss'
import ModalCheckCvInfo from './ModalCheckCvInfo';

import moment from 'moment';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRegular} from '@fortawesome/free-regular-svg-icons'
import {faCircleInfo} from '@fortawesome/free-solid-svg-icons'
import {toast} from "react-toastify"

import {getAllCv, DeleteCv} from '../../services/candidateService'


class MyCv extends Component {
    constructor(props){
        super(props);
        this.state = {
            cvArr:'',
            createTime:'',
            updateTime:'',
            isOpenModalCheckCvInfo:false,
            cvDetail:'',
            previewImg:'',
        }
        
    }
    
    
    componentDidMount(){
        if(this.props.userInfo){
            this.getAllCvById(this.props.userInfo.id)
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.userInfo !== this.props.userInfo){
            this.getAllCvById(this.props.userInfo.id)
        }
        
    }
    getAllCvById=async(userId)=>{
        try {
            let resCv = await getAllCv(userId)
            //console.log('response: ',resCv.data)
            this.setState({
                cvArr:resCv.data
            })
        } catch (e) {
            console.log(e)
        }
    }
    handleDeleteCv=async(cv)=>{
        let cvRes = await DeleteCv(cv.id)
        console.log('cv: ',cvRes.errCode)
        if(cvRes.errCode===0){
            toast.success('Xóa CV thành công !!!')
        }
        this.componentDidMount()
    }
    //
    handleCheckCvInfo=(cv)=>{
        //console.log('check cv info: ',cv)
        this.setState({
            isOpenModalCheckCvInfo : true,
            cvDetail : cv,
            previewImg : new Buffer(cv.image,'base64').toString('binary')
        })
    }
    //give this to Modal check CV info
    handleCheckCvInfoFromMyCv=(cvNameFromCheckInfoModal)=>{
        this.props.handleToEidtCvFromCandidate(cvNameFromCheckInfoModal)
    }
    //toggle modal
    toggleModalCheckCvInfo=()=>{ 
        this.setState({
            isOpenModalCheckCvInfo : !this.state.isOpenModalCheckCvInfo
        })
    }
    

    render(){
        //console.log('state: ',this.state)
        return(
            <div className='my-cv-content'>
                <label className='title-my-cv col-12'>Danh sách CV của bạn</label>
                <ModalCheckCvInfo
                isOpen={this.state.isOpenModalCheckCvInfo}
                toggleFromParent={this.toggleModalCheckCvInfo}
                cvDetailFromParent={this.state.cvDetail}
                previewImgFromParent={this.state.previewImg}
                handleCheckCvInfoFromMyCv={this.handleCheckCvInfoFromMyCv}
                // createNewUser = {this.createNewUser}
                />
                <table id="TableManageCv">
                <tbody>
                    <tr>
                    <th>Tên CV</th>
                    <th>Họ tên</th>
                    <th>Vị trí</th>
                    <th>Ngày sinh</th>
                    <th>Giới tính</th>
                    <th>Số điện thoại</th>
                    <th>Email</th>
                    <th>Địa chỉ</th>
                    <th>Ngày tạo</th>
                    <th>Ngày sửa</th>
                    <th>Hành động</th>
                    </tr>
                        {this.state.cvArr&&this.state.cvArr.length>0&&this.state.cvArr.map((item,index)=>{
                            return(
                                <tr key={index}>
                                    <td>{item.cvName}</td>
                                    <td>{item.fullName}</td>
                                    <td>{item.position}</td>
                                    <td>{item.dayOfBirth}</td>
                                    <td>{item.gender}</td>
                                    <td>{item.phonenumber}</td>
                                    <td>{item.email}</td>
                                    <td>{item.address}</td>
                                    <td>{moment(item.createdAt).format('DD/MM/YYYY')+' - '+moment(item.createdAt).format('hh:mm:ss A')}</td>
                                    <td>{moment(item.updatedAt).format('DD/MM/YYYY')+' - '+moment(item.updatedAt).format('hh:mm:ss A')}</td>

                                    <td>
                                        <button className={item.public==='show'?'btn-cvInfo active':'btn-cvInfo'} onClick={()=>this.handleCheckCvInfo(item)}><FontAwesomeIcon icon={faCircleInfo}/></button>
                                        <button className='btn-delete-cv' onClick={()=>this.handleDeleteCv(item)}><i className="fas fa-trash"></i></button>
                                    </td>
                                    
                                </tr>
                            )
                        })
                        }

                </tbody>
                </table>
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(MyCv);