const mongoose = require('mongoose');


const FavoriteSchema = new mongoose.Schema(
    {
       customer : { type: String, required: true},
        Productname : { type: String, required: true},
        category: { type: String, required: true },
        description : { type: String, required: true},
        price : { type: Number, required: true},
      
        image : { type: String, required: true},

    },
    {
      timestamps: true,
    }
  );

  module.exports = mongoose.model("Favorites", FavoriteSchema);