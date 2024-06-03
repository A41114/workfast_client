import React, { Component } from 'react';

import { connect } from 'react-redux';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'


import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { CommonUtils } from '../../utils';

import { emitter } from '../../utils/emitter';
import { getAllCodeService,createNewCompanyService } from '../../services/userService';
import {ChangeEmployerCompany}from '../../services/employerService'

import { toast } from 'react-toastify';
import * as actions from "../../store/actions";


const mdParser = new MarkdownIt

class ModalCreateCompany extends Component {
    constructor(props){
        super(props);
        this.state = {
            roleId:'',

            license:'',
            previewImgURLLicense:'',
            isOpenLicense:false,


            status:'',

            locationArr:[],
            industryArr:[],
            sizeArr:[],

            previewImgURLCompany:'',
            isOpenImgCompany:false,

            companyLocation:'',
            companyIndustry:'',
            size:'',
            companyName:'',
            companyDescriptionMarkdown:'',
            companyDescriptionHTML:'',
            companyImage:'',
            address:''
        }
        
    }
    

    async componentDidMount () {
        await this.getAllDataFromService()
        if(this.props.userInfo){
            let status = ''
            if(this.props.userInfo.roleId==='R1'){
                status='Đang hoạt động'
            }else {
                status='Đợi xác nhận'
            }
            this.setState({
                roleId:this.props.userInfo.roleId,
                status:status
            })
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.userInfo!==this.props.userInfo){
            if(this.props.userInfo){
                this.setState({
                    roleId:this.props.userInfo.roleId
                })
            }
        }
        
    }
    getAllDataFromService=async()=>{
        let resLoc = await getAllCodeService('LOCATION');
        let resIn = await getAllCodeService('INDUSTRY');
        let resSize = await getAllCodeService('SIZE')
        this.setState({
            locationArr:resLoc.data,
            industryArr:resIn.data,
            sizeArr : resSize.data,
            companyLocation:resLoc.data[0].value,
            companyIndustry:resIn.data[0].value,
            size:resSize.data[0].value,


            //Change to deafault
            companyName:'',
            address :'',
            companyDescriptionMarkdown:'',
            companyDescriptionHTML:'',
            companyImage:'',
            previewImgURLCompany:'',
            isOpenImgCompany:false,

        })

    }

    toggle=()=>{
        this.componentDidMount();
        this.props.toggleFromParent();
    }
    handleOnChangeSelect=(event,id)=>{
        let copyState = {...this.state};
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
        
    }
    //image company
    handleOnChangeImageCompany= async (event)=>{
        let data =event.target.files;
        let file = data[0];
        
        if(file){
            let base64 = await CommonUtils.getBase64(file);
            // //console.log('check base64 image: ',base64)
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURLCompany:objectUrl,
                companyImage:base64
            })
        
        }
        
    }
    openPreviewImageCompany=()=>{
        if(!this.state.previewImgURLCompany) return;
        this.setState({
            isOpenImgCompany:true
        })
    }
    //image license 
    handleOnChangeLicense= async (event)=>{
        let data =event.target.files;
        let file = data[0];
        
        if(file){
            let base64 = await CommonUtils.getBase64(file);
            //console.log('check base64 image: ',base64)
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURLLicense:objectUrl,
                license:base64
            })
        
        }
        
    }
    openPreviewImageLicense=()=>{
        if(!this.state.previewImgURLLicense) return;
        this.setState({
            isOpenLicense:true
        })
    }
    //Markdown
    handleMarkdownChange=({html,text})=>{
        this.setState({
            companyDescriptionMarkdown:text,
            companyDescriptionHTML:html,
        })
    }
    //Check validate
    checkValidateInput = ()=>{
        let isValid=true;
        let arrCheck=['companyName']
            for(let i=0; i< arrCheck.length;i++){
                if(!this.state[arrCheck[i]]){
                    isValid=false;
                    alert('Thiếu trường bắt buộc: '+arrCheck[i])
                    break;
                }
            }

        return isValid
    }
    handleAddNewCompany = async()=>{
        let isValid=this.checkValidateInput();
        if(isValid === true){
            let res = await createNewCompanyService({
                companyName : this.state.companyName,
                companyDescriptionMarkdown : this.state.companyDescriptionMarkdown,
                companyDescriptionHTML : this.state.companyDescriptionHTML,
                companyImage : this.state.companyImage,
                companyLocation : this.state.companyLocation,
                companyIndustry : this.state.companyIndustry,
                size : this.state.size,
                address : this.state.address,
                license:this.state.license,
                status : this.state.status,
            });
            if(res.errCode===0){
                if(this.props.isOpenFromEmployer){
                    //this.props.getNewCompanyId(res.newCompany.id)
                    await ChangeEmployerCompany({
                        newCompanyId:res.newCompany.id,
                        employerId:this.props.userInfo.id
                    })
                    this.props.userReLogin(this.props.userInfo.id)
                }
                toast.success('Tạo mới công ty thành công !!!')
            }else{
                toast.error('Tạo mới công ty thất bại...')
            }
        }
    }
    

    render() {
        let location = this.state.locationArr
        let industry = this.state.industryArr
        let sizeArr = this.state.sizeArr
        //console.log('states: ',this.state)
        //console.log('check child props', this.props);
        //console.log('check child open modals', this.props.isOpen);
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={()=>this.toggle()} 
                className={'modal-user-container'}
                size="lg"
            >
            <ModalHeader toggle={()=>this.toggle()}>Tạo mới công ty</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                    <div className='col-12'></div>
                    <div className='col-3'>
                        <label>Tên</label>
                        <input className='form-control' type='text'
                        onChange={(event)=>this.handleOnChangeSelect(event,'companyName')}
                        placeholder='Nhập tên công ty'
                        />
                    </div>
                    <div className='col-3'>
                        <label>Vị trí</label>
                        <select className='form-control'
                        onChange={(event)=>this.handleOnChangeSelect(event,'companyLocation')}
                        >
                        {location&&location.length>0&&
                        location.map((item, index)=>{
                            return(
                                <option key={index}>{item.value}</option>
                            )
                        })
                        }
                        </select>
                    </div>
                    <div className='col-3'>
                        <label>Lĩnh vực</label>
                        <select className='form-control'
                        onChange={(event)=>this.handleOnChangeSelect(event,'companyIndustry')}
                        >
                        {industry&&industry.length>0&&
                        industry.map((item, index)=>{
                            return(
                                <option key={index}>{item.value}</option>
                            )
                        })
                        }
                        </select>
                    </div>
                    <div className='col-3'>
                        <label>Quy mô</label>
                        <select className='form-control'
                        onChange={(event)=>this.handleOnChangeSelect(event,'size')}
                        >
                        {sizeArr&&sizeArr.length>0&&
                        sizeArr.map((item, index)=>{
                            return(
                                <option key={index}>{item.value}</option>
                            )
                        })
                        }
                        </select>
                    </div>
                    <div className='col-6'>
                        <label>Địa chỉ</label>
                        <input className='form-control' type='text'
                        onChange={(event)=>this.handleOnChangeSelect(event,'address')}
                        placeholder='Nhập địa chỉ'
                        />
                    </div>
                    <div className='col-3'>
                        <label>Ảnh công ty</label>
                        <div className='preview-img-container'>
                            <input id='previewImgCompany' type='file' hidden
                            onChange={(event)=>this.handleOnChangeImageCompany(event)}/>
                            <label className='label-upload' htmlFor="previewImgCompany">Tải ảnh<i className='fas fa-upload'></i></label>
                            <div className='preview-image'
                            previewImgURLCompany
                                style={{backgroundImage: `url(${this.state.previewImgURLCompany})` }}
                                onClick={()=>this.openPreviewImageCompany()}
                            ></div>
                        </div>
                    </div>

                    {this.state.roleId==='R10'&&
                        <div className='col-3'>
                            <label>Giấy phép kinh doanh</label>
                            <div className='preview-img-container'>
                                    <input id='previewImgLicense' type='file' hidden
                                    onChange={(event)=>this.handleOnChangeLicense(event)}/>
                                    <label className='label-upload' htmlFor="previewImgLicense">Tải ảnh<i className='fas fa-upload'></i></label>
                                    <div className='preview-image'
                                    previewImgURLLicense
                                        style={{backgroundImage: `url(${this.state.previewImgURLLicense})` }}
                                        onClick={()=>this.openPreviewImageLicense()}
                                    ></div>
                                </div>
                        </div>
                    }

                    <div className='col-12 my-5'>
                        <label>Giới thiệu/Mô tả</label>
                        <MdEditor style={{ height: '500px' }} renderHTML={text=>mdParser.render(text)} 
                        onChange={this.handleMarkdownChange}
                        value={this.state.companyDescriptionMarkdown}
                        />;
                    </div>
                    
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" className='px-3' onClick={()=>this.handleAddNewCompany()}>Tạo mới</Button>{' '}
                <Button color="secondary" className='px-3' onClick={()=>this.toggle()}>Hủy</Button>{' '}
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
        userReLogin:(userData)=>dispatch(actions.userReLoginStart(userData)),
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateCompany);





