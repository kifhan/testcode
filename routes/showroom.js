var fs = require('fs');
var btoa = require('btoa')

var add = function (req, res) {
    var paramName = req.body.name || req.query.name;
    var paramAddress = req.body.address || req.query.address;
    var paramTel = req.body.tel || req.query.tel;
    var paramLongitude = req.body.longitude || req.query.longitude;
    var paramLatitude = req.body.latitude || req.query.latitude;
    var paramIntro = req.body.intro || req.query.intro;
    var paramImage = req.file

  console.log('req body : ' + JSON.stringify(req.body))
  // console.log('req query : ' + JSON.stringify(req.query))
  // console.log('req param : ' + JSON.stringify(req.param))

    // DB object
    var database = req.app.get('database');
    if (database.db) {
        addShowRoom(database, paramName, paramAddress, paramTel, paramLongitude, paramLatitude, paramIntro, paramImage, function(err, result) {
        if (err) {
          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2>Error while adding showroom</h2>');
          res.write('<p>' + err.stack + '</p>');
          res.end();

          return;
        }
        if (result) {
          console.dir(result);
          //HERE!!!!
          res.redirect('../public/map.html');
        } else {
          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
  				res.write('<h2>Failed adding</h2>');
  				res.end();
        }
      });
    } else {
  		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
  		res.write('<h2>No DB Connection</h2>');
  		res.end();
  	}
};

// ADDSHOWROOM
var addShowRoom = function(database, name, address, tel, longitude, latitude, intro, image, callback) {
  // ShowRoomModel object
  var showroom = new database.ShowRoomModel(
    {
      name: name,
      address: address,
      tel: tel,
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      content: [{
        intro: intro,
        image: {
          data: fs.readFileSync(image.path),
          contentType: image.mimetype
        }
      }]
    }
  );

  //save()
  showroom.save(function(err) {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, showroom);
  });
};




var findNear = function(req, res) {
	console.log('Calling findNear method.');

  var maxDistance = 20000000000000000;

  var paramLongitude = req.body.longitude || req.query.longitude;
  var paramLatitude = req.body.latitude || req.query.latitude;

    console.log(' : ' + paramLongitude + ', ' + paramLatitude);


    var database = req.app.get('database');


	if (database.db) {

		database.ShowRoomModel.findNear(paramLongitude, paramLatitude, maxDistance, function(err, results) {
			if (err) {
                console.error('Error while searching : ' + err.stack);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				        res.write('<h2>Error while searching near showroom</h2>');
                res.write('<p>' + err.stack + '</p>');
				        res.end();
                return;
              }
			if (results) {
        console.dir(results);
        
				if (results.length > 0) {
          res.render('findnear.ejs', { result: results[0]._doc, paramLatitude: paramLatitude, paramLongitude: paramLongitude, imagebinary: btoa(results[0]._doc.content[0].image.data) });
				} else {
					res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					res.write('<h2>No Data nearby you. Please register your business</h2>');
					res.end();
				}

			} else {
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>Failed to find near one</h2>');
        res.end();
			}
		});
	} else {
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h2>No DB Connection</h2>');
    res.end();
	}

};


module.exports.add = add;
module.exports.findNear = findNear;
