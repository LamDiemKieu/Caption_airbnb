import logo from "./logo.svg";
import "./App.css";
import "./app.scss";
import Header from "./Header";
import Carousel from "./Carousel";
import Footer from "./Footer";
import Tabs from "./Tabs";
import Menu from "./Menu";
import axios from "axios";
import { useEffect, useState } from "react";
import DanhSachPhongThue from "./Components/DanhSachPhongThue";

function App() {
  //giá trị khởi tạo ban đầu
  const [user, setUser] = useState({});
  const [phongThue, setPhongThue] = useState([]);
  const [datPhong, setDatPhong] = useState([]);
  const [binhLuan, setBinhLuan] = useState([]);

  const thongTinDangNhap = {
    email: "buunhut@yahoo.com",
    password: "123123",
  };
  const tokenCybersoft =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCBTw6FuZyAwNyIsIkhldEhhblN0cmluZyI6IjE5LzEyLzIwMjMiLCJIZXRIYW5UaW1lIjoiMTcwMjk0NDAwMDAwMCIsIm5iZiI6MTY3OTg1MDAwMCwiZXhwIjoxNzAzMDkxNjAwfQ.28D2Nfp6Hy4C5u8pvZDIxH2pzlYoKIqgfsJLI_Dque4";

  //gọi dữ liệu từ API, đang nhập, đăng ký
  const Auth = {
    //đăng ký
    signup: (data) => {
      axios({
        method: "post",
        url: "https://airbnbnew.cybersoft.edu.vn/api/auth/signup",
        headers: {
          tokenCybersoft,
        },
        data: data,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //đăng nhập
    signin: (data) => {
      axios({
        method: "post",
        url: "https://airbnbnew.cybersoft.edu.vn/api/auth/signin",
        headers: {
          tokenCybersoft,
        },
        data: data,
      })
        .then((res) => {
          const nguoiDung = res.data.content;
          localStore.luuLocalStore("user", nguoiDung);

          // console.log(nguoiDung);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    signOut: (key) => {
      localStore.xoaLocalStore(key);
    },
  };

  //gọi dữ liệu từ API, bình luận
  const BinhLuan = {
    getBinhLuan: () => {
      axios({
        method: "get",
        url: "https://airbnbnew.cybersoft.edu.vn/api/binh-luan",
        headers: {
          tokenCybersoft,
        },
      })
        .then((res) => {
          setBinhLuan(res.data.content);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  };

  //gọi dữ liệu từ API, phòng
  const Phong = {
    getPhongThue: () => {
      axios({
        method: "get",
        url: "https://airbnbnew.cybersoft.edu.vn/api/phong-thue",
        headers: {
          tokenCybersoft,
        },
      })
        .then((res) => {
          setPhongThue(res.data.content);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  };

  //gọi dữ liệu từ API, đặt phòng
  const DatPhong = {
    getDatPhong: () => {
      axios({
        method: "get",
        url: "https://airbnbnew.cybersoft.edu.vn/api/dat-phong",
        headers: {
          tokenCybersoft,
        },
      })
        .then((res) => {
          setDatPhong(res.data.content);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    postDatPhong: (data) => {
      axios({
        method: "post",
        url: "https://airbnbnew.cybersoft.edu.vn/api/dat-phong",
        headers: {
          tokenCybersoft,
        },
        data: data,
      })
        .then((res) => {
          setDatPhong(res.data.content);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  };

  //gọi local
  const localStore = {
    luuLocalStore: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    goiLocalStore: (key) => {
      let userLocal = JSON.parse(localStorage.getItem(key));
      if (userLocal) {
        setUser(userLocal);
      }
    },
    xoaLocalStore: (key) => {
      localStorage.removeItem(key);
    },
  };

  // Auth.signin(thongTinDangNhap);

  // Auth.signOut("user");

  //dùng componentDidMount để update dữ liệu cho lần chạy dầu tiên
  useEffect(() => {
    BinhLuan.getBinhLuan();
    Phong.getPhongThue();
    DatPhong.getDatPhong();
    localStore.goiLocalStore("user");
  }, []);
  // console.log("Bình luận", binhLuan);
  // console.log("Phòng thuê", phongThue);
  // console.log("Đặt phòng", datPhong);
  // console.log(user);

  const [clickedItemDatPhong, setclickedItemDatPhong] = useState(-1);
  const [clickedItemChiTiet, setclickedItemChiTiet] = useState(-1);

  // Function to handle the click on "Đặt phòng" button
  const handleClickDatPhong = (index) => {
    setclickedItemDatPhong((prevState) => (prevState === index ? -1 : index));
  };
  const handleClickChiTiet = (index) => {
    setclickedItemChiTiet((prevState) => (prevState === index ? -1 : index));
  };
  // Function to handle form submission
  const handleFormSubmit = (item) => {
    console.log(item);
  };
  //click xem chi tiêt
  return (
    <div className="App">
      {/* <Header />
      <Menu /> */}
      <div id="myContent">
        {phongThue?.map((item, index) => {
          return (
            <div key={index} className="item">
              <div>
                <img src={item.hinhAnh} alt="" />
              </div>
              <div>
                <h1>{item.tenPhong.toUpperCase()}</h1>
              </div>
              <div>
                <p>${item.giaTien}</p>
              </div>
              <div>
                <span>{item.moTa}</span>
              </div>
              <div className="moRong">
                <div>
                  <button
                    type="button"
                    className="myBtn"
                    onClick={() => handleClickChiTiet(index)}
                  >
                    {clickedItemChiTiet === index ? (
                      <span>
                        <i className="fas fa-eye-slash"></i> Chi tiết
                      </span>
                    ) : (
                      <span>
                        <i className="fas fa-eye"></i> Chi tiết
                      </span>
                    )}
                  </button>
                  <div className="chiTiet">
                    <div
                      className={clickedItemChiTiet === index ? "" : "hidden"}
                    >
                      <div className="chiTietContent">
                        <h1>Thông tin chi tiết</h1>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    className="myBtn"
                    onClick={() => handleClickDatPhong(index)}
                  >
                    {clickedItemDatPhong === index ? (
                      <span>
                        <i className="fas fa-eye-slash"></i> Đặt phòng
                      </span>
                    ) : (
                      <span>
                        <i className="fas fa-eye"></i> Đặt phòng
                      </span>
                    )}{" "}
                  </button>
                  <div className="chiTiet">
                    <div
                      className={clickedItemDatPhong === index ? "" : "hidden"}
                    >
                      <div className="chiTietContent">
                        {/* <h1>Form đặt phòng</h1> */}
                        <form>
                          <div className="inputItem">
                            <label htmlFor="ngayDen">Ngày đến</label>
                            <input type="date" />
                          </div>
                          <div className="inputItem">
                            <label htmlFor="ngayDi">Ngày đi</label>

                            <input type="date" />
                          </div>
                          <div className="inputItem">
                            <label htmlFor="soLuong">Số lượng khách</label>

                            <input type="text" />
                          </div>
                          <div className="inputItem">
                            <button
                              type="button"
                              onClick={() => handleFormSubmit(item)}
                            >
                              Xác nhận
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* <Footer /> */}
    </div>
  );
}

export default App;
