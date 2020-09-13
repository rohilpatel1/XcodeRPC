const applescript = require('applescript');
const fs = require('fs');

const script = fs.readFileSync('apple/main.applescript')

applescript.execString(script, (err, rtn) => {
  if (err) {
    console.log(err)
  }
  
  if(rtn){
    console.log(rtn)
  } else {
    console.log('no file open')
  }
  
});