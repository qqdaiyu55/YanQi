// Judge if two arrays are equal
var arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false
    for (var i = arr1.length; i--;) {
      if(arr1[i] !== arr2[i])
        return false
    }

    return true
};

// Generate 8 bits unique id
var uuidv8 = () => {
  return Math.random().toString(36).substr(2, 8)
}

// Convert MB size to GB, TB
var MBtoSize = (num, decimals) => {
  if(num == 0) return '0 MB';
   var k = 1024,
       dm = decimals || 2,
       sizes = ['MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
       i = Math.floor(Math.log(num) / Math.log(k));
   return parseFloat((num / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export { arraysEqual, uuidv8, MBtoSize }
