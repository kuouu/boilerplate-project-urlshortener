
const mongoose = require('mongoose');
const dns = require('dns');
mongoose.connect(process.env.MONGO_URI, 
  { useNewUrlParser: true, useUnifiedTopology: true }
);
// log connection status
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});
// schema of url shortener service
const urlSchema = new mongoose.Schema({
  original_url: String
});
// model of url shortener service
const Url = mongoose.model('Url', urlSchema);

const createData = (done, url) => {
  const urlObj = new URL(url);
  dns.lookup(urlObj.hostname, (err, address, family) => {
    if (err) return done(err)
    console.log('address: %j family: IPv%s', address, family);
  });
  const newData = new Url({
    original_url: url
  });
  newData.save((err, data) => {
    if (err) return console.error(err);
    console.log(data);
    done(null, data);
  })
}

const findData = (done, id) => {
  Url.findById(id, (err, data) => { 
    if (err) return console.error(err);
    console.log(data);
    done(null, data);
  })
}

exports.createData = createData;
exports.findData = findData;