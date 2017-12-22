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

// Convert data url to blob
var dataURItoBlob = (dataURI) => {
    // Convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1])

    // Separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // Write the bytes of the string to an ArrayBuffer
    var arrayBuffer = new ArrayBuffer(byteString.length)
    var _ia = new Uint8Array(arrayBuffer)
    for (var i = 0; i < byteString.length; i++) {
        _ia[i] = byteString.charCodeAt(i)
    }

    var dataView = new DataView(arrayBuffer)
    var blob = new Blob([dataView], { type: mimeString })
    return blob
}

export { arraysEqual, uuidv8, MBtoSize, dataURItoBlob }
