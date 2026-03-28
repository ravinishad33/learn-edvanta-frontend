import axios from "axios";

export const uploadToCloudinary = async (
  file,
  type,
  folder,
  onProgress
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
  formData.append("folder", folder);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const endpoint =
    type === "image"
      ? `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      : `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;

  const response = await axios.post(endpoint, formData, {
    onUploadProgress: (e) => {
      if (!onProgress) return;
      const percent = Math.round((e.loaded * 100) / e.total);
      onProgress(percent);
    },
  });

  return response.data;
};
