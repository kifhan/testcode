var Schema = {};

Schema.createSchema = function(mongoose) {
    var ShowRoomSchema = mongoose.Schema({
        name: {type: String, index: 'hashed', 'default':''},
        address: {type: String, 'default':''},
        tel: {type: String, 'default':''},
        geometry: {
          'type': {type: String, 'default': "Point"},
          coordinates: [{type: "Number"}]
        },
        created_at: {type: Date, index: {unique: false}, 'default': Date.now},
        updated_at: {type: Date, index: {unique: false}, 'default': Date.now},
        content : [{
          intro:{type : String, trim: true, 'default' : ''},
          image:{data: Buffer, contentType: String}
        }]
    });

    ShowRoomSchema.index({geometry:'2dsphere'});
    ShowRoomSchema.static('findAll', function(callback) {
        return this.find({}, callback);
    });

    ShowRoomSchema.static('findNear', function(longitude, latitude, maxDistance, callback) {
      this.find().where('geometry').near(
        {center:{type:'Point',
            coordinates:[parseFloat(longitude), parseFloat(latitude)]},
            maxDistance:maxDistance}).limit(50).exec(callback);

    });


    return ShowRoomSchema;

};
module.exports = Schema;
