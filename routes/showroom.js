
var add = function(req, res) {
    var paramName = req.body.name || req.query.name;
    var paramAddress = req.body.address || req.query.address;
    var paramTel = req.body.tel || req.query.tel;
    var paramLongitude = req.body.longitude || req.query.longitude;
    var paramLatitude = req.body.latitude || req.query.latitude;

    console.log('req param : ' + paramName + ', ' + paramAddress + ', ' +
               paramTel + ', ' + paramLongitude + ', ' +
               paramLatitude);

    // DB object
    var database = req.app.get('database');
    if (database.db) {
        addShowRoom(database, paramName, paramAddress, paramTel, paramLongitude, paramLatitude, function(err, result) {
        if (err) {
          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2>Error while adding coffeeshop</h2>');
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
var addShowRoom = function(database, name, address, tel, longitude, latitude, content, callback) {
  // ShowRoomModel object
  var showroom = new database.ShowRoomModel(
    {name:name, address:address, tel:tel,
			    geometry: {
				   type: 'Point',
				   coordinates: [longitude, latitude]
         },
         content: {
           
           contents: [title, img]
         }
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
                console.error('커피숍 검색 중 에러 발생 : ' + err.stack);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				        res.write('<h2>Error while searching near showroom</h2>');
                res.write('<p>' + err.stack + '</p>');
				        res.end();
                return;
              }
			if (results) {
				console.dir(results);

				if (results.length > 0) {
					res.render('findnear.ejs', {result: results[0]._doc, paramLatitude: paramLatitude, paramLongitude: paramLongitude});
				} else {
					res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					res.write('<h2>가까운 커피숍 데이터가 없습니다.</h2>');
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
