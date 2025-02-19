const fileIcons = {
  // image: "i-vscode-icons-file-type-image",
  // video: "i-vscode-icons-file-type-video",
  // audio: "i-vscode-icons-file-type-audio",
  // pdf: "i-vscode-icons-file-type-pdf2",
  // document: "i-vscode-icons-file-type-word",
  // excel: "i-vscode-icons-file-type-excel",
  // ppt: "i-vscode-icons-file-type-powerpoint2",
  // zip: "i-vscode-icons-file-type-zip",
  // other: "i-vscode-icons-file-type-aspx"
  image: "https://api.iconify.design/vscode-icons:file-type-image.svg",
  video: "https://api.iconify.design/vscode-icons:file-type-video.svg",
  audio: "https://api.iconify.design/vscode-icons:file-type-audio.svg",
  pdf: "https://api.iconify.design/vscode-icons:file-type-pdf2.svg",
  document: "https://api.iconify.design/vscode-icons:file-type-word.svg",
  excel: "https://api.iconify.design/vscode-icons:file-type-excel.svg",
  ppt: "https://api.iconify.design/vscode-icons:file-type-powerpoint2.svg",
  zip: "https://api.iconify.design/vscode-icons:file-type-zip.svg",
  other: "https://api.iconify.design/vscode-icons:file-type-aspx.svg"
};
// 根据文件url后缀判断文件类型
export function getFileType(url) {
  if (!url) return "other";
  // 文件类型和对应的后缀名数组
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "heic"];
  const videoExtensions = ["mp4", "avi", "mov"];
  const pdfExtensions = ["pdf"];
  const documentExtensions = ["doc", "docx"];
  const audioExtensions = ["mp3", "wav", "ogg"];
  const zipExtensions = ["zip", "rar", "7z"];
  const excelExtensions = ["xls", "xlsx"];
  const pptExtensions = ["ppt", "pptx"];
  // 获取文件扩展名
  const fileExtension = url.split(".").pop().toLowerCase();
  // 判断文件类型
  if (imageExtensions.includes(fileExtension)) {
    return "image";
  } else if (videoExtensions.includes(fileExtension)) {
    return "video";
  } else if (pdfExtensions.includes(fileExtension)) {
    return "pdf";
  } else if (documentExtensions.includes(fileExtension)) {
    return "document";
  } else if (audioExtensions.includes(fileExtension)) {
    return "audio";
  } else if (zipExtensions.includes(fileExtension)) {
    return "zip";
  } else if (excelExtensions.includes(fileExtension)) {
    return "excel";
  } else if (pptExtensions.includes(fileExtension)) {
    return "ppt";
  } else {
    return "other";
  }
}

export function getFileIcon(url) {
  const fileType = getFileType(url);
  return fileIcons[fileType];
}
