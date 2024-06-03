import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRegular} from '@fortawesome/free-regular-svg-icons'
import {faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { getAllCv,applyCv } from '../../services/candidateService';
import {toast} from "react-toastify"

import './ModalApplyJob.scss'
import ModalCvInfo from './ModalCvInfo';

class ModalApplyJob extends Component {

    constructor(props){
        super(props);
        this.state = {
            CvArr:'',

            cvName:'',
            cvId:'',
            image:'',
            previewImgURLFromEdit:'',
            isOpen:false,

            candidateId:'',
            fullName: '',
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

            isOpenModalCvInfo:false,
        }
        
    }
    componentDidMount() {
        //let imageBase64 = new Buffer(this.props.cvDetailFromParent.image,'base64').toString('binary')
        // console.log('img base64: ', imageBase64)
        if(this.props.userInfo){
            this.getAllCvById(this.props.userInfo.id)
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.userInfo !== this.props.userInfo){
            this.getAllCvById(this.props.userInfo.id)
        }
        
    }


    toggle=()=>{
        this.props.toggleFromParent();
    }
    
    getAllCvById=async(userId)=>{
        try {
            let resCv = await getAllCv(userId)
            let imageBase64 = new Buffer(resCv.data[0].image,'base64').toString('binary')
            
            this.setState({
                CvArr:resCv.data,
                cvName:resCv.data[0].cvName,
                cvId: resCv.data[0].id,
                candidateId:resCv.data[0].candidateId,
                fullName: resCv.data[0].fullName,
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
        } catch (e) {
            console.log(e)
        }
    }
    //choose cv
    handleOnChangeCvName=(event)=>{
        for(let i = 0;i<this.state.CvArr.length;i++){
            if(this.state.CvArr[i].cvName===event.target.value){
                let imageBase64 = new Buffer(this.state.CvArr[i].image,'base64').toString('binary')
                

                this.setState({
                    cvName:this.state.CvArr[i].cvName,
                    cvId: this.state.CvArr[i].id,
                    fullName: this.state.CvArr[i].fullName,
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
    //toggle modal
    toggleModalCvInfo=()=>{ 
        this.setState({
            isOpenModalCvInfo : !this.state.isOpenModalCvInfo
        })
    }
    //apply cv
    handleApplyCv=async()=>{
        let res=await applyCv({
            recruitmentId: this.props.RecruitmentDetail.id,
            candidateId : this.state.candidateId,
            cvName:this.state.cvName,

            fullName : this.state.fullName,
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
            image : this.state.image,
        })
        if(res.errCode===0){
            toast.success('Nộp CV thành công !!!')
        }else{
            toast.error('Nộp CV thất bại...')
        }
    }

    render() {
        //console.log('states: ',this.state)
        //console.log('check child props', this.props.RecruitmentDetail.id);
        //console.log('user info', this.props.userInfo);

        return (
            
            <Modal
                isOpen={this.props.isOpen} 
                toggle={()=>this.toggle()} 
                className={'modal-user-container'}
                size="lg"
            >
            <ModalHeader toggle={()=>this.toggle()}>Ứng tuyển {this.props.RecruitmentDetail.title}</ModalHeader>
            <ModalBody>
                <ModalCvInfo
                isOpen={this.state.isOpenModalCvInfo}
                cvDetailFromParent={this.state}
                toggleFromParent={this.toggleModalCvInfo}
                previewImgFromParent={this.state.previewImgURLFromEdit}
                // RecruitmentDetail={this.state.RecruitmentDetail}
                />
                <div className="job-apply-form">
                    <div className="choose-cv-title">
                        <span><FontAwesomeIcon icon={faCircleUser}/> </span>
                        <div className='choose-cv-to-apply'>Chọn CV để ứng tuyển</div>
                    </div>
                    <div className='choose-cv-in-library'>Chọn cv trong thư viện</div>
                    <div className="choose-in-my-cv">
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
                        <span className='see-more' onClick={()=>this.toggleModalCvInfo()}>xem</span>
                    </div>

                    
                        
              
                </div>
            </ModalBody>
            <ModalFooter>
                <Button className='px-3 apply' onClick={()=>this.handleApplyCv()}>Nộp hồ sơ</Button>{' '}
                <Button className='px-3 cancel' onClick={()=>this.toggle()}>Hủy</Button>{' '}
            </ModalFooter>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalApplyJob);





