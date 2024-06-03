import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import Job from './Job';
import TopCompany from './TopCompany';
import MarketToday from './MarketToday';
import KeyIndustries from './KeyIndustries';
import TalkAbout from './TalkAbout';
import AboutUs from './AboutUs';

class Home extends Component {

    render() {
        let settings={
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
        };
        return (
            <div>
                <HomeHeader isShowBanner={true}/>
                {this.props.isLoggedIn&&this.props.userInfo.roleId==='R3'&&
                    <>
                        <Job/>
                        <TopCompany/>
                        <MarketToday/>
                        <KeyIndustries/>
                        <TalkAbout/>
                        <AboutUs/>
                    </>
                    
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
