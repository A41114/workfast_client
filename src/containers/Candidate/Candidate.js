import React, { Component } from 'react';
import { connect } from 'react-redux';

import DatePicker from '../../components/Input/DatePicker';
import { getAllCodeService } from '../../services/userService';
import moment from 'moment';
import './CandidateCv.scss'
import HomeHeader from '../HomePage/HomeHeader';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRegular} from '@fortawesome/free-regular-svg-icons'
import {faUsers, faUser, faCircleInfo, faClockRotateLeft, faListCheck, faCalendar, faPhone, faEnvelope, faLocationDot, faBullseye, faComputer, faFootball, faUserGraduate, faUserTie, faPersonDigging, faStamp, faAward } from '@fortawesome/free-solid-svg-icons'
import {toast} from "react-toastify"

import Lightbox from 'react-image-lightbox'
import { CommonUtils } from '../../utils'
import {createNewCv} from '../../services/candidateService'

import EditCv from './EditCv';
import MyCv from './MyCv';
import PersonalInfo from './PersonalInfo';
import History from './History';


class Candidate extends Component {

    constructor(props){
        super(props);
        this.state = {
            manageCV: false,
            myCV: false,
            history: true,
            personalInf:false,
            cvAction:'create',

            image:'',
            previewImgURL:'',
            isOpen:false,

            candidateId:'',
            CvName:'',
            name: '',
            position:'',
            dayOfBirth:'01/01/1999',
            gender:'',
            phonenumber:'',
            email:'',
            address:'',
            goals:'',
            skills:'',
            hobbies:'',

            education:'',
            experience:'',
            activities:'',
            certificate:'',
            awards:'',
            moreInf:'',


            cvNameFromCheckInfoModal:'',
            ToEditFromCheckInfoModal:false,

            
        }
    }
    
    async componentDidMount(){
        if(this.props.history.location.state){
            await this.fromHeaderToNewCv()
        }
       if(this.props.userInfo){
            let imageBase64='';
            if(this.props.userInfo.image){
                imageBase64 = new Buffer(this.props.userInfo.image,'base64').toString('binary')
                //console.log('img base64: ',imageBase64)
            }
            await this.setState({
                candidateId :this.props.userInfo.id,
                name:this.props.userInfo.firstName+' '+this.props.userInfo.lastName,
                dayOfBirth:this.props.userInfo.dayOfBirth,
                address:this.props.userInfo.address,
                email:this.props.userInfo.email,
                gender: this.props.userInfo.gender,
                phonenumber: this.props.userInfo.phonenumber,
                image: imageBase64,
                
                previewImgURL:imageBase64,
                
            })
       }
    }
    async componentDidUpdate (prevProps, prevState, snapshot){
        if(prevProps.userInfo !== this.props.userInfo){
            let imageBase64='';
            if(this.props.userInfo){
                if(this.props.userInfo.image){
                    imageBase64 = new Buffer(this.props.userInfo.image,'base64').toString('binary')
                    //console.log('img base64: ',imageBase64)
                }
                this.setState({
                    candidateId :this.props.userInfo.id,
                    name:this.props.userInfo.firstName+' '+this.props.userInfo.lastName,
                    dayOfBirth:this.props.userInfo.dayOfBirth,
                    address:this.props.userInfo.address,
                    email:this.props.userInfo.email,
                    gender: this.props.userInfo.gender,
                    phonenumber: this.props.userInfo.phonenumber,
                    image: imageBase64,
                    previewImgURL:imageBase64,
                    
        
                })
                
            }
        }
        if(this.props.history.location.state){
            if(prevProps.history.location.state.fromNewCv !== this.props.history.location.state.fromNewCv){
                await this.fromHeaderToNewCv()
            }
        }
        
    }
    //From header to new recruitment
    fromHeaderToNewCv=()=>{
        
        this.setState({
            manageCV: true,
            myCV: false,
            history: false,
            personalInf:false,
            cvAction:'create',
        })
    }
    //Change menu
    handleChangeMenu=(selected)=>{
        let copyState = this.state;
        copyState.manageCV=false;
        copyState.myCV=false;
        copyState.history=false;
        copyState.personalInf=false;

        copyState[selected]=true;
        this.setState({
            ...copyState
        })
    }
    //Change create <=> edit cv
    handleCreateEdit=(action)=>{
        this.setState({
            cvAction : action
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
    //select
    handleOnChangeSelect=(event,inputId)=>{
        let copyState = this.state;
        copyState[inputId]=event.target.value;
        this.setState({
            ...copyState
        })
    }
    //Date
    handleOnChangeDayOfBirth=(date)=>{
        this.setState({
            dayOfBirth:moment(date[0]).format('DD/MM/YYYY')
        })
    }
    //validate
    checkValidateInput = ()=>{
        let isValid=true;
        if(!this.state.CvName){
            isValid=false;
            alert('Thiếu tên CV !!!')
        }
        else if(!this.state.name){
            isValid=false;
            alert('Thiếu tên !!!')
        }
        else if(!this.state.position){
            isValid=false;
            alert('Thiếu vị trí !!!')
        }
        return isValid
    }
    //Create new CV
    handleCreateCv=async()=>{
        if(this.checkValidateInput()){
            
            try {
                let resCreate = await createNewCv({
                    candidateId : this.state.candidateId,
                    cvName : this.state.CvName,
                    fullName : this.state.name,
                    position : this.state.position,
                    dayOfBirth : this.state.dayOfBirth,
                    gender : this.state.gender,
                    phonenumber : this.state.phonenumber,
                    email : this.state.email,
                    address : this.state.address,
                    goals : this.state.goals,
                    skills : this.state.skills,
                    hobbies : this.state.hobbies,
                    education : this.state.education,
                    experience : this.state.experience,
                    activities : this.state.activities,
                    certificate : this.state.certificate,
                    awards : this.state.awards,
                    moreInf : this.state.moreInf,
                    image : this.state.image
                })
                if(resCreate.errCode===0){
                    toast.success('Tạo CV mới thành công !!!')
                }else{
                    toast.error('Tên CV đã tồn tại !!!')
                }

            } catch (e) {
                console.log(e)
            }
            this.handleChangeMenu('myCV')
        }

    }
    //
    isNotFromCheckInfoModal=()=>{
        this.setState({
            ToEditFromCheckInfoModal : false
        })
    }

    //
    handleToEidtCvFromCandidate=(cvNameFromCheckInfoModal)=>{
        
        this.handleChangeMenu('manageCV')
        this.setState({
            ToEditFromCheckInfoModal:true,
            cvNameFromCheckInfoModal : cvNameFromCheckInfoModal,
            cvAction : 'edit'
        })
    }
    render() {

        
        //console.log('user info: ', this.props.userInfo)
        return (
            <>
            <HomeHeader isShowBanner={false}/>
            
            <div className='my-work'>
                
                <div className='menu'>
                    <div className='title-menu'>Việc của tôi</div>

                    <div className={this.state.manageCV?'menu-item-selected':'menu-item'}
                    onClick={()=>this.handleChangeMenu('manageCV')}
                    >
                        <FontAwesomeIcon icon={faListCheck}/>
                        <div>Quản lý CV</div>
                        
                    </div>
                    <div className={this.state.myCV?'menu-item-selected':'menu-item'}
                    onClick={()=>this.handleChangeMenu('myCV')}
                    >
                        <FontAwesomeIcon icon={faUser}/>
                        <div>CV của bạn</div>
                    </div>
                    <div className={this.state.history?'menu-item-selected':'menu-item'}
                    onClick={()=>this.handleChangeMenu('history')}
                    >
                        <FontAwesomeIcon icon={faClockRotateLeft}/>
                        <div>Lịch sử</div>
                    </div>
                    <div className={this.state.personalInf?'menu-item-selected':'menu-item'}
                    onClick={()=>this.handleChangeMenu('personalInf')}
                    >
                        <FontAwesomeIcon icon={faCircleInfo}/>
                        <div>Thông tin cá nhân</div>
                        
                    </div>
                    
                </div>

            {this.state.manageCV&&
                <div className='user-redux-container'>
                    <div className='title-create-edit'>
                        <div className={this.state.cvAction==='create'?'title-create-form active':'title-create-form'}
                        onClick={()=>this.handleCreateEdit('create')}>
                            Tạo CV
                        </div>
                        <div className='slash-create-edit'> / </div>
                        <div className={this.state.cvAction==='edit'?'title-edit-form active':'title-edit-form'}
                        onClick={()=>this.handleCreateEdit('edit')}
                        >
                            Sửa CV
                        </div>
                    </div>
                    {this.state.cvAction==='create'&&
                    <div className="cv-create-form">
                        <div className='container'>
                            <div className='col-2'>
                                <input className='form-control cv-name' type='text'
                                onChange={(event)=>this.handleOnChangeSelect(event,'CvName')}
                                placeholder='Tên CV'
                                value={this.state.CvName}
                                />
                            </div>

                            <div className='row mx-1 cv-create-content'>        
                                <div className='cv-create-content-left'>
                                    
                                    <div className='col-12'>
                                        
                                        <div className='preview-img-container'>
                                            <input id='previewImg' type='file' hidden
                                            onChange={(event)=>this.handleOnChangeImage(event)}/>
                                            <div className='preview-image'
                                            previewImgURL
                                                style={{backgroundImage: `url(${this.state.previewImgURL})` }}
                                                onClick={()=>this.openPreviewImage()}
                                            ></div>
                                            <label className='label-upload' htmlFor="previewImg">Tải ảnh<i className='fas fa-upload'></i></label>
                                        </div>
            
                                    </div>
                                    <div className='col-10'>
                                        <input className={this.state.name===''?'form-control candidate-name':'form-control candidate-name active'} type='text'
                                        onChange={(event)=>this.handleOnChangeSelect(event,'name')}
                                        placeholder='Họ và tên'
                                        value={this.state.name}
                                        />
                                    </div>
                                    <div className='col-7'>
                                        <input className='form-control candidate-position' type='text'
                                        onChange={(event)=>this.handleOnChangeSelect(event,'position')}
                                        placeholder='Vị trí ứng tuyển'
                                        value={this.state.position}
                                        />
                                    </div>
                                    <div className='col-12'>
                                        <label className='title-input-CV'>Thông tin cá nhân ----------------</label>
                                    </div>
                                    <div className='col-12'>
                                        <span><FontAwesomeIcon icon={faCalendar}/> </span>
                                        <label>Ngày sinh</label>
                                        <DatePicker className='form-control'
                                        value={this.state.dayOfBirth}
                                        onChange={(event)=>this.handleOnChangeDayOfBirth(event)}
                                        />
                                    </div>
                                    <div className='col-12'>
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
                                        <span><FontAwesomeIcon icon={faPhone}/> </span>
                                        <label>Số điện thoại</label>
                                        <input className='form-control' type='text'
                                        onChange={(event)=>this.handleOnChangeSelect(event,'phonenumber')}
                                        placeholder='Số điện thoại'
                                        value={this.state.phonenumber}
                                        />
                                    </div>
                                    <div className='col-12'>
                                        <span><FontAwesomeIcon icon={faEnvelope}/> </span>
                                        <label>Email</label>
                                        <input className='form-control' type='email'
                                        onChange={(event)=>this.handleOnChangeSelect(event,'email')}
                                        placeholder='Email'
                                        value={this.state.email}
                                        />
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
                                        <label className='title-input-CV'><FontAwesomeIcon icon={faBullseye}/> Mục tiêu nghề nghiệp</label>
                                        <textarea className='textInput form-control'
                                        onChange={(event)=>this.handleOnChangeSelect(event,'goals')}
                                        
                                        placeholder='Mục tiêu của bạn'
                                        value={this.state.goals}
                                        >

                                        </textarea>
                                    </div>
                                    <div className='col-12'>
                                        <label className='title-input-CV'> <FontAwesomeIcon icon={faComputer}/> Kỹ năng</label>
                                        <textarea className='textInput form-control'
                                        onChange={(event)=>this.handleOnChangeSelect(event,'skills')}
                                        placeholder='Kỹ năng của bạn'
                                        value={this.state.skills}
                                        >

                                        </textarea>
                                    </div>
                                    <div className='col-12'>
                                        <label className='title-input-CV'><FontAwesomeIcon icon={faFootball}/> Sở thích</label>
                                        <textarea className='textInput form-control'
                                        onChange={(event)=>this.handleOnChangeSelect(event,'hobbies')}
                                        placeholder='Sở thích của bạn'
                                        value={this.state.hobbies}
                                        >
                                        </textarea>
                                    </div>
                                    

                                    
                                </div>

                                <div className='cv-create-content-right row'>
                                    <div className='col-12'>
                                        <label className='title-input-CV'><FontAwesomeIcon icon={faUserGraduate}/> Học vấn </label>
                                        <textarea className='textInput form-control'
                                        onChange={(event)=>this.handleOnChangeSelect(event,'education')}
                                        placeholder='- Tên trường học&#10;- Ngành học/Môn học&#10;- Mô tả quá trình học tập hoặc thành tích của bạn '
                                        value={this.state.education}
                                        >
                                        </textarea>
                                        
                                    </div>
                                    <div className='col-12'>
                                        <label className='title-input-CV'><FontAwesomeIcon icon={faUserTie}/> Kinh nghiệm làm việc</label>
                                        <textarea className='textInput form-control'
                                        onChange={(event)=>this.handleOnChangeSelect(event,'experience')}
                                        placeholder='- Vị trí công việc&#10;- Tên công ty&#10;- Mô tả kinh nghiệm làm việc của bạn '
                                        value={this.state.experience}
                                        >

                                        </textarea>
                                    </div>
                                    <div className='col-12'>
                                        <label className='title-input-CV'><FontAwesomeIcon icon={faPersonDigging}/> Hoạt động </label>
                                        <textarea className='textInput form-control'
                                        onChange={(event)=>this.handleOnChangeSelect(event,'activities')}
                                        placeholder='- Vị trí tổ chức&#10;- Vị trí của bạn&#10;- Mô tả hoạt động'
                                        value={this.state.activities}
                                        >

                                        </textarea>
                                    </div>
                                    <div className='col-12'>
                                        <label className='title-input-CV'><FontAwesomeIcon icon={faStamp}/> Chứng chỉ</label>
                                        <textarea className='textInput form-control'
                                        onChange={(event)=>this.handleOnChangeSelect(event,'certificate')}
                                        placeholder='- Tên chứng chỉ&#10;- Thời gian'
                                        value={this.state.certificate}
                                        >

                                        </textarea>
                                    </div>
                                    <div className='col-12'>
                                        <label className='title-input-CV'><FontAwesomeIcon icon={faAward}/> Danh hiệu và giải thưởng</label>
                                        <textarea className='textInput form-control'
                                        onChange={(event)=>this.handleOnChangeSelect(event,'awards')}
                                        placeholder='- Tên giải thưởng&#10;- Thời gian'
                                        value={this.state.awards}
                                        >

                                        </textarea>
                                    </div>
                                    <div className='col-12'>
                                        <label className='title-input-CV'><FontAwesomeIcon icon={faCircleInfo}/> Thông tin thêm </label>
                                        <textarea className='textInput form-control'
                                        onChange={(event)=>this.handleOnChangeSelect(event,'moreInf')}
                                        placeholder='Điền thông tin thêm (nếu có)'
                                        value={this.state.moreInf}
                                        >

                                        </textarea>
                                    </div>
                                    

                                    
                                </div>
                                <div className='col-12'>
                                    <button className='create-cv'
                                    onClick={()=>this.handleCreateCv()}
                                    >Tạo CV</button>
                                </div>

                            </div>



                        </div>
                    </div>
                    }

                    {this.state.isOpen===true &&
                        <Lightbox
                            mainSrc={this.state.previewImgURL}
                            onCloseRequest={() => this.setState({ isOpen: false })}
                        />
                    }
                    {this.state.cvAction==="edit"&&
                        <EditCv
                        cvNameFromCheckInfoModal={this.state.cvNameFromCheckInfoModal}
                        ToEditFromCheckInfoModal={this.state.ToEditFromCheckInfoModal}
                        isNotFromCheckInfoModal={this.isNotFromCheckInfoModal}
                        />
                    }
                    
                    

                </div>
            }
            {this.state.myCV&&
                <MyCv
                handleToEidtCvFromCandidate={this.handleToEidtCvFromCandidate}
                />
            }
            {this.state.personalInf&&
                <>
                    <PersonalInfo
                    />
                </>
            }
            {this.state.history&&
                <>
                    <History
                    />
                </>
            }
            </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(Candidate);

