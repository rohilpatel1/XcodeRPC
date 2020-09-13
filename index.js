const applescript = require('applescript');
const script = require('./apple/main.applescript');


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