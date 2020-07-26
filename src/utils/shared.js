export function fuzzyQuery(list, keyWord) {
  const arr = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].indexOf(keyWord) >= 0) {
      arr.push(list[i]);
    }
  }
  return arr;
}

export function isNumber(num) {
  return typeof num === "number" && !isNaN(num);
}

// 驼峰转横线
export function camelCaseToLine(value) {
  return value.replace(/([A-Z])/g, "-$1").toLowerCase();
}

// 横线转驼峰
export function lineToCamelCase(name) {
  return name.replace(/\\-(\w)/g, function(all, letter) {
    return letter.toUpperCase();
  });
}

export function getCssUnit(value) {
  // eslint-disable-next-line no-useless-escape
  const unit = value.match(/[a-z|A-Z|\%]+/g);
  return unit ? unit[0] : "";
}

// eslint-disable-next-line no-useless-escape
export const colorRegular = /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/;

export function getCssColor(value) {
  const color = value.match(colorRegular);
  return color ? color[0] : "";
}

export function getCssNumber(value) {
  return parseFloat(value) || null;
}

// 深拷贝，只针对符合JSON标准的对象
export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// 复制
export function copy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  textArea.style.position = "fixed";
  textArea.style.opacity = 0;

  document.body.appendChild(textArea);

  textArea.focus();
  textArea.select();

  let errMessage = "复制失败，请手动复制";

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      errMessage = "";
    }
  } catch (err) {
    // console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);

  return errMessage;
}
