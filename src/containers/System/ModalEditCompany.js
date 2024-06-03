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
import { getAllCodeService,createNewCompanyService,updateCompanyInfoService } from '../../services/userService';
import { toast } from 'react-toastify';


const mdParser = new MarkdownIt

class ModalEditCompany extends Component {
    constructor(props){
        super(props);
        this.state = {
            locationArr:[],
            industryArr:[],
            sizeArr:[],


            id:'',

            previewImgURLCompany:'',
            isOpenImgCompany:false,

            companyLocation:'',
            companyIndustry:'',
            size:'',
            companyName:'',
            companyDescriptionMarkdown:'',
            companyDescriptionHTML:'',
            companyImage:'',
            address:'',
            
        }
        
    }
    

    async componentDidMount () {
        await this.getAllDataFromService()
        if(this.props.companyInfo){
            this.getParentData(this.props.companyInfo)
        }
    }
    async componentDidUpdate (prevProps, prevState, snapshot){
        if(prevProps.companyInfo !== this.props.companyInfo){
            if(this.props.companyInfo){
                this.getParentData(this.props.companyInfo)
            }
        }
        
    }
    getParentData=(companyInfo)=>{
        let imageBase64='';
        if(companyInfo.companyImage){
            imageBase64 = new Buffer(companyInfo.companyImage,'base64').toString('binary')
        }
        this.setState({
            id : companyInfo.id,
            companyName:companyInfo.companyName,
            address:companyInfo.address,
            companyLocation:companyInfo.companyLocation,
            companyIndustry:companyInfo.companyIndustry,
            size:companyInfo.size,
            companyDescriptionMarkdown:companyInfo.companyDescriptionMarkdown,
            companyDescriptionHTML:companyInfo.companyDescriptionHTML,
            companyImage: imageBase64,
            previewImgURLCompany:imageBase64,
        })
    

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
    //update company
    handleUpdateCompany = async()=>{
        let isValid=this.checkValidateInput();
        if(isValid === true){
            let res = await updateCompanyInfoService({
                id : this.state.id,
                companyName : this.state.companyName,
                companyDescriptionMarkdown : this.state.companyDescriptionMarkdown,
                companyDescriptionHTML : this.state.companyDescriptionHTML,
                companyImage : this.state.companyImage,
                companyLocation : this.state.companyLocation,
                companyIndustry : this.state.companyIndustry,
                size : this.state.size,
                address : this.state.address
            });
            if(res.errCode===0){
                toast.success('Cập nhật công ty thành công !!!')
            }else{
                toast.error('Cập nhật công ty thất bại...')
            }
        }
    }
    render() {
        let location = this.state.locationArr
        let industry = this.state.industryArr
        let sizeArr = this.state.sizeArr
        //console.log('states: ',this.state)
        // console.log('check child props', this.props);
        //console.log('check child open modals', this.props.isOpen);
        return (
            <Modal
                isOpen={this.props.isOpen} 
                toggle={()=>this.toggle()} 
                className={'modal-user-container'}
                size="lg"
            >
            <ModalHeader toggle={()=>this.toggle()}>Sửa thông tin công ty</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                    <div className='col-12'></div>
                    <div className='col-3'>
                        <label>Tên</label>
                        <input className='form-control' type='text'
                        onChange={(event)=>this.handleOnChangeSelect(event,'companyName')}
                        placeholder='Nhập tên công ty'
                        value={this.state.companyName}
                        />
                    </div>
                    <div className='col-3'>
                        <label>Vị trí</label>
                        <select className='form-control'
                        onChange={(event)=>this.handleOnChangeSelect(event,'companyLocation')}
                        defaultValue={this.state.companyLocation}
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
                        defaultValue={this.state.companyIndustry}
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
                        defaultValue={this.state.size}
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
                        value={this.state.address}
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
                <Button color="primary" className='px-3' onClick={()=>this.handleUpdateCompany()}>Lưu</Button>{' '}
                <Button color="secondary" className='px-3' onClick={()=>this.toggle()}>Hủy</Button>{' '}
            </ModalFooter>

            {this.state.isOpenImgCompany===true &&
                <Lightbox
                    mainSrc={this.state.previewImgURLCompany}
                    onCloseRequest={() => this.setState({ isOpenImgCompany: false })}
                />
            }
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditCompany);





