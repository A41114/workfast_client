import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';


import HomeHeader from '../HomePage/HomeHeader';
import { createNewUserService,handleLoginApi } from '../../services/userService';
import moment from 'moment';
import DatePicker from '../../components/Input/DatePicker';
import { CommonUtils } from '../../utils';
import Lightbox from 'react-image-lightbox'
import './SignUpCandidate.scss'
import * as actions from "../../store/actions";

class SignUpCandidate extends Component {
    constructor(props){
        super(props);
        this.state = {
            roleId:'R3',
            gender:'Nam',
            email:'',
            password:'',
            firstName:'',
            lastName:'',
            phonenumber:'',
            address:'',

            dayOfBirth: moment(new Date()).format('DD/MM/YYYY'),

            image:'',
            previewImgURL:'',
            isOpen:false,
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
                previewImgURL:objectUrl,
                image:base64
            })
        
        }
        
    }
    openPreviewImage=()=>{
        if(!this.state.previewImgURL) return;
        this.setState({
            isOpen:true
        })
    }
    //check validate
    checkValidateInput = ()=>{
        let isValid=true;
        let arrCheck=['email','password','firstName','lastName',
            'phonenumber','address']
            for(let i=0; i< arrCheck.length;i++){
                if(!this.state[arrCheck[i]]){
                    isValid=false;
                    alert('Thiếu trường bắt buộc: '+arrCheck[i])
                    break;
                }
            }
        return isValid
    }
    //Sign up
    handleSignUp=async()=>{
        if(this.checkValidateInput()){
            try {
                console.log('sign up state: ',this.state)
                let response = await createNewUserService({
                    gender:this.state.gender,
                    email:this.state.email,
                    password:this.state.password,
                    firstName:this.state.firstName,
                    lastName:this.state.lastName,
                    phonenumber:this.state.phonenumber,
                    address:this.state.address,
                    dayOfBirth: this.state.dayOfBirth,
                    roleId:this.state.roleId,
                    image:this.state.image,
                });
                if(response && response.errCode !== 0){
                    alert(response.errMessage)
                }else{
                    let data = await handleLoginApi(this.state.email, this.state.password)
                    this.props.userLoginSuccess(data.user)
                    this.props.history.push(`/home`)
                }
            } catch (e) {
                console.log(e)
            }
        }
    }
    render() {
        console.log('State: ', this.state)
        //console.log('is loggin: ', this.props.isLoggedIn)
        //console.log('user info: ', this.props.userInfo)
        return (
            <div className='user-redux-container'>
                <HomeHeader
                isShowBanner={false}
                />
                <div className='title'>
                    Đăng ký với tư cách ứng viên
                </div>
                <div className="user-redux-body">
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3'>Thông tin cá nhân</div>
                            <div className='col-12'></div>
                            <div className='col-3'>
                                <label>Email</label>
                                <input className='form-control' type='email'
                                onChange={(event)=>this.handleOnChangeSelect(event,'email')}
                                placeholder='Nhập email'
                                />
                            </div>
                            <div className='col-3'>
                                <label>Mật khẩu</label>
                                <input className='form-control' type='password'
                                onChange={(event)=>this.handleOnChangeSelect(event,'password')}
                                placeholder='Nhập mật khẩu'
                                />
                            </div>
                            <div className='col-3'>
                                <label>Tên</label>
                                <input className='form-control' type='text'
                                onChange={(event)=>this.handleOnChangeSelect(event,'firstName')}
                                placeholder='Nhập tên'
                                />
                            </div>
                            <div className='col-3'>
                                <label>Họ</label>
                                <input className='form-control' type='text'
                                onChange={(event)=>this.handleOnChangeSelect(event,'lastName')}
                                placeholder='Nhập họ'
                                />
                            </div>
                            <div className='col-3'>
                                <label>Số điện thoại</label>
                                <input className='form-control' type='text'
                                onChange={(event)=>this.handleOnChangeSelect(event,'phonenumber')}
                                placeholder='Nhập số điện thoại'
                                />
                            </div>
                            <div className='col-9'>
                                <label>Địa chỉ</label>
                                <input className='form-control' type='text'
                                onChange={(event)=>this.handleOnChangeSelect(event,'address')}
                                placeholder='Nhập địa chỉ'
                                />
                            </div>
                            <div className='col-3'>
                                <label>Giới tính</label>
                                <select className='form-control'
                                onChange={(event)=>this.handleOnChangeSelect(event,'gender')}
                                >
                                    <option>Nam</option>
                                    <option>Nữ</option>
                                    <option>Khác</option>
                                </select>
                            </div>

                            <div className='col-3'>
                                <label>Ngày sinh</label>
                                <DatePicker className='form-control'
                                value={this.state.dayOfBirth}
                                onChange={(event)=>this.handleOnChangeBirth(event)}
                                />
                            </div>
                            <div className='col-3'>
                                <label>Ảnh đại diện</label>
                                <div className='preview-img-container'>
                                    <input id='previewImg' type='file' hidden
                                    onChange={(event)=>this.handleOnChangeImage(event)}/>

                                    
                                    <label className='label-upload' htmlFor="previewImg">Tải ảnh<i className='fas fa-upload'></i></label>
                                    <div className='preview-image'
                                    previewImgURL
                                        style={{backgroundImage: `url(${this.state.previewImgURL})` }}
                                        onClick={()=>this.openPreviewImage()}
                                    ></div>
                                </div>
                            </div>
                            <div className='col-12 my-3 sign-up-container'>
                                <button className='sign-up' onClick={()=>this.handleSignUp()}>Đăng ký</button>
                            </div>
                            
                            
                        </div>
                    </div>
                </div>
                {this.state.isOpen===true &&
                    <Lightbox
                        mainSrc={this.state.previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            
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
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUpCandidate));
