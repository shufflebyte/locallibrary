var mongoose = require('mongoose')
var moment = require('moment')

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
    {
        first_name: {type: String, required: true, max: 100},
        family_name: {type: String, required: true, max: 100},
        date_of_birth: {type: Date},
        date_of_death: {type: Date}, 
    }
);
// add a virtual property 'name' and build it from first name and name
AuthorSchema
.virtual('name')
.get(function() {
    var fullname = '';
    if (this.first_name && this.family_name) {
        fullname = this.family_name + ', ' + this.first_name
    }
    if (!this.first_name || !this.family_name) {
        fullname = ''
    }
    return fullname
});

// add a virtual property lifespan
AuthorSchema
.virtual('lifespan')
.get(function(){
    if (this.date_of_birth)
        retVal = moment(this.date_of_birth).format('DD.MM.YYYY');
    if (this.date_of_death)
        retVal += ' - ' + moment(this.date_of_death).format('DD.MM.YYYY');
    return retVal;
});

AuthorSchema.virtual('date_of_birth_formatted').get(function() {
    return moment(this.date_of_birth).format('DD.MM.YYYY');
  });
  
AuthorSchema.virtual('date_of_death_formatted').get(function() {
    return moment(this.date_of_death).format('DD.MM.YYYY');
  });

// add a virtual property for author's url
AuthorSchema
.virtual('url')
.get(function(){
    return '/catalog/author/' + this._id;
});

// export module
module.exports = mongoose.model('Author', AuthorSchema);