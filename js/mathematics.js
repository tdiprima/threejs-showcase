const average = array => array.reduce((a, b) => a + b) / array.length;

function standardDeviation(array) {
  const mean = average(array);
  const variance = array.reduce((acc, val) => acc + ((val - mean) ** 2), 0) / array.length;
  return Math.sqrt(variance);
}

function median(arr) {
  const sortedArr = arr.slice().sort((a, b) => a - b);
  const midIndex = Math.floor(sortedArr.length / 2);

  if (sortedArr.length % 2 === 0) {
    // If even, average of two middle numbers
    return (sortedArr[midIndex - 1] + sortedArr[midIndex]) / 2;
  } else {
    // If odd, middle number
    return sortedArr[midIndex];
  }
}

function mode(arr) {
  const frequencyMap = {};
  let maxFreq = 0;
  let modes = [];

  for (let num of arr) {
    if (frequencyMap[num]) {
      frequencyMap[num]++;
    } else {
      frequencyMap[num] = 1;
    }

    if (frequencyMap[num] > maxFreq) {
      maxFreq = frequencyMap[num];
    }
  }

  for (let num in frequencyMap) {
    if (frequencyMap[num] === maxFreq) {
      modes.push(Number(num));
    }
  }

  return modes;
}
