import "./App.css";
import "./app.scss";
import Footer from "./Footer";
import axios from "axios";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { useFormik } from "formik";
import * as yup from "yup";
import { message } from "antd";
import moment from "moment";
function App() {
  //giá trị khởi tạo ban đầu
  const [user, setUser] = useState(null);
  const [phongThue, setPhongThue] = useState([]);
  const [datPhong, setDatPhong] = useState([]);
  const [datPhongTheoMaNguoiDung, setDatPhongTheoMaNguoiDung] = useState([]);
  const [viTri, setViTri] = useState([]);
  const [tatCaBinhLuan, setTatCaBinhLuan] = useState([]);
  const [binhLuan, setBinhLuan] = useState([]);
  const [count, setCount] = useState(-1);
  const [keyWord, setKeyWord] = useState("");
  const [thongTinDangNhap, setThongTinDangNhap] = useState(null);
  //giới tính
  const [gender, setGender] = useState("");

  //phần ẩn hiện form
  const [formDangNhap, setFormDangNhap] = useState(true);
  const [formDangKy, setFormDangKy] = useState(true);
  const [thongTinDatPhong, setThongTinDatPhong] = useState(true);

  //dùng message của antd
  const [messageApi, contextHolder] = message.useMessage();

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
          //đăng ký thành công
          messageApi.success("Đăng ký thành công :)");
          setGender("");
          formikDangKy.handleReset();
          handleMoDangKy();
          setThongTinDangNhap(data);
        })
        .catch((err) => {
          //đăng ký thất bại
          messageApi.error("Người dùng đã tồn tại :(");
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
          setTatCaBinhLuan(res.data.content);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getBinhLuanTheoMaPhong: (maPhong) => {
      axios({
        method: "get",
        url: `https://airbnbnew.cybersoft.edu.vn/api/binh-luan/lay-binh-luan-theo-phong/${maPhong}`,
        headers: {
          tokenCybersoft,
        },
      })
        .then((res) => {
          setBinhLuan(res.data.content);
          // console.log(res.data.content);
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
    getDatPhong: async () => {
      await axios({
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
    postDatPhong: async (data) => {
      await axios({
        method: "post",
        url: "https://airbnbnew.cybersoft.edu.vn/api/dat-phong",
        headers: {
          tokenCybersoft,
        },
        data: data,
      })
        .then((res) => {
          setDatPhong(res.data.content);
          messageApi.success("Đặt phòng thành công :)");
          formikDatPhong.resetForm();
        })
        .catch((err) => {
          messageApi.error("Đặt phòng thất bại :(");

          console.log(err);
        });
    },
    getDatPhongTheoMaNguoiDung: async (maNguoiDung) => {
      await axios({
        method: "get",
        url: `https://airbnbnew.cybersoft.edu.vn/api/dat-phong/lay-theo-nguoi-dung/${maNguoiDung}`,
        headers: {
          tokenCybersoft,
        },
        data: maNguoiDung,
      })
        .then((res) => {
          setDatPhongTheoMaNguoiDung(res.data.content);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    xoaDatPhong: async (id) => {
      await axios({
        method: "delete",
        url: `https://airbnbnew.cybersoft.edu.vn/api/dat-phong/${id}`,
        headers: {
          tokenCybersoft,
        },
      })
        .then((res) => {
          // console.log(res);
          DatPhong.getDatPhongTheoMaNguoiDung(user.user.id);
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

  //dùng componentDidMount để update dữ liệu cho lần chạy dầu tiên
  useEffect(() => {
    Phong.getPhongThue();
    localStore.goiLocalStore("user");
    BinhLuan.getBinhLuan();
    // ViTri.getViTri();
    // DatPhong.getDatPhong();
  }, []);
  // console.log("Phòng thuê", phongThue);
  // console.log("Vị trí", viTri);
  // console.log("Đặt phòng", datPhong);
  // console.log(user);

  const [clickedItemDatPhong, setClickedItemDatPhong] = useState(-1);
  const [clickedItemChiTiet, setClickedItemChiTiet] = useState(-1);
  const [clickedItemBinhLuan, setClickedItemBinhLuan] = useState(-1);
  const [clickedItemThongTin, setClickedItemThongTin] = useState(-1);

  //click đặt phòng
  const handleClickDatPhong = (index) => {
    setClickedItemDatPhong((prevState) => (prevState === index ? -1 : index));
  };
  //click thông tin
  const handleClickThongTin = (index) => {
    setClickedItemThongTin((prevState) => (prevState === index ? -1 : index));
  };
  //click chi tiết
  const handleClickChiTiet = (index) => {
    setClickedItemChiTiet((prevState) => (prevState === index ? -1 : index));
  };
  //click bình luận
  const handleClickBinhLuan = (index, maPhong) => {
    setClickedItemBinhLuan((prevState) => (prevState === index ? -1 : index));
    BinhLuan.getBinhLuanTheoMaPhong(maPhong);
  };
  //tìm kiếm
  const handleTimKiem = (event) => {
    setKeyWord(event.target.value);

    const timKiem = event.target.value.toLowerCase();
    if (timKiem === "") {
      setCount(-1);
      Phong.getPhongThue();
    } else {
      const ketQuaTimKiem = phongThue?.filter((item) => {
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
        } else if (timKiem === "ghế tình yêu") {
          return item.banLa === true;
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

  const handleMoDangKy = () => {
    setFormDangKy(!formDangKy);
    document.body.style.height = "auto";
    document.body.style.overflow = "auto"; // Optional: Restore the default scrollbar behavior
  };

  //check nam nữ
  const handleCheckNam = () => {
    setGender(true);
    formikDangKy.setFieldValue("gender", true); // Update the formik gender field value
  };
  const handleCheckNu = () => {
    setGender(false);
    formikDangKy.setFieldValue("gender", false); // Update the formik gender field value
  };
  const handleQuayVeTrangChu = () => {
    setFormDangKy(true);
    setFormDangNhap(true);
    setThongTinDatPhong(true);
    document.body.style.height = "auto";
    document.body.style.overflow = "auto"; // Optional: Restore the default scrollbar behavior
  };

  // Carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  //Chức năng
  //xử lý đăng ký
  const formikDangKy = useFormik({
    initialValues: {
      id: 0,
      name: "",
      email: "",
      password: "",
      phone: "",
      birthday: "",
      gender: "",
      role: "USER",
    },
    validationSchema: yup.object({
      name: yup.string().required("Vui lòng nhập tên người dùng"),
      password: yup
        .string()
        .required("Vui lòng nhập mật khẩu")
        .matches(
          /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/,
          "Mật khẩu ít nhất 6 ký tự, phải có ký tự hoa và đặc biệt"
        ),

      email: yup
        .string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),

      phone: yup
        .string()
        .required("Vui lòng nhập số điện thoại")
        .matches(/^\d+$/, "Số điện thoại chỉ được chứa số")
        .max(11, "Số điện thoại tối đa 11 ký tự"),
      birthday: yup.string().required("Vui lòng chọn năm sinh"),
      gender: yup.string().required("Vui lòng chọn giới tính"),
    }),
    onSubmit: (values) => {
      if (values.gender === "") {
        formDangKy.errors.gender = "Vui lòng chọn giới tính";
        return;
      }
      Auth.signup(values);
    },
  });
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
    setThongTinDangNhap(null);
  };

  //xử lý đặt phòng
  const formikDatPhong = useFormik({
    initialValues: {
      id: 0,
      ngayDen: "",
      ngayDi: "",
      soLuongKhach: 1,
    },

    validationSchema: yup.object({
      ngayDen: yup.string().required("Vui lòng chọn ngày đến"),
      ngayDi: yup.string().required("Vui lòng chọn ngày đi"),
      soLuongKhach: yup
        .string()
        .required("Vui lòng nhập số lượng khách")
        .matches(/^\d+$/, "Số lượng khách chỉ được nhập số")
        .test(
          "is-greater-than-one",
          "Số lượng khách phải lớn hơn hoặc bằng 1",
          (value) => {
            return parseInt(value) >= 1;
          }
        ),
    }),

    onSubmit: (values) => {
      const maPhong = document.querySelector('input[name="maPhong"]').value;
      console.log(maPhong);
      const maNguoiDung = document.querySelector(
        'input[name="maNguoiDung"]'
      ).value;

      const datPhong = { ...values, maPhong, maNguoiDung };
      DatPhong.postDatPhong(datPhong);
      // console.log(datPhong);
    },
  });

  //xem thông tin đặt phòng
  const handleThongTinDatPhong = () => {
    const maNguoiDung = user.user.id;
    DatPhong.getDatPhongTheoMaNguoiDung(maNguoiDung);
    setThongTinDatPhong(!thongTinDatPhong);
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";
  };
  //tìm tên căn hộ từ mã
  const updatedDatPhongTheoMaNguoiDung = datPhongTheoMaNguoiDung?.map(
    (item, index) => {
      const foundRoom = phongThue.find((phong) => phong.id === item.maPhong);

      if (foundRoom) {
        const newPhong = { ...item, tenPhong: foundRoom.tenPhong };
        return newPhong;
      }

      return item; // Return original item if matching room is not found
    }
  );
  // console.log(updatedDatPhongTheoMaNguoiDung);

  //xoá đặt phòng
  const handleXoaDatPhong = (id) => {
    DatPhong.xoaDatPhong(id);
  };
  return (
    <div className="App">
      {contextHolder}
      <div id="myHeader">
        <nav className=" w-full z-50">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-6">
            <span className="flex items-center text-white">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8 mr-3"
                alt="Flowbite Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                AirBnb
              </span>
            </span>
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
                  {user === null ? (
                    <></>
                  ) : (
                    <span
                      className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                      onClick={handleThongTinDatPhong}
                    >
                      Thông tin đặt phòng
                    </span>
                  )}
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

      <div id="mySearch">
        <input
          list="myList"
          name="mySearch"
          placeholder="Tìm kiếm tiện nghi căn hộ..."
          onChange={handleTimKiem}
        />

        <datalist id="myList">
          <option value="Bãi đỗ xe"></option>
          <option value="Bếp"></option>
          <option value="Điều hoà"></option>
          <option value="Ghế tình yêu"></option>
          <option value="Hồ bơi"></option>
          <option value="Wifi"></option>
        </datalist>
        <div>
          <p>
            {count !== -1 ? (
              <span>
                <i
                  className="fa-regular fa-hand-point-right"
                  style={{ color: "orangered" }}
                ></i>{" "}
                Kết quả tìm được{" "}
                <span style={{ color: "orangered" }}>{count}</span> căn hộ có{" "}
                <span style={{ color: "orangered" }}>{keyWord}</span>
              </span>
            ) : (
              <></>
            )}
          </p>
        </div>
      </div>

      <div id="myContent">
        {phongThue?.map((item, index) => {
          // Sử dụng filter để đếm số lượng bình luận
          // console.log(tatCaBinhLuan);
          // console.log(item.id)
          const countBinhLuan = tatCaBinhLuan.filter(
            (binhLuan) => binhLuan.maPhong === item.id
          ).length;
          // console.log(countBinhLuan);

          return (
            <div key={index} className="item">
              <Slider {...settings} key={index}>
                <div>
                  <img src={item.hinhAnh} alt="" />
                </div>
                <div>
                  <img src={item.hinhAnh} alt="" />
                </div>
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
                  <div>
                    {clickedItemChiTiet === index ? (
                      <button
                        type="button"
                        className="myBtn active"
                        onClick={() => handleClickChiTiet(index)}
                      >
                        <span>
                          <i className="fas fa-eye-slash"></i> Chi tiết
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="myBtn"
                        onClick={() => handleClickChiTiet(index)}
                      >
                        <span>
                          <i className="fas fa-eye"></i> Chi tiết
                        </span>
                      </button>
                    )}
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
                  {/* bình luận */}
                  {countBinhLuan > 0 ? (
                    <div>
                      {clickedItemBinhLuan === index ? (
                        <button
                          type="button"
                          className="myBtn active"
                          onClick={() => handleClickBinhLuan(index, item.id)}
                        >
                          <span>
                            <i className="fas fa-eye-slash"></i> Bình luận (
                            {countBinhLuan})
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="myBtn"
                          onClick={() => handleClickBinhLuan(index, item.id)}
                        >
                          <span>
                            <i className="fas fa-eye"></i> Bình luận (
                            {countBinhLuan})
                          </span>
                        </button>
                      )}
                      <div
                        className="chiTiet binhLuan"
                        hidden={clickedItemBinhLuan === index ? false : true}
                      >
                        <div
                          className={
                            clickedItemBinhLuan === index ? "" : "hidden"
                          }
                          key={item.id}
                        >
                          <div
                            className={
                              clickedItemBinhLuan === index ? "" : "hidden"
                            }
                          >
                            {binhLuan
                              .sort(
                                (a, b) =>
                                  new Date(b.ngayBinhLuan) -
                                  new Date(a.ngayBinhLuan)
                              )
                              .map((binhLuan, index) => (
                                <div className="binhLuanContent" key={index}>
                                  <div className="nguoiDung">
                                    <span>{binhLuan.tenNguoiBinhLuan}</span>

                                    <span>
                                      {moment(binhLuan.ngayBinhLuan).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </span>
                                  </div>
                                  <div className="danhGia">
                                    <span>{binhLuan.noiDung}</span>
                                    <span
                                      className={`star-rating star-${binhLuan.saoBinhLuan}`}
                                    ></span>
                                  </div>
                                </div>
                              ))}{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                <div>
                  <div>
                    {clickedItemDatPhong === index ? (
                      <button
                        type="button"
                        className="myBtn active"
                        onClick={() => handleClickDatPhong(index)}
                      >
                        <span>
                          <i className="fas fa-eye-slash"></i> Đặt phòng
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="myBtn"
                        onClick={() => handleClickDatPhong(index)}
                      >
                        <span>
                          <i className="fas fa-eye"></i> Đặt phòng
                        </span>
                      </button>
                    )}{" "}
                    <div className="chiTiet">
                      <div
                        className={
                          clickedItemDatPhong === index ? "" : "hidden"
                        }
                      >
                        <div className="chiTietContent">
                          {/* <h1>Form đặt phòng</h1> */}
                          <form onSubmit={formikDatPhong.handleSubmit}>
                            <div className="inputItem">
                              {/* <label htmlFor="maPhong">Mã phòng</label> */}
                              {clickedItemDatPhong === index ? (
                                <input
                                  type="text"
                                  name="maPhong"
                                  value={item.id}
                                  readOnly
                                  hidden
                                />
                              ) : (
                                <></>
                              )}
                            </div>
                            <div className="inputItem" hidden>
                              <label htmlFor="maNguoiDung">Mã người dùng</label>
                              <input
                                type="text"
                                name="maNguoiDung"
                                // defaultValue={user?.user.id}
                                value={user?.user.id}
                                readOnly
                              />
                            </div>
                            <div className="inputItem">
                              <label htmlFor="ngayDen">Ngày đến</label>
                              <input
                                type="date"
                                name="ngayDen"
                                value={formikDatPhong.values.ngayDen}
                                onChange={formikDatPhong.handleChange}
                                onBlur={formikDatPhong.handleBlur}
                              />
                            </div>
                            {formikDatPhong.errors.ngayDen &&
                            formikDatPhong.touched.ngayDen ? (
                              <p>{formikDatPhong.errors.ngayDen}</p>
                            ) : (
                              <p></p>
                            )}{" "}
                            <div className="inputItem">
                              <label htmlFor="ngayDi">Ngày đi</label>

                              <input
                                type="date"
                                name="ngayDi"
                                value={formikDatPhong.values.ngayDi}
                                onChange={formikDatPhong.handleChange}
                                onBlur={formikDatPhong.handleBlur}
                              />
                            </div>
                            {formikDatPhong.errors.ngayDi &&
                            formikDatPhong.touched.ngayDi ? (
                              <p>{formikDatPhong.errors.ngayDi}</p>
                            ) : (
                              <p></p>
                            )}{" "}
                            <div className="inputItem">
                              <label htmlFor="soLuong">Số lượng khách</label>

                              <input
                                type="text"
                                name="soLuongKhach"
                                value={formikDatPhong.values.soLuongKhach}
                                onChange={formikDatPhong.handleChange}
                                onBlur={formikDatPhong.handleBlur}
                              />
                            </div>
                            {formikDatPhong.errors.soLuongKhach &&
                            formikDatPhong.touched.soLuongKhach ? (
                              <p>{formikDatPhong.errors.soLuongKhach}</p>
                            ) : (
                              <p></p>
                            )}{" "}
                            <div className="inputItem">
                              {user ? (
                                <button type="submit">Xác nhận</button>
                              ) : (
                                <div className="alert">
                                  <span>Vui lòng đăng nhập để đặt phòng</span>
                                  <h1 onClick={handleMoDangNhap}>
                                    Đăng nhập ngay
                                  </h1>
                                  <h1
                                    className="dangKy"
                                    onClick={handleMoDangKy}
                                  >
                                    Chưa có tài khoản, đăng ký ngay
                                  </h1>
                                </div>
                              )}
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {clickedItemThongTin === index ? (
                      <button
                        type="button"
                        className="myBtn active"
                        onClick={() => handleClickThongTin(index)}
                      >
                        <span>
                          <i className="fas fa-eye-slash"></i> Thông tin chủ nhà
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="myBtn"
                        onClick={() => handleClickThongTin(index)}
                      >
                        <span>
                          <i className="fas fa-eye"></i> Thông tin chủ nhà
                        </span>
                      </button>
                    )}{" "}
                    <div className="chiTiet">
                      <div
                        className={
                          clickedItemThongTin === index ? "" : "hidden"
                        }
                      >
                        <div className="chiTietContent">
                          <h1>hotline: 0909999999</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* from đăng nhập */}
      {formDangNhap ? (
        <></>
      ) : (
        <div id="formDangNhap" hidden={formDangNhap}>
          <form onSubmit={formikDangNhap.handleSubmit}>
            <h1>Đăng nhập</h1>
            <div className="inputItem">
              <input
                type="text"
                name="email"
                value={
                  thongTinDangNhap
                    ? thongTinDangNhap.email
                    : formikDangNhap.values.email
                }
                placeholder="Email"
                onChange={formikDangNhap.handleChange}
              />
            </div>
            <div className="inputItem">
              <input
                type="password"
                name="password"
                value={
                  thongTinDangNhap
                    ? thongTinDangNhap.password
                    : formikDangNhap.values.password
                }
                placeholder="Password"
                onChange={formikDangNhap.handleChange}
              />
            </div>
            <div className="inputItem">
              <button type="submit">Đăng nhập</button>
            </div>
            <div>
              <div>
                <button className="secondary" type="button">
                  Quên mật khẩu
                </button>
              </div>
              <div>
                <button
                  className="secondary"
                  type="button"
                  onClick={handleMoDangKy}
                >
                  Chưa có tài khoản, đăng ký ngay
                </button>
              </div>
              <i className="fa-solid fa-xmark" onClick={handleTatDangNhap}></i>
            </div>
          </form>
        </div>
      )}
      {/* form đăng ký */}
      {formDangKy ? (
        <></>
      ) : (
        <div id="formDangKy" hidden={formDangKy}>
          <form onSubmit={formikDangKy.handleSubmit}>
            <h1>Đăng ký</h1>
            <div className="inputItem">
              <input
                type="text"
                name="name"
                value={formikDangKy.values.name}
                placeholder="Tên người dùng"
                onChange={formikDangKy.handleChange}
                onBlur={formikDangKy.handleBlur}
              />
            </div>
            {formikDangKy.errors.name && formikDangKy.touched.name ? (
              <p>{formikDangKy.errors.name}</p>
            ) : (
              <p></p>
            )}{" "}
            <div className="inputItem">
              <input
                type="text"
                name="email"
                value={formikDangKy.values.email}
                placeholder="Email"
                onChange={formikDangKy.handleChange}
                onBlur={formikDangKy.handleBlur}
              />
            </div>
            {formikDangKy.errors.email && formikDangKy.touched.email ? (
              <p>{formikDangKy.errors.email}</p>
            ) : (
              <p></p>
            )}{" "}
            <div className="inputItem">
              <input
                type="password"
                name="password"
                value={formikDangKy.values.password}
                placeholder="Password"
                onChange={formikDangKy.handleChange}
                onBlur={formikDangKy.handleBlur}
              />
            </div>
            {formikDangKy.errors.password && formikDangKy.touched.password ? (
              <p>{formikDangKy.errors.password}</p>
            ) : (
              <p></p>
            )}{" "}
            <div className="inputItem">
              <input
                type="text"
                name="phone"
                value={formikDangKy.values.phone}
                placeholder="Số điện thoại"
                onChange={formikDangKy.handleChange}
                onBlur={formikDangKy.handleBlur}
              />
            </div>
            {formikDangKy.errors.phone && formikDangKy.touched.phone ? (
              <p>{formikDangKy.errors.phone}</p>
            ) : (
              <p></p>
            )}{" "}
            <div className="inputItem">
              <input
                type="date"
                name="birthday"
                value={formikDangKy.values.birthday}
                onChange={formikDangKy.handleChange}
                onBlur={formikDangKy.handleBlur}
              />
            </div>
            {formikDangKy.errors.birthday && formikDangKy.touched.birthday ? (
              <p>{formikDangKy.errors.birthday}</p>
            ) : (
              <p></p>
            )}{" "}
            <div className="gioiTinh">
              <label>Giới tính: </label>
              <div>
                <label htmlFor="gender_male">Nam </label>
                <input
                  type="checkbox"
                  name="gender"
                  value={formikDangKy.values.gender}
                  checked={gender === true}
                  onChange={handleCheckNam}
                />
              </div>
              <div>
                <label htmlFor="gender_female">Nữ </label>
                <input
                  type="checkbox"
                  name="gender"
                  value={formikDangKy.values.gender}
                  checked={gender === false}
                  onChange={handleCheckNu}
                />
              </div>
            </div>
            {formikDangKy.errors.gender && formikDangKy.touched.gender ? (
              <p>{formikDangKy.errors.gender}</p>
            ) : (
              <p></p>
            )}{" "}
            <div className="inputItem">
              <button type="submit">Đăng ký</button>
            </div>
            <div>
              <i
                className="fa-solid fa-xmark"
                onClick={handleQuayVeTrangChu}
              ></i>
            </div>
            <div style={{ marginTop: "10px" }}>
              <button
                className="secondary"
                type="button"
                onClick={handleMoDangKy}
              >
                Quay về trang đăng nhập
              </button>
            </div>
            <div>
              <button
                className="secondary"
                type="button"
                onClick={handleQuayVeTrangChu}
              >
                Quay về trang chủ
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Thông tin đặt phòng */}
      {thongTinDatPhong ? (
        <></>
      ) : (
        <div id="thongTinDatPhong">
          <h1 onClick={handleQuayVeTrangChu}>Quay về trang chủ</h1>
          <div className="datPhongContent">
            {updatedDatPhongTheoMaNguoiDung?.map((item, index) => {
              return (
                <div key={index} className="datPhongItem">
                  <h1>{item.tenPhong.toUpperCase()}</h1>
                  <p>Ngày đến: {moment(item.ngayDen).format("DD/MM/YYYY")}</p>
                  <p>Ngày đi: {moment(item.ngayDi).format("DD/MM/YYYY")}</p>
                  <h1>Số lượng khách: {item.soLuongKhach}</h1>
                  <div>
                    <span>
                      <i className="fa-regular fa-comment"></i>
                    </span>{" "}
                    <span>
                      <i className="fa-regular fa-pen-to-square"></i>
                    </span>{" "}
                    <span>
                      <i
                        className="fa-regular fa-trash-can"
                        onClick={() => {
                          handleXoaDatPhong(item.id);
                        }}
                      ></i>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
