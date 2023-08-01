import React from "react";

const ItemPhong = (item) => {
  console.log(item.tenPhong);
  return (
    <div style={{ height: "80px", backgroundColor: "red" }}>
      <h1> chi tiết phong</h1>
      <p>{item.tenPhong}</p>
    </div>
  );
};

export default ItemPhong;
