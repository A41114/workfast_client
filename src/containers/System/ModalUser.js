import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DatePicker from '../../components/Input/DatePicker';
import { emitter } from '../../utils/emitter';
import moment from 'moment';
import { createNewUserService,handleLoginApi } from '../../services/userService';
import { CommonUtils } from '../../utils';
class ModalUser extends Component {

    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
            firstName:'',
            lastName:'',
            address:'',
            gender:'Nam',
            dayOfBirth:'01/01/1999',
            image :'',
            previewImgURL:'',
            roleId:'R1',
        }
        this.listenToEmitter();
    }
    listenToEmitter(){
        //listen event
        emitter.on('EVENT_CLEAR_MODAL_DATA', ()=>{
            //reset state
            this.setState({
                email:'',
                password:'',
                firstName:'',
                lastName:'',
                address:'',
                phonenumber:'',

            })
        })
    };

    componentDidMount() {
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
    handleAddNewUser = ()=>{
        let isValid=this.checkValidateInput();
        if(isValid === true){
            //call api create new user
            this.props.createNewUser(this.state);
        }
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
                    this.toggle()
                }
            } catch (e) {
                console.log(e)
            }
        }
    }

    render() {
        //console.log('check child props', this.props);
        //console.log('check child open modals', this.props.isOpen);
        console.log('states: ',this.state)
        return (
            <Modal
                isOpen={this.props.isOpen} 
                toggle={()=>this.toggle()} 
                className={'modal-user-container'}
                size="lg"
            >
            <ModalHeader toggle={()=>this.toggle()}>Tạo mới người dùng</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                <div className='container'>
                <div className='row'>
                    <div className='col-12 my-3'>Thông tin cá nhân</div>
                    <div className='col-12'></div>
                    <div className='col-3'>
                        <label>Email</label>
                        <input className='form-control' type='email'
                        onChange={(event)=>this.handleOnChangeInput(event,'email')}
                        placeholder='Nhập email'
                        />
                    </div>
                    <div className='col-3'>
                        <label>Mật khẩu</label>
                        <input className='form-control' type='password'
                        onChange={(event)=>this.handleOnChangeInput(event,'password')}
                        placeholder='Nhập mật khẩu'
                        />
                    </div>
                    <div className='col-3'>
                        <label>Tên</label>
                        <input className='form-control' type='text'
                        onChange={(event)=>this.handleOnChangeInput(event,'firstName')}
                        placeholder='Nhập tên'
                        />
                    </div>
                    <div className='col-3'>
                        <label>Họ</label>
                        <input className='form-control' type='text'
                        onChange={(event)=>this.handleOnChangeInput(event,'lastName')}
                        placeholder='Nhập họ'
                        />
                    </div>
                    <div className='col-3'>
                        <label>Số điện thoại</label>
                        <input className='form-control' type='text'
                        onChange={(event)=>this.handleOnChangeInput(event,'phonenumber')}
                        placeholder='Nhập số điện thoại'
                        />
                    </div>
                    <div className='col-9'>
                        <label>Địa chỉ</label>
                        <input className='form-control' type='text'
                        onChange={(event)=>this.handleOnChangeInput(event,'address')}
                        placeholder='Nhập địa chỉ'
                        />
                    </div>
                    <div className='col-3'>
                        <label>Giới tính</label>
                        <select className='form-control'
                        onChange={(event)=>this.handleOnChangeInput(event,'gender')}
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
                            ></div>
                        </div>
                    </div>
                    <div className='col-3'>
                        <label>Vai trò</label>
                        <select className='form-control'
                        onChange={(event)=>this.handleOnChangeInput(event,'roleId')}
                        >
                            <option value={'R1'}>Admin</option>
                            <option value={'R2'}>Nhà tuyển dụng</option>
                            <option value={'R3'}>Ứng viên</option>
                        </select>
                    </div>
                </div>
            </div>
            </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" className='px-3' onClick={()=>this.handleSignUp()}>Tạo mới</Button>{' '}
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);





