import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './HomeHeader.scss'
import ModalCreateEmployer from './ModalCreateEmployer';
import * as actions from "../../store/actions";
import {path} from '../../../src/utils/constant'
import { Toast } from 'reactstrap';
import { toast } from 'react-toastify';

class HomeHeader extends Component {
    constructor(props){
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalCreateEmployer : false,
        }
    }

    changeLanguage=(language)=>{
        this.props.changeLanguageAppRedux(language);
        //fire redux event (actions)
        
    }
    returnToHome=()=>{
        this.props.history.push(`/home`)
    }
    signUpEmployer=()=>{
        this.props.history.push(path.SIGNUPEMPLOYER)
        
    }
    signUpCandidate=()=>{
        this.props.history.push(path.SIGNUPCANDIDATE)
    }
    toggleModalCreateEmployer=()=>{
        this.setState({
            isOpenModalCreateEmployer:! this.state.isOpenModalCreateEmployer
        })
    }
    handleLoginFromHome=()=>{
        this.props.history.push(path.LOGIN)
    }
    
    LogOut=()=>{
        this.props.history.push(path.HOMEPAGE)
        this.props.processLogout()
    }
    toMyWork=()=>{
        if(this.props.isLoggedIn){
            if(this.props.userInfo&&this.props.userInfo.roleId==='R2'){
                this.props.history.push(path.RECRUITMENT)
            }
            if(this.props.userInfo&&this.props.userInfo.roleId==='R3'){
                this.props.history.push(path.CANDIDATE)
            }
        }else{
            toast.error('Bạn chưa đăng nhập !')
        }
        
    }
    toCompanies=()=>{
        if(this.props.isLoggedIn){
            this.props.history.push(path.COMPANIES)
        }else{
            toast.error('Bạn chưa đăng nhập !')
        }
    }
    toNewRecruitment=()=>{
        if(this.props.isLoggedIn){
            this.props.history.push({pathname:'/recruitment',
                state:{fromNewRecruiment:true}
            })
        }else{
            toast.error('Bạn chưa đăng nhập !')
        }

    }
    toNewCv=()=>{
        if(this.props.isLoggedIn){
            this.props.history.push({pathname:'/candidate',
                state:{fromNewCv:true}
            })
        }else{
            toast.error('Bạn chưa đăng nhập !')
        }

    }
    render() {
        let {userInfo} = this.props
        let {isLoggedIn} = this.props
        //console.log('is loggin: ', isLoggedIn);
        //console.log('user info: ', userInfo);
        // console.log('props: ',this.props)
        
        return (
            <React.Fragment>
            <div className='home-header-container'>
                <div className='home-header-content'>
                    <div className='left-content'>
                        <i className='fas fa-bars'></i>
                        <span className='header-logo' onClick={()=>this.returnToHome()}></span>
                    </div>
                    <div className='center-content'>
                        <div className='child-content'>
                            <span onClick={()=>this.returnToHome()}><b>Việc làm</b></span>
                            <div className='subs-title'>Tìm việc làm & Tuyển dụng nhanh chóng</div>
                        </div>
                        <div className='child-content'>
                        {isLoggedIn===true&&userInfo.roleId==='R2'&&
                            <>
                            <span onClick={()=>this.toNewRecruitment()}><b>Tin tuyển dụng</b></span>
                            <div className='subs-title'>Đăng tin tuyển dụng</div>
                            </>
                        }
                        {isLoggedIn===true&&userInfo.roleId==='R3'&&
                            <>
                            <span onClick={()=>this.toNewCv()}><b>Hồ sơ & CV</b></span>
                            <div className='subs-title'>Tạo CV trực tuyến</div>
                            </>
                        }
                        {isLoggedIn===false&&
                            <>
                            <span><b>Hồ sơ & CV</b></span>
                            <div className='subs-title'>Tạo CV trực tuyến</div>
                            </>
                        }
                        </div>

                        <div className='child-content'>
                            <span onClick={()=>this.toCompanies()}><b>Công ty</b></span>
                            <div className='subs-title'>Xem danh sách các công ty</div>
                        </div>
                        

                        <div className='child-content'>
                            <span onClick={()=>this.toMyWork()}><b>Việc của tôi</b></span>
                            <div className='subs-title'>Quản lý tuyển dụng dễ dàng</div>
                        </div>
                    </div>
                    <div className='right-content'>
                        <span className='account'>
                            {this.props.isLoggedIn===true&&this.props.userInfo.lastName&&this.props.userInfo.firstName?
                            `Xin chào, ${this.props.userInfo.lastName} ${this.props.userInfo.firstName}`
                            : <button className='logIn-btn'
                            onClick={()=>this.handleLoginFromHome()}
                            >Đăng nhập</button>}
                        </span>
                        {this.props.isLoggedIn===true&&
                            <span className='logout-symbol'><i className="fas fa-sign-out-alt" onClick={()=>this.LogOut()}></i></span>
                        }

                        <div className='support'><i className='fas fa-question-circle'></i>
                            Hỗ trợ
                        </div>
                    </div>
                </div>
            </div>
            
                {this.props.isShowBanner===true&&
                <div className='home-header-banner'>
                    <div className='content-up'>
                        <div className='title1'>Trang web tuyển dụng nhanh chóng và tiện lợi</div>
                        <div className='title2'>Mang công việc đến cho bạn</div>
                        {!this.props.isLoggedIn?
                        <div className='sign-up'>
                            <button className='as-employer' onClick={()=>this.signUpEmployer()}>Đăng ký với tư cách nhà tuyển dụng</button>
                            <button className='as-candidate' onClick={()=>this.signUpCandidate()}>Đăng ký với tư cách ứng viên</button>
                        </div>:
                        <div className='title-logged-in'>Work Fast</div>
                        }
                    </div>
                    
                    
                    <div className='content-down'>
                        <ModalCreateEmployer
                         isOpen={this.state.isOpenModalCreateEmployer}
                        toggleFromParent={this.toggleModalCreateEmployer}
                        // createNewUser = {this.createNewUser}
                        />
                    </div>
                </div>
                }
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo : state.user.userInfo,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
