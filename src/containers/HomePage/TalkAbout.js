import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './TalkAbout.scss'

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
class TalkAbout extends Component {

    render() {
        let settings={
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 2,
            slidesToScroll: 2,
        };
    
        return (
            <div className='talk-about-container'>
                <div className='talk-about-title'>Báo chí nói gì về WorkFast</div>
                <div className='talk-about-content'>
                    
                    <Slider {...settings}>
                        <div className='talk-about-item'>
                            <div className='dan-tri'></div>
                            <div className='content'>
                                Chiến dịch của WorkFast nhận nhiều giải thưởng
                            </div>
                        </div>
                        <div className='talk-about-item'>
                            <div className='vn-express'></div>
                            <div className='content'>
                                WorkFast : 64% doanh nghiệp thưởng tết 1 tháng lương
                            </div>
                        </div>
                        <div className='talk-about-item'>
                            <div className='thanh-nien'></div>
                            <div className='content'>
                                Tổ chức Job Fair - ngày hội việc làm năm 2024
                            </div>
                        </div>
                        <div className='talk-about-item'>
                            <div className='bao-24h'></div>
                            <div className='content'>
                                WorkFast đồng hành cùng hàng triệu lao động Việt chinh phục sự nghiệp "Hành trình sự nghiệp hạnh phúc"
                            </div>
                        </div>
                    </Slider>
                </div>

                
                <div className='talk-about-title'>Ứng viên nói gì về WorkFast</div>
                <div className='talk-about-content'>
                    
                    <Slider {...settings}>
                        <div className='talk-about-item'>
                            <div className='content-from-cadidate'>
                                WorkFast cập nhật liên tục nhu cầu tuyển dụng của các công ty, luôn tạo ra cơ hội việc làm cho nhiều bạn đang tìm kiếm công việc. Ứng viên có thể tham khảo được nhiều ngành nghề khác nhau và có sự lựa chọn riêng của bản thân. Dễ sử dụng và dễ hiểu cho người dùng. Cảm ơn WorkFast.
                            </div>
                            <div className='sign'>Hoàng Long</div>
                        </div>
                        <div className='talk-about-item'>
                            <div className='content-from-cadidate'>
                                Nhìn chung, các tính năng trên WorkFast dễ tương tác. Tôi thích nhất tính năng thông báo về việc nhà tuyển dụng đã xem hồ sơ của mình. Thời đại công nghệ, việc có thông tin kịp thời giúp khách hàng cập nhật tình hình và có những giải pháp kịp thời hơn thực sự rất hữu ích.
                            </div>
                            <div className='sign'>Tuấn Lộc</div>
                        </div>
                        <div className='talk-about-item'>
                            <div className='content-from-cadidate'>
                                Khi ứng viên nộp đơn ứng tuyển vào một vị trí nào đó, WorkFast sẽ thông báo về cho ứng viên biết trạng thái hồ sơ của ứng viên hiện giờ đang là gì. Ví dụ như Hồ sơ đã gửi tới Nhà tuyển dụng, Nhà tuyển dụng đã xem hồ sơ,… Tôi rất thích tính năng này. Ngoài ra, tôi cũng nhận được phản hồi từ Nhà tuyển dụng khi hồ sơ của mình không phù hợp với vị trí họ đang tìm kiếm.
                            </div>
                            <div className='sign'>Minh Hiếu</div>
                        </div>
                        <div className='talk-about-item'>
                            <div className='content-from-cadidate'>
                                Trong tất cả các công việc tôi đã làm và ngay cả công việc hiện tại, WorkFast là nơi giúp tôi có được cơ hội tốt mỗi khi tôi cần.
                            </div>
                            <div className='sign'>Đức Tùng</div>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(TalkAbout);
