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

export function camelCaseToLine(value) {
  return value.replace(/([A-Z])/g, "-$1").toLowerCase();
}

export function getCssUnit(value) {
  const unit = value.match(/[a-z|A-Z]+/g);
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
