import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './TopCompany.scss'

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { withRouter } from 'react-router';
import { getRecruitmentsToHomepage, getAllCompanies } from '../../services/userService';

class TopCompany extends Component {

    constructor(props){
        super(props);
        this.state={
            countCompanyRecruitments:[],
            
            
        }
    }
    componentDidMount(){
        this.getCountCompanyRecruitments()

    }
    componentDidUpdate(prevProps, prevState, snapshot){
        

    }
    async getCountCompanyRecruitments(){
        let resRecuitment = await getRecruitmentsToHomepage()
        let resCompany = await getAllCompanies()
        // console.log('recruitment: ',resRecuitment.recruitments.length)
        // console.log('company: ',resCompany.allComp.length)

        let countCompanyRecruitments=[];

        for (let i = 0; i < resCompany.allComp.length; i++) {
            let count=0
            for (let j = 0; j < resRecuitment.recruitments.length; j++) {
                if(resRecuitment.recruitments[j].companyId===resCompany.allComp[i].id){
                    count++
                }
            }
            countCompanyRecruitments.push({id:resCompany.allComp[i].id, companyName:resCompany.allComp[i].companyName, companyImage:resCompany.allComp[i].companyImage, recruitmentCount:count})
        }


        //sort array by recruitmentCount* normal a-b, top b-a
        countCompanyRecruitments.sort(function (a, b) {return b.recruitmentCount - a.recruitmentCount})

        //console.log('count sort: ',countCompanyRecruitments)
        this.setState({
            countCompanyRecruitments : countCompanyRecruitments
        })
        
    }

    
    //view company detail
    handleViewCompanyDetail=(company)=>{
        // console.log('companyId: ',company.id)
        this.props.history.push(`/company-detail/${company.id}`)
    }

    render() {
        let settings={
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
        };
        


        //console.log('States: ',this.state)
        return (

            <div className='top-company-container'>
            <div className='top-company-slider-container'>
                <div className='top-company-title'>
                    Top các công ty nổi bật
                </div>
                <Slider {...settings}>
                    
                    {this.state.countCompanyRecruitments&&this.state.countCompanyRecruitments.length>0&&
                        this.state.countCompanyRecruitments.map((item,index)=>{
                            if(index<10){
                            return(
                                <div className='top-company-item' key={index} onClick={()=>this.handleViewCompanyDetail(item)}>
                                    <div className='preview-img-container'>
                                        <div className='preview-image'
                                        previewImgURL
                                            style={{backgroundImage: `url(${new Buffer(item.companyImage,'base64').toString('binary')})` }}
                                        >
                                        </div>
                                        <div className='top-company-name'>{item.companyName}</div>
                                    </div>
                                </div>
                            )
                            }
                        })
                    }
        
                </Slider>
            </div>
            </div>
                
        
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopCompany));
