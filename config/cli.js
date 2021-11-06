const config = require('./config.json');
const { stdin, stdout } = require('process');
const { fstat } = require('fs');
const { writeFileSync } = require('fs'); 

stdout.write('\x1b[36m' + 'ENTER API KEY\n');
stdout.write('> ');

let question = 0;

stdin.on('data', input => {
  switch(question) {
    case 0: 
      config.API_KEY = input.toString().replace('\n', '');
      stdout.write('\x1b[37m' + 'Added API_KEY: ' + '\x1b[36m' + input.toString());
      stdout.write('\x1b[35m' + 'ENTER API SECRET\n');
      break;
    case 1:
      config.API_SECRET = input.toString().replace('\n', '');
      stdout.write('\x1b[37m' + 'Added API_SECRET: ' + '\x1b[35m' + input.toString());
      stdout.write('\x1b[31m' + 'ENTER SCOPES FOR YOUR APP\n');
      break; 
    case 2:
      config.SCOPES = input.toString().replace('\n', '');
      stdout.write('\x1b[37m' + 'Added SCOPES: ' + '\x1b[31m' + input.toString());
      stdout.write('\x1b[33m' + 'ENTER APP URL\n');
      break;
    case 3:
      config.APP_URL = input.toString().replace('\n', '');
      stdout.write('\x1b[37m' + 'Added APP URL: ' + '\x1b[33m' + input.toString());
      stdout.write('\x1b[32m' + 'ENTER NAME OF APP\n');
      break;
    case 4:
      config.APP_NAME = input.toString().replace('\n', '');
      for(const key in config) {
        const out = '\x1b[37m' + key + ': ' + '\x1b[32m' + config[key] + '\n'
        stdout.write(out);
      }
      stdout.write('\x1b[37m' + 'Save? Enter: ' + '\x1b[32m' + 'y' + '\x1b[37m' + '/' + '\x1b[31m' + 'n\n');
      question += 1;
      break;     
    case 6:
      if(Buffer.compare(input, Buffer.from([0x79, 0x0a])) === 0) {
        writeFileSync('./config/config.json', JSON.stringify(config, null, " "));
        stdout.write('config.json updated with entered information.\n');
        process.exit();
      } else if (Buffer.compare(input, Buffer.from([0x6e, 0x0a])) === 0) {
        stdout.write('\x1b[31m' + 'Changes weren\'nt saved\n');
        process.exit();
      }

      question -= 1;
      break;
    }

  stdout.write('\x1b[37m' + '> ');
  question += 1;
})



