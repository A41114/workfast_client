import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getRecruitmentsToHomepage, getAllCompanies } from '../../services/userService';
import './Companies.scss'

import ReactPaginate from 'react-paginate';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHeart} from '@fortawesome/free-regular-svg-icons'
import { faUser, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { withRouter } from 'react-router';
import { ChangeFollowStatus,GetFollowlById } from '../../services/candidateService';

import HomeHeader from './HomeHeader';
import AboutUs from './AboutUs';

class Companies extends Component {

    constructor(props){
        super(props);
        this.state={
            
            companyArr:'',//company from service
            countCompanyRecruitments:[],//top company
            keyWords:'',//keywords in search bar
            followArr:'',//
            onlyFollowed:false,
        }
    }
    async componentDidMount(){
        this.getAllDataFromService()

    }
    getAllDataFromService=async()=>{
        let resCompany = await getAllCompanies();
        let resRecuitment = await getRecruitmentsToHomepage()


        let countCompanyRecruitments=[];

        for (let i = 0; i < resCompany.allComp.length; i++) {
            let count=0
            for (let j = 0; j < resRecuitment.recruitments.length; j++) {
                if(resRecuitment.recruitments[j].companyId===resCompany.allComp[i].id){
                    count++
                }
            }
            countCompanyRecruitments.push({id:resCompany.allComp[i].id, companyName:resCompany.allComp[i].companyName, companyImage:resCompany.allComp[i].companyImage, recruitmentCount:count,
            companyDescriptionHTML:resCompany.allComp[i].companyDescriptionHTML
            })
        }
        //sort array by recruitmentCount* normal a-b, top b-a
        countCompanyRecruitments.sort(function (a, b) {return b.recruitmentCount - a.recruitmentCount})

        // console.log('resComp: ',resCompany)
        this.setState({
            companyArr : resCompany.allComp,
            countCompanyRecruitments : countCompanyRecruitments
        })
        if(this.props.userInfo){
            if(this.props.userInfo.id){
                let follow = await GetFollowlById(this.props.userInfo.id)
                this.setState({
                    followArr : follow.follow,
                    
                })
            }
        }

    }
    async componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.userInfo !== this.props.userInfo){
            if(this.props.userInfo.id){
                let follow = await GetFollowlById(this.props.userInfo.id)
                console.log()
                this.setState({
                    followArr : follow.follow,
                    
                })
            }
        }
        
    }
    //get check follow or not
    isFollowing=(companyId)=>{
        for(let i = 0;i<this.state.followArr.length;i++){
            if(companyId===(+this.state.followArr[i].followedId)&&this.state.followArr[i].type==='Company'){
                return (true)
            }
        }
        return (false)
    }
    //show followed only
    handleShowfollowedOnly=async()=>{
        await this.setState({
            onlyFollowed:!this.state.onlyFollowed
        })
        // this.getFilterRecrutmentsArr()
    }
    //on change searchbar
    handleOnChangeInput=(event,inputId)=>{
        let copyState = this.state;
        copyState[inputId]=event.target.value;
        this.setState({
            ...copyState
        })
    }
    
    //page
    getTotalPage=(length)=>{
        // console.log('lengh: ',length)
        let totalPage = Math.ceil(length/12)
        return (totalPage)
    }
    //view company
    handleViewCompanyDetail=(company)=>{
        // console.log('companyId: ',company.id)
        this.props.history.push(`/company-detail/${company.id}`)
    }
    

    

    render() {
        //page click
        // console.log('state: ',this.state)
        let companyCount=0
        
        return (
            <>
            <HomeHeader
            isShowBanner={false}
            />
            <div className='companies-container'>
                <div className='companies-content'>
                    <div className='top-container'>
                        <div className='top-content'>
                            <div className='left-content'>
                                <label className='label-companies-list'>Danh sách công ty</label>
                                <label className='label-number-company'>Khám phá 100.000+ công ty nổi bật</label>
                                <label className='label-introduce'>Tra cứu thông tin công ty và tìm kiếm nơi làm việc tốt nhất dành cho bạn</label>
                                <div className='search-container'>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className='search-icon'/>
                                    <input type='form-control search' placeholder='Nhập tên công ty' onChange={(event)=>this.handleOnChangeInput(event,'keyWords')}></input>
                                    <button className={this.state.keyWords?'btn-search active':'btn-search'}>Tìm kiếm</button>
                                    <button className={this.state.onlyFollowed?'btn-is-following active':'btn-is-following'}
                                    onClick={()=>this.handleShowfollowedOnly()}>Đang theo dõi</button>
                                </div>
                                
                            </div>
                            <div className='right-content'>
                            </div>
                        </div>
                    </div>

                    <div className='title-companies-list'>Danh sách các công ty nổi bật</div>
                    <div className='bottom-container'>
                        <div className='bottom-content'>
                        {this.state.countCompanyRecruitments&&this.state.countCompanyRecruitments.length>0&&
                            this.state.countCompanyRecruitments.map((item,index)=>{
                                if(item.companyName.toLowerCase().includes(this.state.keyWords.toLowerCase())&&companyCount<120){
                                    if(!this.state.onlyFollowed){
                                        companyCount++
                                        return(
                                            <div key={index} className='each-company'onClick={()=>this.handleViewCompanyDetail(item)}>
                                                
                                                <div className='preview-img-container'>
                                                    <div className='preview-image'
                                                    previewImgURL
                                                        style={{backgroundImage: `url(${new Buffer(item.companyImage,'base64').toString('binary')})`}}
                                                    ></div>
                                                </div>

                                                <div className='company-name'>{item.companyName}</div>
                                                <div className='company-info'>
                                                    <div dangerouslySetInnerHTML={{__html:   item.companyDescriptionHTML   }}>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }else{
                                        if(this.isFollowing(item.id)){
                                            companyCount++
                                            return(
                                                <div key={index} className='each-company'onClick={()=>this.handleViewCompanyDetail(item)}>
                                                    
                                                    <div className='preview-img-container'>
                                                        <div className='preview-image'
                                                        previewImgURL
                                                            style={{backgroundImage: `url(${new Buffer(item.companyImage,'base64').toString('binary')})`}}
                                                        ></div>
                                                    </div>

                                                    <div className='company-name'>{item.companyName}</div>
                                                    <div className='company-info'>
                                                        <div dangerouslySetInnerHTML={{__html:   item.companyDescriptionHTML   }}>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    }
                                }
                            })
                        }
                        </div>
                    </div>

                </div>
            </div>
            <AboutUs/>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Companies));