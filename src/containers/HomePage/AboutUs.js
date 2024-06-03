import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './AboutUs.scss'


class AboutUs extends Component {

    render() {
        
        return (
            <div className='about-us'>
            <div className='about-us-container'>
                <div className='about-us-content'>WorkFast
                    <div className='about-us-child-content'>Về WorkFast</div>
                    <div className='about-us-child-content'>Liên hệ</div>
                    <div className='about-us-child-content'>Hỏi đáp</div>
                    <div className='about-us-child-content'>Thỏa thuận sử dụng</div>
                    <div className='about-us-child-content'>Quy định bảo mật</div>

                </div>
                <div className='about-us-content'>Dành cho nhà tuyển dụng
                    <div className='about-us-child-content'>Đăng tin tuyển dụng</div>
                    <div className='about-us-child-content'>Tìm kiếm hồ sơ</div>
                    <div className='about-us-child-content'>Sản phẩm dịch vụ khác</div>
                    <div className='about-us-child-content'>Liên hệ</div>
                </div>
                <div className='about-us-content'>Việc làm theo khu vực
                    <div className='about-us-child-content'>Hồ Chí Minh</div>
                    <div className='about-us-child-content'>Hà Nội</div>
                    <div className='about-us-child-content'>Hải phòng</div>
                    <div className='about-us-child-content'>Cần thơ</div>
                    <div className='about-us-child-btn'>Xem tất cả khu vực </div>
                </div>
                <div className='about-us-content'>Việc làm theo lĩnh vực
                    <div className='about-us-child-content'>Cơ khí</div>
                    <div className='about-us-child-content'>Chứng khoán</div>
                    <div className='about-us-child-content'>Bất động sản</div>
                    <div className='about-us-child-content'>Du lịch</div>
                    <div className='about-us-child-btn'>Tìm việc làm </div>
                </div>
            </div>

            <div className='home-footer'>
                <p>&copy; 2023 WorkFast. More infomation, please visit our facebook.
                <a target='blank' href='https://www.facebook.com/'> &#8594; Click here &#8592;</a></p>
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

export default connect(mapStateToProps, mapDispatchToProps)(AboutUs);
