// MODULES
const fs = require('fs');
const inspect = require('util').inspect;
const _ = require('underscore')


// LOGIC
let j = 1
let data = ''
let uniqueEdges = []
let numberOfUniqueEdges = 0

let buffer = '';
let rs = fs.createReadStream('edges.txt');
rs.on('data', (chunk) => {
  let lines = (buffer + chunk).split(/\r?\n/g);
  buffer = lines.pop();
  for (let i = 0; i < lines.length; ++i) {
    uniqueEdges.push(lines[i])
    if (j%1000 == 0) {
      uniqueEdges = _.uniq(uniqueEdges)
      uniqueEdges.forEach((edge) => {
        data = data + edge + '\n'
      })
      fs.appendFileSync('uniqueEdges.txt', data)
      data = ''
      numberOfUniqueEdges += uniqueEdges.length
      uniqueEdges = []
    }
    console.log(j);
    j++
  }
});
rs.on('end', () => {
  console.log('ended on non-empty buffer: ' + inspect(buffer));
  console.log('Number of unique edges:', numberOfUniqueEdges);
});
