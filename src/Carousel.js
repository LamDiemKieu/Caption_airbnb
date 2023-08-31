import React, { useEffect, useState } from "react";
import axios from "axios";

import ItemCarousel from "./ItemCarousel";

const Carousel = () => {
  const [carousel, setCarousel] = useState([]);

  useEffect(() => {
    const result = axios({
      method: "get",
      url: "https://airbnbnew.cybersoft.edu.vn/api/phong-thue",
      headers: {
        tokenCybersoft:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCBTw6FuZyAwNyIsIkhldEhhblN0cmluZyI6IjE5LzEyLzIwMjMiLCJIZXRIYW5UaW1lIjoiMTcwMjk0NDAwMDAwMCIsIm5iZiI6MTY3OTg1MDAwMCwiZXhwIjoxNzAzMDkxNjAwfQ.28D2Nfp6Hy4C5u8pvZDIxH2pzlYoKIqgfsJLI_Dque4",
      },
    })
      .then((res) => {
        setCarousel(res.data.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // console.log(carousel);
  return (
    <div className="flex justify-between flex-wrap gap-4 m-auto w-10/12 py-10">
      {carousel?.map((item, index) => {
        return (
          <div key={index} className="mt-5 w-72">
            <ItemCarousel item={item} />
            <h1>{item.tenPhong}</h1>
          </div>
        );
      })}
    </div>
  );
};

export default Carousel;
