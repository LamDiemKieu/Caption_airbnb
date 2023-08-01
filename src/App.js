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
import Slider from "react-slick";
import { useFormik } from "formik";

function App() {
  //giá trị khởi tạo ban đầu
  const [user, setUser] = useState(null);
  const [phongThue, setPhongThue] = useState([]);
  const [datPhong, setDatPhong] = useState([]);
  const [viTri, setViTri] = useState([]);
  const [binhLuan, setBinhLuan] = useState([]);
  const [count, setCount] = useState(-1);
  const [keyWord, setKeyWord] = useState("");
  //phần ẩn hiện form
  const [formDangNhap, setFormDangNhap] = useState(true);
  const [formDangKy, setFormDangKy] = useState(true);

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
          localStore.goiLocalStore("user");
          handleTatDangNhap();
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

  //gọi dữ liệu từ API, vị trí
  const ViTri = {
    getViTri: () => {
      axios({
        method: "get",
        url: "https://airbnbnew.cybersoft.edu.vn/api/vi-tri",
        headers: {
          tokenCybersoft,
        },
      })
        .then((res) => {
          setViTri(res.data.content);
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
    ViTri.getViTri();
    DatPhong.getDatPhong();
    localStore.goiLocalStore("user");
  }, []);
  // console.log("Bình luận", binhLuan);
  // console.log("Phòng thuê", phongThue);
  // console.log("Vị trí", viTri);
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
  //tìm kiếm
  const handleTimKiem = (event) => {
    setKeyWord(event.target.value);

    const timKiem = event.target.value.toLowerCase();
    if (timKiem === "") {
      setCount(-1);
      Phong.getPhongThue();
    } else {
      const ketQuaTimKiem = phongThue.filter((item) => {
        if (timKiem === "hồ bơi") {
          return item.hoBoi === true;
        } else if (timKiem === "bãi đỗ xe") {
          return item.doXe === true;
        } else if (timKiem === "bếp") {
          return item.bep === true;
        } else if (timKiem === "điều hoà") {
          return item.dieuHoa === true;
        } else if (timKiem === "wifi") {
          return item.dieuHoa === true;
        }
      });
      if (ketQuaTimKiem.length > 0) {
        setCount(ketQuaTimKiem.length);
        setPhongThue(ketQuaTimKiem);
      } else {
        setCount(-1);
      }
    }
  };

  //ẩn hiện form đăng nhập
  const handleMoDangNhap = () => {
    setFormDangNhap(!formDangNhap);
    // set body height 100vh
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";
  };
  const handleTatDangNhap = () => {
    setFormDangNhap(!formDangNhap);
    document.body.style.height = "auto";
    document.body.style.overflow = "auto"; // Optional: Restore the default scrollbar behavior
  };

  // xử lý đăng nhập
  const formikDangNhap = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      // console.log(values);
      Auth.signin(values);
      formikDangNhap.resetForm();
    },
  });

  //xử lý đăng xuất
  const handleDangXuat = () => {
    localStore.xoaLocalStore("user");
    setUser(null);
  };

  const handleTatDangKy = () => {
    setFormDangKy(!formDangKy);
    document.body.style.height = "auto";
    document.body.style.overflow = "auto"; // Optional: Restore the default scrollbar behavior
  };
  const handleQuayVeTrangChu = () => {
    setFormDangKy(true);
    setFormDangNhap(true);
    document.body.style.height = "auto";
    document.body.style.overflow = "auto"; // Optional: Restore the default scrollbar behavior
  };

  // Carousel
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  //check xem có đăng nhận chưa?

  return (
    <div className="App">
      <div id="myHeader">
        <nav className="bg-slate-400 border-gray-200 dark:bg-gray-900 w-full z-50">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="https://flowbite.com/" className="flex items-center">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8 mr-3"
                alt="Flowbite Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Flowbite
              </span>
            </a>
            <button
              data-collapse-toggle="navbar-default"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-default"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
            <div
              className="hidden w-full md:block md:w-auto"
              id="navbar-default"
            >
              <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <a
                    href="#"
                    className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                    aria-current="page"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  {user === null ? (
                    <span
                      className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                      onClick={handleMoDangNhap}
                    >
                      Đăng nhập
                    </span>
                  ) : (
                    <span
                      className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                      onClick={handleDangXuat}
                    >
                      Đăng xuất
                    </span>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>{" "}
      </div>
      {/* <Menu /> */}

      <div id="mySearch">
        <input
          list="myList"
          name="mySearch"
          placeholder="Tìm kiếm căn hộ, tiện nghi, vị trí..."
          onChange={handleTimKiem}
        />

        <datalist id="myList">
          <option value="Bếp"></option>
          <option value="Bãi đỗ xe"></option>
          <option value="Điều hoà"></option>
          <option value="Hồ bơi"></option>
          <option value="Wifi"></option>
        </datalist>
        <div>
          <p>
            {count !== -1 ? (
              <span>
                Kết quả tìm được {count} căn hộ có{" "}
                <span style={{ color: "red" }}>{keyWord}</span>
              </span>
            ) : (
              <></>
            )}
          </p>
        </div>
      </div>

      <div id="myContent">
        {phongThue?.map((item, index) => {
          return (
            <div key={index} className="item">
              <Slider {...settings}>
                <div>
                  <img src={item.hinhAnh} alt="" />
                </div>
                <div>
                  <img src={item.hinhAnh} alt="" />
                </div>
                <div>
                  <img src={item.hinhAnh} alt="" />
                </div>
              </Slider>

              <div>
                <h1>{item.tenPhong.toUpperCase()}</h1>
              </div>
              <div>
                <p>${item.giaTien.toLocaleString()}</p>
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
                        <table>
                          <thead>
                            <tr>
                              <th>Tiện nghi căn hộ </th>
                              <th>Mô tả </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Ghế tình yêu</td>
                              <td>{item.banLa ? "Có" : "Không"}</td>
                            </tr>
                            <tr>
                              <td>Điều hoà</td>
                              <td>{item.dieuHoa ? "Có" : "Không"}</td>
                            </tr>
                            <tr>
                              <td>Bếp</td>
                              <td>{item.bep ? "Có" : "Không"}</td>
                            </tr>
                            <tr>
                              <td>Wifi</td>
                              <td>{item.wifi ? "Có" : "Không"}</td>
                            </tr>
                            <tr>
                              <td>Tivi</td>
                              <td>{item.tivi ? "Có" : "Không"}</td>
                            </tr>
                            <tr>
                              <td>Bàn ủi</td>
                              <td>{item.banUi ? "Có" : "Không"}</td>
                            </tr>
                            <tr>
                              <td>Máy giặt</td>
                              <td>{item.mayGiat ? "Có" : "Không"}</td>
                            </tr>
                            <tr>
                              <td>Đỗ xe</td>
                              <td>{item.doXe ? "Có" : "Không"}</td>
                            </tr>
                            <tr>
                              <td>Hồ bơi</td>
                              <td>{item.hoBoi ? "Có" : "Không"}</td>
                            </tr>
                            <tr>
                              <td>Phòng ngủ</td>
                              <td>{item.phongNgu}</td>
                            </tr>
                            <tr>
                              <td>Giường</td>
                              <td>{item.giuong}</td>
                            </tr>
                            <tr>
                              <td>Phòng tắm</td>
                              <td>{item.phongTam}</td>
                            </tr>
                          </tbody>
                        </table>
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
                            {user ? (
                              <button
                                type="button"
                                onClick={() => handleFormSubmit(item)}
                              >
                                Xác nhận
                              </button>
                            ) : (
                              <h1 className="alert" onClick={handleMoDangNhap}>
                                Vui lòng đăng nhập để đặt phòng
                                <p>Đăng nhập ngay</p>
                              </h1>
                            )}
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

      <div id="formDangNhap" hidden={formDangNhap}>
        <form onSubmit={formikDangNhap.handleSubmit}>
          <h1>Đăng nhập</h1>
          <div className="inputItem">
            <input
              type="text"
              name="email"
              value={formikDangNhap.values.email}
              placeholder="Email"
              onChange={formikDangNhap.handleChange}
            />
          </div>
          <div className="inputItem">
            <input
              type="password"
              name="password"
              value={formikDangNhap.values.password}
              placeholder="Password"
              onChange={formikDangNhap.handleChange}
            />
          </div>
          <div className="inputItem">
            <button type="submit">Đăng nhập</button>
          </div>
          <div>
            <div>
              <button type="button">Quên mật khẩu</button>
            </div>
            <div>
              <button type="button" onClick={handleTatDangKy}>
                Chưa có tài khoản, đăng ký ngay
              </button>
            </div>
            <i className="fa-solid fa-xmark" onClick={handleTatDangNhap}></i>
          </div>
        </form>
      </div>

      <div id="formDangKy" hidden={formDangKy}>
        <form>
          <h1>Đăng ký</h1>
          <div className="inputItem">
            <input type="text" placeholder="Username" />
          </div>
          <div className="inputItem">
            <input type="text" placeholder="Password" />
          </div>
          <div className="inputItem">
            <input type="text" placeholder="Password" />
          </div>
          <div className="inputItem">
            <input type="text" placeholder="Password" />
          </div>
          <div className="inputItem">
            <input type="text" placeholder="Password" />
          </div>
          <div className="inputItem">
            <button type="button">Đăng ký</button>
          </div>
          <div>
            <i className="fa-solid fa-xmark" onClick={handleQuayVeTrangChu}></i>
          </div>
          <div>
            <button type="button" onClick={handleTatDangKy}>
              Quay về trang đăng nhập
            </button>
          </div>
          <div>
            <button type="button" onClick={handleQuayVeTrangChu}>
              Quay về trang chủ
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default App;
