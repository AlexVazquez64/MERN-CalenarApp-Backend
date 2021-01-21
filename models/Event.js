const { Schema, model } = require('mongoose');

const EventSchema = Schema({

  title: {
    type: String,
    required: true,
    
  },
  notes: {
    type: String,

  },
  start: {
    type: Date,
    required: true,

  },
  end: {
    type: Date,
    required: true,

  },
  // Se declara el Schema Usuario en el modelo para saber quien creo el registro y para hacer validaciones después
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,

  }
});

// Este método solo funciona a la hora de llamar el método
// toJSON (solo para verlo), no se hacen modificaciones a la MongoDB
EventSchema.method( 'toJSON', function() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});


module.exports = model( 'Event', EventSchema );