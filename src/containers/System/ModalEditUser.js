import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DatePicker from '../../components/Input/DatePicker';
import { emitter } from '../../utils/emitter';
import moment from 'moment';
import { CommonUtils } from '../../utils';
import './ModalEditUser.scss'
import _ from 'lodash';
import {changeUserInfoService } from '../../services/userService';
import {toast} from "react-toastify"
class ModalEditUser extends Component {

    constructor(props){
        super(props);
        this.state = {
            id:'',
            email:'',
            password:'',
            firstName:'',
            lastName:'',
            address:'',
            gender:'Nam',
            dayOfBirth:'01/01/1999',
            phonenumber:'',

            avatar :'',
            previewImgURL:'',
            previewAvatar:'',
        }
    }

    componentDidMount() {
        let user = this.props.currentUser; //{}
        if(user && !_.isEmpty(user)){
            let imageBase64 = ''
            if(user.image){
                imageBase64 = new Buffer(user.image,'base64').toString('binary')
            }
            this.setState({
                id: user.id,
                email: user.email,
                password : 'harcode',
                firstName : user.firstName,
                lastName : user.lastName,
                address : user.address,
                phonenumber : user.phonenumber,
                avatar : imageBase64,
                previewAvatar : imageBase64,
                dayOfBirth : user.dayOfBirth,
                gender :user.gender
            })
        }
        console.log('didmount edit modal: ', this.props.currentUser)
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

    toggle=()=>{
        this.props.toggleFromParent();
    }
    handleOnChangeInput=(event,id)=>{
        let copyState = {...this.state};
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
        
    }
    checkValidateInput = ()=>{
        let isValid = true;
        let arrInput=['email', 'password', 'firstName', 'lastName', 'address'];
        for(let i = 0; i < arrInput.length; i++){
            if(!this.state[arrInput[i]]){
                isValid = false;
                alert('Missing parameter: '+arrInput[i]);
                break;
            }
        }
        return isValid;
    }
    // handleSaveUser = ()=>{
    //     let isValid=this.checkValidateInput();
    //     if(isValid === true){
    //         //call api edit user
    //         this.props.editUser(this.state);
    //     }
    // }
    //info
    handleChangeInfo=async()=>{
        let res=await changeUserInfoService({
            userId:this.state.id,
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
            this.toggle()
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



    render() {
        // console.log('check props from parent: ', this.props.currentUser.email);
        console.log('states: ',this.state)
        //console.log('check child open modals', this.props.isOpen);
        return (
            <Modal
                isOpen={this.props.isOpen} 
                toggle={()=>this.toggle()} 
                className={'modal-user-container'}
                size="lg"
            >
            <ModalHeader toggle={()=>this.toggle()}>Sửa thông tin người dùng</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                <div className='container'>
                <div className='modal-user-body'>
                    <div className='row'>
                        <div className='col-6'>
                            <label>Email</label>
                            <input className='form-control' type='email'
                            onChange={(event)=>this.handleOnChangeInput(event,'email')}
                            placeholder='Email'
                            value={this.state.email}
                            />    
                        </div>
                        <div className='col-6'>
                            <label>Họ</label>
                            <input className='form-control' type='text'
                            onChange={(event)=>this.handleOnChangeInput(event,'lastName')}
                            placeholder='Họ'
                            value={this.state.lastName}
                            />
                        </div>
                        <div className='col-6'>
                            <label>Tên</label>
                            <input className='form-control' type='text'
                            onChange={(event)=>this.handleOnChangeInput(event,'firstName')}
                            placeholder='Tên'
                            value={this.state.firstName}
                            />
                        </div>
                        <div className='col-6'>
                            <label>Ngày sinh</label>
                            <DatePicker className='form-control'
                            value={this.state.dayOfBirth}
                            onChange={(event)=>this.handleOnChangeBirth(event)}
                            />
                        </div>
                        <div className='col-6'>
                            <label>Giới tính</label>
                            <select className='form-control'
                            onChange={(event)=>this.handleOnChangeInput(event,'gender')}
                            >   
                                {this.state.gender&&this.state.gender==='Nam'?<option selected="selected">Nam</option>:<option>Nam</option>}
                                {this.state.gender&&this.state.gender==='Nữ'?<option selected="selected">Nữ</option>:<option>Nữ</option>}
                                {this.state.gender&&this.state.gender==='Khác'?<option selected="selected">Khác</option>:<option>Khác</option>}
                            
                            </select>
                        </div>
                        <div className='col-12'>
                            <label>Địa chỉ</label>
                            <input className='form-control' type='text'
                            onChange={(event)=>this.handleOnChangeInput(event,'address')}
                            placeholder='Địa chỉ'
                            value={this.state.address}
                            />    
                        </div>
                        <div className='col-12'>
                            <label>Số điện thoại</label>
                            <input className='form-control' type='text'
                            onChange={(event)=>this.handleOnChangeInput(event,'phonenumber')}
                            placeholder='Số điện thoại'
                            value={this.state.phonenumber}
                            />
                        </div>
                        <div className='col-12'>Ảnh đại diện</div>
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
                        </div>
                        
                        
                    </div>
                </div>
                </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" className='px-3' onClick={()=>this.handleChangeInfo()}>Lưu thay đổi</Button>{' '}
                <Button color="secondary" className='px-3' onClick={()=>this.toggle()}>Hủy</Button>{' '}
            </ModalFooter>
            </Modal>
        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);





