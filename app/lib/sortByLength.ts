export default function sortByLength(l: string[], asd: boolean = false) {
  const result = Array.from(l);
  let isSorted = false;

  function bubbleSortWithReference() {
    isSorted = true;
    for (let i = 0; i < l.length; i++) {
      const el = result[i];
      if (asd) {
        if (i != result.length - 1) {
          if (el.length > result[i + 1].length) {
            isSorted = false;
            result[i] = result[i + 1];
            result[i + 1] = el;
          }
        }
      } else {
        if (i != result.length - 1) {
          if (el.length < result[i + 1].length) {
            isSorted = false;
            result[i] = result[i + 1];
            result[i + 1] = el;
          }
        }
      }
    }
    if (!isSorted) return bubbleSortWithReference();
    else return result;
  }
  return bubbleSortWithReference();
}
