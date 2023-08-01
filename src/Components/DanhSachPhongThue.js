import React from "react";
import ItemPhong from "./ItemPhong";

const DanhSachPhongThue = ({ duLieu }) => {
  return (
    <>
      <h1>Danh sách phòng cho thuê</h1>
      {duLieu?.map((item, index) => {
        return (
          <div key={index}>
            <ItemPhong phong={item} />
          </div>
        );
      })}
    </>
  );
};

export default DanhSachPhongThue;
