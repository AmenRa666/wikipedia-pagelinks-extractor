// MODULES
const fs = require('fs');
const inspect = require('util').inspect;


// LOGIC
let previousLine = ''

let j = 1
let articleCount = 1

let data = ''

let buffer = '';
let rs = fs.createReadStream('enwiki-latest-pagelinks.sql');
rs.on('data', (chunk) => {
  let lines = (buffer + chunk).split(/\r?\n/g);
  buffer = lines.pop();
  for (let i = 0; i < lines.length; ++i) {

    fs.appendFileSync('pagelinksSample.txt', lines[i] + '\n')

    if(j > 41) {
      // console.log(lines[i] + '\n');
      let edgeRegex = /\(\d*,0,'([^,]*?)',0\)[,|;]/g
      let matches = lines[i].match(edgeRegex) || []

      let sourceRegex = /\(\d*/
      let targetRegex = /0,'([^,]*?)',0/

      matches.forEach((edge) => {
        let source = edge.match(sourceRegex)[0].substring(1)
        let terget = edge.match(targetRegex)[0].substring(2).slice(0, -2)

        data = data + source + ', ' + terget + '\n'

        if (j%100 == 0) {
          fs.appendFileSync('edges.txt', data)
          data = ''
        }

        process.exit()

        // console.log(source + ', ' + terget);
      })


      // console.log(found);
      // process.exit()
    }

    console.log(j);
    j++

  }
});
rs.on('end', () => {
  console.log('ended on non-empty buffer: ' + inspect(buffer));
});
