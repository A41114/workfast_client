import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRegular, faPaperPlane, faHeart} from '@fortawesome/free-regular-svg-icons'
import { faSackDollar, faLocationDot, faHourglass, faClock, faUserGroup, faArrowUpRightFromSquare, faRankingStar, faUser, faArrowRight, faBuilding,
        faPersonDigging,faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import { faFacebook,faTwitter,faLinkedin } from '@fortawesome/free-brands-svg-icons';
import HomeHeader from '../HomePage/HomeHeader';
import './CompanyDetail.scss'
import moment from 'moment';
import { getRecruitmentDetaiById,GetCompanyDetail,ChangeFollowStatus,GetFollowlById } from '../../services/candidateService';
import { getRecruitmentsToHomepage,getAllCodeService } from '../../services/userService';
import ModalApplyJob from '../Candidate/ModalApplyJob';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';


class CompanyDetail extends Component {
    constructor(props){
        super(props);
        this.state={
            companyId:-1,
            recruitmentArr:'',
            companyDetail:'',
            today: moment(new Date()).format('DD/MM/YYYY'),
            isOpenModalApplyJob:false,
            companyRecruitments:'',

            keyWords:'',
            locationArr:'',
            location:'',

            filterRecrutmentsArr:'',
            totalPages:'',
            filterRecrutmentsArrEachPage:'',
            
            isFollowing:'',//company follow
            followArr:'',
            onlySaved:false//recruitment

        }
    }
    async componentDidMount(){
        await this.getAllData()
    }
    //call by componentDidMount and if reset
    getAllData=async()=>{
        let resLoc = await getAllCodeService('LOCATION');
        resLoc.data.push({id:'ALL',key:'LOC0',type: 'LOCATION',createdAt:null, updatedAt:null, value:'Tất cả địa điểm'})
        if(this.props.match&&this.props.match.params.id){
            let id = this.props.match.params.id;//id on url
            this.setState({
                companyId:id,
                locationArr:resLoc.data,
                location:resLoc.data[resLoc.data.length-1].value,
            })
            let resDetail = await GetCompanyDetail(id);
            let resRecuitment = await getRecruitmentsToHomepage();

            if(resDetail&&resDetail.errCode===0){
                await this.setState({
                    companyDetail:resDetail.company,
                    recruitmentArr : resRecuitment.recruitments
                })
                
            }
            this.getCompanyRecruitments()
            this.getFilterRecrutmentsArr()
        }
        //Get follow
        if(this.props.userInfo.id){
            //company
            await this.GetFollow(this.props.userInfo.id)
            //recruitment
            let follow = await GetFollowlById(this.props.userInfo.id)
            this.setState({
                followArr : follow.follow,
            })

        }

    }
    async componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.userInfo !== this.props.userInfo){
            if(this.props.userInfo.id){
                //company
                await this.GetFollow(this.props.userInfo.id)
                //recruitment
                let follow = await GetFollowlById(this.props.userInfo.id)
                console.log()
                this.setState({
                    followArr : follow.follow,
                })
            }
        }
        
    }
    //get follow btn text
    GetFollow=async(userId)=>{
        let follow = await GetFollowlById(userId)
        this.setState({
            isFollowing:false
        })
        for(let i = 0;i<follow.follow.length;i++){
            // console.log('CompID: ',this.state.companyId)
            // console.log('follow: ',follow.follow[i].followedId)
            if(this.state.companyId===follow.follow[i].followedId&&follow.follow[i].type==='Company'){
                this.setState({
                    isFollowing:true
                })
                break;
            }
        }
    }
    //check if following job or not
    isSaved=(recruitmentId)=>{
        // console.log('recruitmentID; ', recruitmentId)
        for(let i = 0;i<this.state.followArr.length;i++){

            if(recruitmentId===(+this.state.followArr[i].followedId)&&this.state.followArr[i].type==='Recruitment'){
                return (true)
            }
        }
        return (false)
    }
    //show saved only
    handleShowSavedOnly=async()=>{
        await this.setState({
            onlySaved:!this.state.onlySaved
        })
        this.getFilterRecrutmentsArr()
    }

    //get companyRecruitments
    getCompanyRecruitments=()=>{
        let companyRecruitments=[]
        for(let i=0;i<this.state.recruitmentArr.length;i++){
            if((+this.state.companyId)===this.state.recruitmentArr[i].Company.id){
                companyRecruitments.push(this.state.recruitmentArr[i])
            }
        }
        this.setState({
            companyRecruitments:companyRecruitments
        })
    }
    handleOnChangeSelect=(event,inputId)=>{
        let copyState = this.state;
        copyState[inputId]=event.target.value;
        this.setState({
            ...copyState,
        })
        
        this.getFilterRecrutmentsArr()
    }
    
    //get filter recruitments arr
    getFilterRecrutmentsArr=()=>{
        let {location}=this.state
        let filterRecrutmentsArr=[]
        let filterRecrutmentsArrEachPage=[]
        let length=0;
        
        this.state.companyRecruitments.map((item, index)=>{
            if(this.checkFilterAll(this.state.location)){
                location = item.workLocation
            }
            if(location === item.workLocation&&item.public==='show'&&
                !this.isLater(this.state.today,item.endDate)&&
                (item.title.toLowerCase().includes(this.state.keyWords.toLowerCase())||
                item.position.toLowerCase().includes(this.state.keyWords.toLowerCase()))){
                    //only saved off
                    if(!this.state.onlySaved){
                        filterRecrutmentsArr.push(item)
                        if(length<=5){
                            filterRecrutmentsArrEachPage.push(item)
                            length++
                        }
                    }
                    //only saved on
                    else{
                        if(this.isSaved(item.id)){
                            filterRecrutmentsArr.push(item)
                            if(length<=5){
                                filterRecrutmentsArrEachPage.push(item)
                                length++
                            }
                        }
                    }
                    
            }
        })
        
        this.setState({
            filterRecrutmentsArr:filterRecrutmentsArr,
            totalPages : Math.ceil(filterRecrutmentsArr.length/6),
            filterRecrutmentsArrEachPage: filterRecrutmentsArrEachPage,
            
        })
    }
    //check if filter is all or not
    checkFilterAll=(element)=>{
        if(element==='Tất cả địa điểm'||element==='Tất cả vị trí'||element==='Tất cả lĩnh vực'||
        element==='Tất cả kinh nghiệm'||element==='Tất cả mức lương'){
            return(true)
        }else{return(false)}
    }

    //compare date
    isLater=(date1,date2)=>{
        // console.log('day 1: ',date1)
        // console.log('day 2: ',date2)
        let d1 = date1.split("/");
        let d2 = date2.split("/");
        // console.log('d1: ',d1)
        // console.log('d2: ',d2)
        let latest = false;
        
        if (parseInt(d1[2]) > parseInt(d2[2])) {
            latest = true;
        } else if (parseInt(d1[2]) === parseInt(d2[2])) {
            if (parseInt(d1[1]) > parseInt(d2[1])) {
                latest = true;
            } else if (parseInt(d1[1]) === parseInt(d2[1])) {
                if (parseInt(d1[0]) > parseInt(d2[0])) {
                    latest = true;
                } 
            }
        }
        
        return latest;
    }
    //get days left
    daysLeft=(today,endDate)=>{
        let oneday = 1000 * 60 * 60 * 24
        if(!this.isLater(today,endDate)){
            let d1 = today.split("/");
            let d2 = endDate.split("/");

            let td = new Date(d1[2],d1[1]-1,d1[0])
            let end = new Date(d2[2],d2[1]-1,d2[0])
            
            // console.log('td: ',td)
            // console.log('end: ',end)

            return Math.round(Math.abs(end - td)/oneday);
        }
    }
    //get updated time since
    getUpdatedSince=(updatedTime)=>{
        let now = moment(new Date()).format('DD/MM/YYYY')
        let updated = moment(updatedTime).format('DD/MM/YYYY')
        let diffDays = this.daysLeft(updated,now)
        if(diffDays<1){
            return 'hôm nay'
        }else if(diffDays<7){
            return diffDays+' ngày trước'
        }else if(diffDays<30){
            return Math.floor(diffDays/7)+' tuần trước'
        }else if(diffDays<365){
            return Math.floor(diffDays/30)+' tháng trước'
        }else{
            return Math.floor(diffDays/365)+' năm trước'
        }
        
    }
    //view recruitment detail
    handleViewRecruitmentDetail=(recruitment)=>{
        // console.log('recruitment: ',recruitment.id)
        this.props.history.push(`/recruitment-detail/${recruitment.id}`)
    }
    //follow/unfollow company
    HandleFollowCompany=async()=>{
        let res = await ChangeFollowStatus({
            userId: this.props.userInfo.id,
            followedId: this.state.companyId,
            type:'Company',
        })
        

        if(res.errCode===0){
            // this.componentDidMount();
            await this.getAllData();
        }
    }


    render() {
        console.log('states: ',this.state)

        //page click
        const handlePageClick=(event)=>{
            let filterRecrutmentsArrEachPage=[]
            console.log('event lib: ',event)
            for (let i = 6*event.selected; i <= 6*event.selected+5; i++) {
                if(!this.state.filterRecrutmentsArr[i]){
                    break;
                }
                filterRecrutmentsArrEachPage.push(this.state.filterRecrutmentsArr[i])
            }
            this.setState({
                filterRecrutmentsArrEachPage : filterRecrutmentsArrEachPage
            })
        }

        return (
            <div>
                <HomeHeader
                isShowBanner={false}
                />
                <div className='company-detail-container'>
                    <div className='link'>
                        <div className='company-title'>Công ty</div>
                        <span><FontAwesomeIcon icon={faArrowRight}/></span>
                        <div className='company-list-title'>Danh sách công ty</div>
                        <span><FontAwesomeIcon icon={faArrowRight}/></span>
                        <div>{this.state.companyDetail.companyName}</div>
                    </div>
                    <div className='company-detail-content'>
                        <div className='top-content'>
                            <div className='bckg-img'></div>
                            <div className='logo-content'>
                                {this.state.companyDetail.companyImage&&
                                    <div className='preview-img-container'>
                                        <div className='preview-image'
                                        previewImgURL
                                            style={{backgroundImage: `url(${new Buffer(this.state.companyDetail.companyImage,'base64').toString('binary')})`}}
                                        ></div>
                                    </div>
                                }
                                <div className='text'>
                                    <div className='company-name'>{this.state.companyDetail.companyName}</div>
                                    <div className='bottom-text'>
                                        <div className='size'><FontAwesomeIcon icon={faBuilding}/> {this.state.companyDetail.size}</div>
                                        <div className='follower'><FontAwesomeIcon icon={faUserGroup}/> {this.state.companyDetail.follower} người theo dõi</div>
                                    </div>
                                </div>
                                {!this.state.isFollowing?
                                <div className='follow-company-container'><button className='follow-company' onClick={()=>this.HandleFollowCompany()}>+ Theo dõi công ty</button></div>:
                                <div className='follow-company-container'><button className='follow-company' onClick={()=>this.HandleFollowCompany()}>Bỏ theo dõi </button></div>
                                }
                            </div>
                        </div>

                        <div className='bottom-content'>
                            <div className='left-content'>
                                <div className='company-introduce-container'>
                                    <div className='company-introduce-title'>Giới thiệu công ty</div>
                                    <div className='company-introduce-content'dangerouslySetInnerHTML={{__html:   this.state.companyDetail.companyDescriptionHTML   }}></div>
                                </div>
                                <div className='recruitment-container'>
                                    <div className='company-recruitment-title'>Tuyển dụng</div>

                                    <div className='filter-container'>
                                        <div className='search-container'>
                                            <div className='search-content'>
                                                <FontAwesomeIcon icon={faMagnifyingGlass} className='search-icon'/>
                                                <input type='form-control search' placeholder='Tên công việc, vị trí ứng tuyển...' onChange={(event)=>this.handleOnChangeSelect(event,'keyWords')}></input>
                                            </div>
                                        </div>
                                        <div className='col-4 job-filter'>
                                            <select className='form-control'
                                            onChange={(event)=>this.handleOnChangeSelect(event,'location')}
                                            >
                                            {this.state.locationArr&&this.state.locationArr.length>0&&
                                                this.state.locationArr.map((item, index)=>{
                                                return(
                                                    <option selected={item.value===this.state.location&&'selected'} key={index}>{item.value}</option>
                                                )
                                                })
                                            }
                                            </select>
                                        </div>
                                        <button className={this.state.keyWords||this.state.location!=='Tất cả địa điểm'?'btn-search active':'btn-search'}>Tìm kiếm</button>
                                        <button className={!this.state.onlySaved?'btn-saved':'btn-saved active'} onClick={()=>this.handleShowSavedOnly()}>Đã lưu</button>
                                    </div>
                                    
                                    <div className='all-job'>
                                    {this.state.filterRecrutmentsArrEachPage&&this.state.filterRecrutmentsArrEachPage.length>0&&
                                        this.state.filterRecrutmentsArrEachPage.map((item, index)=>{
                                            return(
                                                <div className='each-job'>
                                                    <div className='preview-img-container'>
                                                    <div className='preview-image'
                                                    previewImgURL
                                                        style={{backgroundImage: `url(${new Buffer(item.Company.companyImage,'base64').toString('binary')})` }}
                                                    ></div>
                                                    </div>

                                                    <div className='each-job-content'>
                                                        <div className='job-title'>{item.title}</div>
                                                        <div className='company-name'>{item.Company.companyName}</div>
                                                        
                                                        <div className='bottom-job-content'>
                                                            <div className='work-location'>{item.workLocation}</div>
                                                            {!this.isLater(this.state.today,item.endDate)?
                                                            <div className='days-left'>Còn <span>{this.daysLeft(this.state.today,item.endDate)}</span> ngày để ứng tuyển</div>:
                                                            <div className='days-left disable'>Đã hết hạn ứng tuyển</div>
                                                            }
                                                            <div className='updated-since'>Cập nhật {this.getUpdatedSince(item.updatedAt)}</div>
                                                        </div>
                                                    </div>

                                                    <div className='each-job-right-content'>
                                                        <div className='each-job-salary'>{item.salary}</div>
                                                        <div className='each-job-btn'>
                                                            <button className='apply-btn'onClick={()=>this.handleViewRecruitmentDetail(item)}>Ứng tuyển</button>
                                                            <button className={!this.isSaved(item.id)?'save-icon':'save-icon active'}
                                                            onClick={()=>this.handleViewRecruitmentDetail(item)}
                                                            ><FontAwesomeIcon icon={faHeart}/></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    </div>

                                    <div className='job-page'>
                                        <ReactPaginate
                                        breakLabel="..."
                                        nextLabel=">"
                                        onPageChange={handlePageClick}
                                        pageRangeDisplayed={5}
                                        pageCount={this.state.totalPages}
                                        previousLabel="<"
                                        

                                        pageClassName='page-item'
                                        pageLinkClassName='page-link'
                                        previousClassName='page-item'
                                        previousLinkClassName='page-link'
                                        nextClassName='page-item'
                                        nextLinkClassName='page-link'
                                        breakClassName='page-item'
                                        breakLinkClassName='page-link'
                                        containerClassName='pagination'
                                        activeClassName='active'
                                        />

                                    </div>
                                </div>
                            </div>
                            <div className='right-content'>
                                <div className='company-info-container'>
                                    <div className='company-info-title'>Thông tin</div>
                                    <div className='company-address-title'><FontAwesomeIcon icon={faLocationDot}/> Địa chỉ công ty</div>
                                    <div className='company-address-content'>{this.state.companyDetail.address}</div>

                                    <div className='company-field-title'><FontAwesomeIcon icon={faPersonDigging}/> Lĩnh vực</div>
                                    <div className='company-field-content'>{this.state.companyDetail.companyIndustry}</div>
                                </div>
                                <div className='company-share-container'>
                                    <div className='company-share-title'>Chia sẻ công ty</div>
                                    <div className='social-network-title'> Chia sẻ qua mạng xã hội</div>
                                    <div className='social-network-content'>
                                        <FontAwesomeIcon icon={faFacebook} className='fb-icon'/>
                                        <FontAwesomeIcon icon={faTwitter} className='twitter-icon'/>
                                        <FontAwesomeIcon icon={faLinkedin} className='linkedIn-icon'/>
                                    </div>

                                </div>
                            </div>
                                
                            
                        </div>
                    </div>



                </div>




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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyDetail);
