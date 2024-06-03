import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getAllCodeService,createNewUserService,handleLoginApi,getAllCompanies } from '../../services/userService';
import './SignUpEmployer.scss'
import HomeHeader from '../HomePage/HomeHeader';

import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

import DatePicker from '../../components/Input/DatePicker';
import moment from 'moment';
import  FormattedDate  from '../../components/Formating/FormattedDate';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { CommonUtils } from '../../utils';
import * as actions from "../../store/actions";


const mdParser = new MarkdownIt


class SignUpEmployer extends Component {
    constructor(props){
        super(props);
        this.state={
            locationArr:[],
            industryArr:[],
            sizeArr:[],

            
            roleId:'R2',
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

            previewImgURLCompany:'',
            isOpenImgCompany:false,

            companyLocation:'',
            companyIndustry:'',
            companyName:'',
            companyDescriptionMarkdown:'',
            companyDescriptionHTML:'',
            companyImage:'',
            size:'',
            companyAddress:'',


            isCreateNewCompany:false,
            companyId:'',
            companyArr:'',
            locationDisabled:'',
            industryDisabled:'',

        }
    }
    async componentDidMount(){
        try {
            let resLoc = await getAllCodeService('LOCATION');
            let resIn = await getAllCodeService('INDUSTRY');
            let resSize = await getAllCodeService('SIZE');
            let resComp = await getAllCompanies();
            this.setState({
                locationArr:resLoc.data,
                industryArr:resIn.data,
                companyArr:resComp.allComp,
                sizeArr:resSize.data,
                companyLocation:resLoc.data[0].value,
                companyIndustry:resIn.data[0].value,
                companyId:resComp.allComp[0].id,
                locationDisabled:resComp.allComp[0].companyLocation,
                industryDisabled:resComp.allComp[0].companyIndustry,
                size:resSize.data[0].value,
            })
        } catch (e){
            
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
        //console.log('event: ',moment(this.state.dayOfBirth).format('DD/MM/YYYY'))
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
    //change create company
    handleIsCreateNewCompany=async()=>{
        await this.setState({
            isCreateNewCompany : !this.state.isCreateNewCompany
        })
        if(this.state.isCreateNewCompany){
            this.setState({
                companyId:'',
            })
        }else{
            this.setState({
                companyId:this.state.companyArr[0].id,
                companyName:''
            })
        }
    }
    //handle on change company
    handleOnChangeCompany=(event)=>{
        let id = +event.target.value
        let {companyArr}=this.state
        for(let i=0;i<companyArr.length;i++){
            if(companyArr[i].id===id){
                this.setState({
                    companyId:companyArr[i].id,
                    locationDisabled:companyArr[i].companyLocation,
                    industryDisabled:companyArr[i].companyIndustry,
                })
                break;
            }
        }
    }
    //check validate
    checkValidateInput = ()=>{
        let isValid=true;
        let arrCheck=['email','password','firstName','lastName',
            'phonenumber','address']
        if(this.state.isCreateNewCompany){arrCheck.push('companyName')}
            for(let i=0; i< arrCheck.length;i++){
                if(!this.state[arrCheck[i]]){
                    isValid=false;
                    alert('Thiếu trường bắt buộc: '+arrCheck[i])
                    break;
                }
            }

        return isValid
    }
    //sign up
    handleSignUp=async()=>{
        if(this.checkValidateInput()){
            try {
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

                    companyId:this.state.companyId,
                    companyName:this.state.companyName,
                    companyLocation:this.state.companyLocation,
                    companyIndustry:this.state.companyIndustry,
                    companyDescriptionMarkdown:this.state.companyDescriptionMarkdown,
                    companyDescriptionHTML:this.state.companyDescriptionHTML,
                    companyImage:this.state.companyImage,
                    size:this.state.size,
                    companyAddress:this.state.companyAddress
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
        let location = this.state.locationArr
        let industry = this.state.industryArr
        let company = this.state.companyArr
        let size = this.state.sizeArr
        
        console.log('states: ',this.state)
        return (
            <div className='user-redux-container'>
                <HomeHeader
                isShowBanner={false}
                />
                <div className='title'>
                    Đăng ký với tư cách nhà tuyển dụng
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
                            <div className='col-3'></div>
                            {!this.state.isCreateNewCompany&&
                            <div className='col-12'>Chọn công ty</div>
                            }
                            <div className='company-control'>
                                {!this.state.isCreateNewCompany&&<>
                                    <div className='col-3'>
                                        <select className='form-control'
                                        onChange={(event)=>this.handleOnChangeCompany(event)}
                                        >
                                        {company&&company.length>0&&
                                            company.map((item, index)=>{
                                            return(
                                                <option key={index} value={item.id}>{item.companyName}</option>
                                            )
                                        })
                                        }
                                        </select>
                                    </div>
                                    <div className='col-3'>
                                        <label>Địa điểm</label>
                                        <input className='form-control' disabled value={this.state.locationDisabled}/>
                                    </div>
                                    <div className='col-3'>
                                        <label>Lĩnh vực</label>
                                        <input className='form-control' disabled value={this.state.industryDisabled}/>
                                    </div>
                                    </>
                                }

                                <div className='col-12 my-3'>
                                    <button className={this.state.isCreateNewCompany?'createCompany active':'createCompany'} onClick={()=>this.handleIsCreateNewCompany()}>Tạo công ty mới</button>
                                </div>
                            </div>

                            {this.state.isCreateNewCompany&&<>
                                <div className='col-12 my-3'>Thông tin công ty</div>
                                <div className='col-3'>
                                    <label>Tên</label>
                                    <input className='form-control' type='text'
                                    onChange={(event)=>this.handleOnChangeSelect(event,'companyName')}
                                    placeholder='Nhập tên công ty'
                                    value={this.state.companyName}
                                    />
                                </div>
                                <div className='col-3'>
                                    <label>Địa điểm</label>
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
                                    {size&&size.length>0&&
                                    size.map((item, index)=>{
                                        return(
                                            <option key={index}>{item.value}</option>
                                        )
                                    })
                                    }
                                    </select>
                                </div>
                                <div className='col-9'>
                                    <label>Địa chỉ</label>
                                    <input className='form-control' type='text'
                                    onChange={(event)=>this.handleOnChangeSelect(event,'companyAddress')}
                                    placeholder='Nhập địa chỉ'
                                    value={this.state.companyAddress}
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
                                </>
                            }

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
                {this.state.isOpenImgCompany===true &&
                    <Lightbox
                        mainSrc={this.state.previewImgURLCompany}
                        onCloseRequest={() => this.setState({ isOpenImgCompany: false })}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUpEmployer));
