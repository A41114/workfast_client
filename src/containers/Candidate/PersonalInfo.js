import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';


import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRegular} from '@fortawesome/free-regular-svg-icons'
import {faUsers, faUser, faCircleInfo, faClockRotateLeft, faListCheck, faCalendar, faPhone, faEnvelope, faLocationDot, faKey, faSignature } from '@fortawesome/free-solid-svg-icons'
import {toast} from "react-toastify"


import {getAllCv, EditCvService} from '../../services/candidateService'

import moment from 'moment';
import DatePicker from '../../components/Input/DatePicker';
import { CommonUtils } from '../../utils';
import Lightbox from 'react-image-lightbox'
import { changePasswordService,changeUserInfoService,handleLoginApi } from '../../services/userService';

import * as actions from "../../store/actions";
import {path} from '../../../src/utils/constant'
import './PersonalInfo.scss'
class PersonalInfo extends Component {
    constructor(props){
        super(props);
        this.state={
            candidateId:'',
            email:'',
            password:'',
            firstName:'',
            lastName:'',
            dayOfBirth:'',
            gender:'',
            address:'',
            phonenumber:'',

            avatar:'',
            previewAvatar:'',
            isOpen:false,

            isChangePassword:false,
            oldPassword:'',
            newPassword:'',

        }
    }
    componentDidMount(){
        if(this.props.userInfo){
            let imageBase64='';
            if(this.props.userInfo.image){
                imageBase64 = new Buffer(this.props.userInfo.image,'base64').toString('binary')
                //console.log('img base64: ',imageBase64)
            }
            this.setState({
                candidateId :this.props.userInfo.id,
                email:this.props.userInfo.email,

                firstName:this.props.userInfo.firstName,
                lastName: this.props.userInfo.lastName,
                dayOfBirth:this.props.userInfo.dayOfBirth,
                gender: this.props.userInfo.gender,
                address:this.props.userInfo.address,
                phonenumber: this.props.userInfo.phonenumber,
                avatar: imageBase64,
                previewAvatar:imageBase64,
                
            })
       }

    }
    componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.userInfo !== this.props.userInfo){
            let imageBase64='';
            if(this.props.userInfo){
                if(this.props.userInfo.image){
                    imageBase64 = new Buffer(this.props.userInfo.image,'base64').toString('binary')
                    //console.log('img base64: ',imageBase64)
                }
                this.setState({
                    candidateId :this.props.userInfo.id,
                    email:this.props.userInfo.email,

                    firstName:this.props.userInfo.firstName,
                    lastName: this.props.userInfo.lastName,
                    dayOfBirth:this.props.userInfo.dayOfBirth,
                    gender: this.props.userInfo.gender,
                    address:this.props.userInfo.address,
                    phonenumber: this.props.userInfo.phonenumber,
                    avatar: imageBase64,
                    previewAvatar:imageBase64,
                    
                })
            }
        }

    }
    handleOnChangeSelect=(event,inputId)=>{
        let copyState = this.state;
        copyState[inputId]=event.target.value;
        this.setState({
            ...copyState
        })
    }
    //Day of birth
    handleOnChangeBirth=(date)=>{
        this.setState({
            dayOfBirth:moment(date[0]).format('DD/MM/YYYY')
        })
    }
    //image
    handleOnChangeImage= async (event)=>{
        let data =event.target.files;
        let file = data[0];
        
        if(file){
            let base64 = await CommonUtils.getBase64(file);
            //console.log('check base64 image: ',base64)
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewAvatar:objectUrl,
                avatar:base64
            })
        
        }
        
    }
    openPreviewImage=()=>{
        if(!this.state.previewAvatar) return;
        this.setState({
            isOpen:true
        })
    }
    //password
    changeIsChangePassword=()=>{
        this.setState({
            isChangePassword:!this.state.isChangePassword
        })
    }
    handleChangePassword=async()=>{
        let res=await changePasswordService({
                userId:this.state.candidateId,
                oldPassword : this.state.oldPassword,
                newPassword: this.state.newPassword
            })
        if(res.errCode===0){
            toast.success('Thay đổi mật khẩu thành công')
        }
        else if(res.errCode===1){
            toast.error('Thiếu trường bắt buộc')
        }
        else if(res.errCode===2){
            toast.error('Sai mật khẩu ')
        }
        else if(res.errCode===3){
            toast.error('Không tìm thấy người dùng')
        }
    }
    //info
    handleChangeInfo=async()=>{
        let res=await changeUserInfoService({
            userId:this.state.candidateId,
            email:this.state.email,
            firstName:this.state.firstName,
            lastName:this.state.lastName,
            dayOfBirth:this.state.dayOfBirth,
            gender:this.state.gender,
            address:this.state.address,
            phonenumber:this.state.phonenumber,
            image:this.state.avatar
        })
        if(res.errCode===0){
            this.props.userReLogin(this.state.candidateId)
            toast.success('Cập nhật thông tin thành công')
        }
        else if(res.errCode===1){
            toast.error('Thiếu id người dùng')
        }
        else if(res.errCode===2){
            toast.error('Email đã được sử dụng')
        }
        else if(res.errCode===3){
            toast.error('Không tìm thấy người dùng')
        }
        
    }
    

    render(){
        //console.log('state: ',this.state)
        //console.log('userInfo: ',this.props.userInfo)
        return(
            <div className='personal-info'>
                <div className='personal-info-container'>
                    <div className='personal-info-content'>
                        <label className='title-personal-info col-12'>Cài đặt thông tin cá nhân</label>
                        <div className='col-6'>
                            <span><FontAwesomeIcon icon={faEnvelope}/> </span>
                            <label>Email</label>
                            <input className='form-control' type='email'
                            onChange={(event)=>this.handleOnChangeSelect(event,'email')}
                            placeholder='Email'
                            value={this.state.email}
                            />    
                        </div>
                        {!this.state.isChangePassword&&
                            <>
                            <div className='col-4'>
                                <span><FontAwesomeIcon icon={faKey}/> </span>
                                <label>Mật khẩu</label>
                                <input className='form-control' type='password'
                                onChange={(event)=>this.handleOnChangeSelect(event,'password')}
                                placeholder='Thay đổi mật khẩu'
                                disabled
                                />
                            </div>
                            <div className='col-2'>
                                <button className='form-control change-password'
                                onClick={()=>this.changeIsChangePassword()}
                                >Đổi mật khẩu</button>
                            </div>
                            </>
                        }
                        {this.state.isChangePassword&&
                            <>
                            <div className='col-2'>
                                <span><FontAwesomeIcon icon={faKey}/> </span>
                                <label>Mật khẩu cũ</label>
                                <input className='form-control' type='password'
                                onChange={(event)=>this.handleOnChangeSelect(event,'oldPassword')}
                                placeholder='Nhập mật khẩu cũ'
                                value={this.state.oldPassword}
                                />
                            </div>
                            <div className='col-2'>
                                <span><FontAwesomeIcon icon={faKey}/> </span>
                                <label>Mật khẩu mới</label>
                                <input className='form-control' type='password'
                                onChange={(event)=>this.handleOnChangeSelect(event,'newPassword')}
                                placeholder='Nhập mật khẩu mới'
                                value={this.state.newPassword}
                                />
                            </div>
                            <div className='col-1'>
                                <button className='form-control change-password'
                                onClick={()=>this.handleChangePassword()}
                                >Lưu</button>
                            </div>
                            <div className='col-1'>
                                <button className='form-control change-password'
                                onClick={()=>this.changeIsChangePassword()}
                                >Hủy</button>
                            </div>
                            </>
                        }


                        <div className='col-6'>
                            <span><FontAwesomeIcon icon={faSignature}/> </span>
                            <label>Họ</label>
                            <input className='form-control' type='text'
                            onChange={(event)=>this.handleOnChangeSelect(event,'lastName')}
                            placeholder='Họ'
                            value={this.state.lastName}
                            />
                        </div>
                        <div className='col-6'>
                            <span><FontAwesomeIcon icon={faSignature}/> </span>
                            <label>Tên</label>
                            <input className='form-control' type='text'
                            onChange={(event)=>this.handleOnChangeSelect(event,'firstName')}
                            placeholder='Tên'
                            value={this.state.firstName}
                            />
                        </div>
                        <div className='col-6'>
                            <span><FontAwesomeIcon icon={faCalendar}/> </span>
                            <label>Ngày sinh</label>
                            <DatePicker className='form-control'
                            value={this.state.dayOfBirth}
                            onChange={(event)=>this.handleOnChangeBirth(event)}
                            />
                        </div>
                        <div className='col-6'>
                            <span><FontAwesomeIcon icon={faUser}/> </span>
                            <label>Giới tính</label>
                            <select className='form-control'
                            onChange={(event)=>this.handleOnChangeSelect(event,'gender')}
                            >   
                                {this.state.gender&&this.state.gender==='Nam'?<option selected="selected">Nam</option>:<option>Nam</option>}
                                {this.state.gender&&this.state.gender==='Nữ'?<option selected="selected">Nữ</option>:<option>Nữ</option>}
                                {this.state.gender&&this.state.gender==='Khác'?<option selected="selected">Khác</option>:<option>Khác</option>}
                            
                            </select>
                        </div>


                        <div className='col-12'>
                            <span><FontAwesomeIcon icon={faLocationDot}/> </span>
                            <label>Địa chỉ</label>
                            <input className='form-control' type='text'
                            onChange={(event)=>this.handleOnChangeSelect(event,'address')}
                            placeholder='Địa chỉ'
                            value={this.state.address}
                            />    
                        </div>
                        <div className='col-12'>
                            <span><FontAwesomeIcon icon={faPhone}/> </span>
                            <label>Số điện thoại</label>
                            <input className='form-control' type='text'
                            onChange={(event)=>this.handleOnChangeSelect(event,'phonenumber')}
                            placeholder='Số điện thoại'
                            value={this.state.phonenumber}
                            />
                        </div>
                        <div className='col-6'>
                            <div className='preview-img-container'>
                            <input id='previewImg' type='file' hidden
                            onChange={(event)=>this.handleOnChangeImage(event)}/>
                            <div className='preview-image'
                            previewImgURL
                                style={{backgroundImage: `url(${this.state.previewAvatar})` }}
                                onClick={()=>this.openPreviewImage()}
                            ></div>
                            <label className='label-upload' htmlFor="previewImg">Tải ảnh<i className='fas fa-upload'></i></label>
                            </div>
                            
                            {this.state.isOpen===true &&
                                <Lightbox
                                    mainSrc={this.state.previewAvatar}
                                    onCloseRequest={() => this.setState({ isOpen: false })}
                                />
                            }
                        </div>
                        <div className='col-6'>
                            <button className='form-control save-info'
                            onClick={()=>this.handleChangeInfo()}
                            >Lưu thông tin</button>
                        </div>
                    
                    </div>
                </div>
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
        userReLogin:(userData)=>dispatch(actions.userReLoginStart(userData)),
        processLogout: () => dispatch(actions.processLogout()),
        
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PersonalInfo));