export function fileSizeConverter(bytes, withoutLabel) {
  if (!isNaN(bytes)) {
    var sizes = ["KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Kb";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1000)));
    if (withoutLabel) return ((bytes / 1000) / 1000).toFixed(2);
    return (bytes / Math.pow(1000, i)).toFixed(2) + " " + sizes[i];
  }
  return withoutLabel ? 0 : "0 Kb";
}
