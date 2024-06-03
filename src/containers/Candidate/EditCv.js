import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import './EditCv.scss';

import {getAllCv, EditCvService} from '../../services/candidateService'
import DatePicker from '../../components/Input/DatePicker';

import moment from 'moment';
import {toast} from "react-toastify"

import Lightbox from 'react-image-lightbox'
import { CommonUtils } from '../../utils'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRegular} from '@fortawesome/free-regular-svg-icons'
import {faUsers, faUser, faCircleInfo, faClockRotateLeft, faListCheck, faCalendar, faPhone, faEnvelope, faLocationDot, faBullseye, faComputer, faFootball, faUserGraduate, faUserTie, faPersonDigging, faStamp, faAward } from '@fortawesome/free-solid-svg-icons'


class EditCv extends Component {

    constructor(props){
        super(props);
        this.state = {
            CvArr:'',

            cvId:'',
            image:'',
            previewImgURLFromEdit:'',
            isOpen:false,

            candidateId:'',
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


            
            editFromCheckInfoModal:true,
            isFromEdit:true,
        }
    }
    
    async componentDidMount(){
        if(this.props.userInfo){
            this.getAllCvById(this.props.userInfo.id)
        }
        //console.log('Check: ',this.props.cvNameFromCheckInfoModal)
        
        
    }
    async componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.userInfo !== this.props.userInfo){
            this.getAllCvById(this.props.userInfo.id)
        }
        
    }
    getAllCvById=async(userId)=>{
        try {
            let resCv = await getAllCv(userId)
            let imageBase64 = new Buffer(resCv.data[0].image,'base64').toString('binary')
            if(this.props.cvNameFromCheckInfoModal&&this.props.ToEditFromCheckInfoModal){
                
                this.setState({
                    CvArr:resCv.data,
                })
                this.handleToEditFromCheckCvInfo() 
            }
            else{
                this.setState({
                    CvArr:resCv.data,
                    cvId: resCv.data[0].id,
                    name: resCv.data[0].fullName,
                    position:resCv.data[0].position,
                    dayOfBirth:resCv.data[0].dayOfBirth,
                    gender:resCv.data[0].gender,
                    phonenumber:resCv.data[0].phonenumber,
                    email:resCv.data[0].email,
                    address:resCv.data[0].address,
                    goals:resCv.data[0].goals,
                    skills:resCv.data[0].skills,
                    hobbies:resCv.data[0].hobbies,

                    education:resCv.data[0].education,
                    experience:resCv.data[0].experience,
                    activities:resCv.data[0].activities,
                    certificate:resCv.data[0].certificate,
                    awards:resCv.data[0].awards,
                    moreInf:resCv.data[0].moreInf,
                    image : imageBase64,
                    previewImgURLFromEdit:imageBase64,

                })
                
            }


        } catch (e) {
            console.log(e)
        }
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
                previewImgURLFromEdit:objectUrl,
                image:base64
            })
        
        }
        
    }
    openPreviewImage=()=>{
        if(!this.state.previewImgURLFromEdit) return;
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

    handleOnChangeCvName=(event)=>{
        for(let i = 0;i<this.state.CvArr.length;i++){
            if(this.state.CvArr[i].cvName===event.target.value){
                let imageBase64 = new Buffer(this.state.CvArr[i].image,'base64').toString('binary')
                

                this.setState({
                    cvId: this.state.CvArr[i].id,
                    name: this.state.CvArr[i].fullName,
                    position:this.state.CvArr[i].position,
                    dayOfBirth:this.state.CvArr[i].dayOfBirth,
                    gender:this.state.CvArr[i].gender,
                    phonenumber:this.state.CvArr[i].phonenumber,
                    email:this.state.CvArr[i].email,
                    address:this.state.CvArr[i].address,
                    goals:this.state.CvArr[i].goals,
                    skills:this.state.CvArr[i].skills,
                    hobbies:this.state.CvArr[i].hobbies,

                    education:this.state.CvArr[i].education,
                    experience:this.state.CvArr[i].experience,
                    activities:this.state.CvArr[i].activities,
                    certificate:this.state.CvArr[i].certificate,
                    awards:this.state.CvArr[i].awards,
                    moreInf:this.state.CvArr[i].moreInf,
                    image : imageBase64,
                    previewImgURLFromEdit : imageBase64,

                })     
            }
        }

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
        
        if(!this.state.name){
            isValid=false;
            alert('Thiếu tên !!!')
        }
        else if(!this.state.position){
            isValid=false;
            alert('Thiếu vị trí !!!')
        }
        return isValid
    }
    //Handle edit
    handleEditCv=async()=>{
        if(this.checkValidateInput()){
            await EditCvService({
                cvId : this.state.cvId,
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
            toast.success('Sửa CV thành công !!!!')
        }   
    }
    handleToEditFromCheckCvInfo=()=>{
        
        for(let i = 0;i<this.state.CvArr.length;i++){
            //console.log('runnnnnn!!!!')
            if(this.state.CvArr[i].cvName===this.props.cvNameFromCheckInfoModal){
                let imageBase64 = new Buffer(this.state.CvArr[i].image,'base64').toString('binary')
                

                this.setState({
                    cvId: this.state.CvArr[i].id,
                    name: this.state.CvArr[i].fullName,
                    position:this.state.CvArr[i].position,
                    dayOfBirth:this.state.CvArr[i].dayOfBirth,
                    gender:this.state.CvArr[i].gender,
                    phonenumber:this.state.CvArr[i].phonenumber,
                    email:this.state.CvArr[i].email,
                    address:this.state.CvArr[i].address,
                    goals:this.state.CvArr[i].goals,
                    skills:this.state.CvArr[i].skills,
                    hobbies:this.state.CvArr[i].hobbies,

                    education:this.state.CvArr[i].education,
                    experience:this.state.CvArr[i].experience,
                    activities:this.state.CvArr[i].activities,
                    certificate:this.state.CvArr[i].certificate,
                    awards:this.state.CvArr[i].awards,
                    moreInf:this.state.CvArr[i].moreInf,
                    image : imageBase64,
                    previewImgURLFromEdit : imageBase64,


                    isFromEdit:false,

                })     
            }
        }
        this.props.isNotFromCheckInfoModal()
        //console.log('bool after: ',this.props.ToEditFromCheckInfoModal)
        
    }

    
    render() {
        console.log('from edit', this.state.isFromEdit)
        console.log('states from cv edit', this.state)
        return (
            <>
                <div className="cv-create-form">
                    <div className='container'>
                        <div className='choose-cv-name-content'>
                            <select className='form-control cv-name-select'
                            onChange={(event)=>this.handleOnChangeCvName(event)}
                            >
                            {this.state.CvArr&&this.state.CvArr.length>0&&
                                this.state.CvArr.map((item, index)=>{
                                return(
                                    <option selected={item.cvName===this.props.cvNameFromCheckInfoModal&&!this.state.isFromEdit&&'selected'} key={index}>{item.cvName}</option>
                                )
                                })
                            }
                            </select>
                        </div>

                        <div className='row mx-1 cv-create-content'>
                            <div className='cv-create-content-left'>
                                <div className='col-12'>
                                    
                                    <div className='preview-img-container'>
                                        <input id='previewImg' type='file' hidden
                                        onChange={(event)=>this.handleOnChangeImage(event)}/>
                                        <div className='preview-image'
                                        previewImgURLFromEdit
                                            style={{backgroundImage: `url(${this.state.previewImgURLFromEdit})` }}
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
                                onClick={()=>this.handleEditCv()}
                                >Lưu CV</button>
                            </div>

                        </div>



                    </div>
                </div>

                {this.state.isOpen===true &&
                    <Lightbox
                        mainSrc={this.state.previewImgURLFromEdit}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(EditCv);
