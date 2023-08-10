const mongoose = require('mongoose')

const EventsWorldShema = mongoose.Schema({
    name: String,
    description: String
},{
    timestamps: true
})

module.exports = mongoose.model('EventsWorld', EventsWorldShema)