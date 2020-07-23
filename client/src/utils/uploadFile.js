import React from "react";

const uploadFile = async (file) => {
  const data = new FormData();

  data.append("file", file[0]);
  data.append("upload_preset", process.env.UPLOAD_PRESET);

  const res = await fetch(`${process.env.CLOUD_API}/image/upload`, {
    method: "POST",
    body: data,
  });

  const cloudfile = await res.json();
  return cloudfile;
};

export default uploadFile;
