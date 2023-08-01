import React from "react";
import Slider from "react-slick";
const Menu = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <>
      <Slider {...settings}>
        <div className="text-center">
          <h3>1</h3>
        </div>
        <div className="text-center">
          <h3>2</h3>
        </div>
        <div className="text-center">
          <h3>3</h3>
        </div>
        <div className="text-center">
          <h3>4</h3>
        </div>
        <div className="text-center">
          <h3>5</h3>
        </div>
        <div className="text-center">
          <h3>6</h3>
        </div>
      </Slider>
    </>
    // <div className="multiple-items py-5 w-10/12 m-auto">
    //   <div className="w-20 bg-green-400 text-center">Hồ bơi</div>
    //   <div className="w-20 text-center">Bãi biển</div>
    //   <div className="w-20 text-center">Nhà nhỏ</div>
    //   <div className="w-20 text-center">Thiết kế</div>
    //   <div className="w-20 text-center">bắc cực</div>
    //   <div className="w-20 text-center">Cabin</div>
    // </div>
  );
};

export default Menu;
