import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRegular} from '@fortawesome/free-regular-svg-icons'
import {faUsers, faUser, faCircleInfo, faClockRotateLeft, faListCheck, faCalendar, faPhone, faEnvelope, faLocationDot, faBullseye, faComputer, faFootball, faUserGraduate, faUserTie, faPersonDigging, faStamp, faAward } from '@fortawesome/free-solid-svg-icons'

import DatePicker from '../../components/Input/DatePicker';
import './ModalCvInfo.scss'

class ModalCvInfo extends Component {

    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
            firstName:'',
            lastName:'',
            address:'',

            cVNameModalState:''
        }
        
    }
    componentDidMount() {
        //let imageBase64 = new Buffer(this.props.cvDetailFromParent.image,'base64').toString('binary')
        // console.log('img base64: ', imageBase64)
    }


    toggle=()=>{
        this.props.toggleFromParent();
    }
    handleEditFromCheckInfoCvModal=()=>{
        //console.log('this.prop: ', this.props.cvDetailFromParent.cvName)
        this.props.handleCheckCvInfoFromMyCv(this.props.cvDetailFromParent.cvName)
        
    }
    
    

    render() {
        //console.log('check child props', this.props);
        return (
            <Modal
                isOpen={this.props.isOpen} 
                //isOpen={true} 
                toggle={()=>this.toggle()} 
                className={'modal-user-container'}
                size="lg"
            >
            <ModalHeader toggle={()=>this.toggle()}>{this.props.cvDetailFromParent.cvName}</ModalHeader>
            <ModalBody>
                <div className="cv-create-form">
                        <div className='container'>

                            <div className='row mx-1 cv-create-content'>        
                                <div className='cv-create-content-left'>
                                    
                                    <div className='col-12'>
                                        <div className='preview-img-container'>
                                            <input id='previewImg' type='file' hidden
                                            />
                                            <div className='preview-image'
                                            previewImgURL
                                                style={{backgroundImage: `url(${this.props.previewImgFromParent})` }}
                                            ></div>
                                        </div>
            
                                    </div>
                                    <div className='col-10'>
                                        <input className='form-control candidate-name active' type='text'
                                        value={this.props.cvDetailFromParent.fullName}
                                        disabled
                                        />
                                    </div>
                                    <div className='col-7'>
                                        <input className='form-control candidate-position' type='text'
                                        value={this.props.cvDetailFromParent.position}
                                        disabled
                                        />
                                    </div>
                                    <div className='col-12'>
                                        <label className='title-input-CV'>Thông tin cá nhân ----------------</label>
                                    </div>
                                    <div className='col-12'>
                                        <span><FontAwesomeIcon icon={faCalendar}/> </span>
                                        <label>Ngày sinh</label>
                                        <DatePicker className='form-control'
                                        value={this.props.cvDetailFromParent.dayOfBirth}
                                        disabled
                                        />
                                    </div>
                                    <div className='col-12'>
                                        <span><FontAwesomeIcon icon={faUser}/> </span>
                                        <label>Giới tính</label>
                                        <input className='form-control' type='text'
                                        value={this.props.cvDetailFromParent.gender}
                                        disabled
                                        />
                                    </div>
                                    <div className='col-12'>
                                        <span><FontAwesomeIcon icon={faPhone}/> </span>
                                        <label>Số điện thoại</label>
                                        <input className='form-control' type='text'
                                        value={this.props.cvDetailFromParent.phonenumber}
                                        disabled
                                        />
                                    </div>
                                    <div className='col-12'>
                                        <span><FontAwesomeIcon icon={faEnvelope}/> </span>
                                        <label>Email</label>
                                        <input className='form-control' type='text'
                                        value={this.props.cvDetailFromParent.email}
                                        disabled
                                        />
                                    </div>
                                    <div className='col-12'>
                                        <span><FontAwesomeIcon icon={faLocationDot}/> </span>
                                        <label>Địa chỉ</label>
                                        <input className='form-control' type='text'
                                        value={this.props.cvDetailFromParent.address}
                                        disabled
                                        />
                                    </div>
                                    <div className='col-12'>
                                        <label className='title-input-CV'><FontAwesomeIcon icon={faBullseye}/> Mục tiêu nghề nghiệp</label>
                                        <textarea className='textInput form-control'
                                        value={this.props.cvDetailFromParent.goals}
                                        disabled
                                        >
                                        </textarea>
                                    </div>
                                    <div className='col-12'>
                                        <label className='title-input-CV'> <FontAwesomeIcon icon={faComputer}/> Kỹ năng</label>
                                        <textarea className='textInput form-control'
                                        value={this.props.cvDetailFromParent.skills}
                                        disabled
                                        >
                                        </textarea>
                                    </div>
                                    <div className='col-12'>
                                        <label className='title-input-CV'><FontAwesomeIcon icon={faFootball}/> Sở thích</label>
                                        <textarea className='textInput form-control'
                                        value={this.props.cvDetailFromParent.hobbies}
                                        disabled
                                        >
                                        </textarea>
                                    </div>
                                </div>

                                <div className='cv-create-content-right row'>
                                    <div className='col-12'>
                                        <label className='title-input-CV'><FontAwesomeIcon icon={faUserGraduate}/> Học vấn </label>
                                        <textarea className='textInput form-control'
                                        value={this.props.cvDetailFromParent.education}
                                        disabled
                                        >
                                        </textarea>
                                        
                                    </div>
                                    <div className='col-12'>
                                        <label className='title-input-CV'><FontAwesomeIcon icon={faUserTie}/> Kinh nghiệm làm việc</label>
                                        <textarea className='textInput form-control'
                                        value={this.props.cvDetailFromParent.experience}
                                        disabled
                                        >
                                        </textarea>
                                    </div>
                                    <div className='col-12'>
                                        <label className='title-input-CV'><FontAwesomeIcon icon={faPersonDigging}/> Hoạt động </label>
                                        <textarea className='textInput form-control'
                                        value={this.props.cvDetailFromParent.activities}
                                        disabled
                                        >
                                        </textarea>
                                    </div>
                                    <div className='col-12'>
                                        <label className='title-input-CV'><FontAwesomeIcon icon={faStamp}/> Chứng chỉ</label>
                                        <textarea className='textInput form-control'
                                        value={this.props.cvDetailFromParent.certificate}
                                        disabled
                                        >
                                        </textarea>
                                    </div>
                                    <div className='col-12'>
                                        <label className='title-input-CV'><FontAwesomeIcon icon={faAward}/> Danh hiệu và giải thưởng</label>
                                        <textarea className='textInput form-control'
                                        value={this.props.cvDetailFromParent.awards}
                                        disabled
                                        >
                                        </textarea>
                                    </div>
                                    <div className='col-12'>
                                        <label className='title-input-CV'><FontAwesomeIcon icon={faCircleInfo}/> Thông tin thêm </label>
                                        <textarea className='textInput form-control'
                                        value={this.props.cvDetailFromParent.moreInf}
                                        disabled
                                        >
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" className='px-3' onClick={()=>this.toggle()}>Đóng</Button>{' '}
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalCvInfo);





