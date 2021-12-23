export const getArrByObj = (obj) => {
  const arr = [];
  for (const [key, value] of Object.entries(obj)) {
    const newObj = {
      date: key,
      value: +value,
    }
    arr.push(newObj);
  }
  return arr;
}

export const dataDay = [
  {
    name: "30 ngày",
    value: 30,
    selected: false,
  },
  {
    name: "14 ngày",
    value: 14,
    selected: false,
  },
  {
    name: "7 ngày",
    value: 7,
    selected: false,
  },
]