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
  if (num == 0) return '0 MB';
  var k = 1024,
      dm = decimals || 2,
      sizes = ['MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(num) / Math.log(k))
  return parseFloat((num / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Convert Bytes to KB, MB, GB
var BytestoSize = (num, decimals) => {
  if (num == 0) return '0 B'
  var k = 1024,
      dm = decimals || 2,
      sizes = ['B', 'KB', 'MB', 'GB'],
      i = Math.floor(Math.log(num) / Math.log(k))
  return parseFloat((num / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
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

// Format an integer to specific length
var formatNumberLength = (num, length) => {
  var r = num.toString()
  while (r.length < length) {
    r = '0' + r
  }
  return r
}

// Format given time: hours:minutes:seconds
// E.G. 01:30:23, 23:30
var formatVideoTime = (time) => {
  var hours = Math.floor(time / 3600)
  time -= hours * 3600
  var minutes = Math.floor(time / 60)
  var seconds = time - minutes * 60

  if (hours > 0) {
     return hours+':'+formatNumberLength(minutes, 2)+':'+formatNumberLength(seconds, 2)
  } else {
    return formatNumberLength(minutes, 2)+':'+formatNumberLength(seconds, 2)
  }
}

export { arraysEqual, uuidv8, MBtoSize, BytestoSize, dataURItoBlob, formatNumberLength, formatVideoTime }
