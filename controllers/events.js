const { response } = require("express");
const Event = require("../models/Event");


const getEvents = async( req, res = response ) => {

  const events = await Event.find().populate('user', 'name');

  try {
    return res.status(200).json({
      ok: true,
      msg: 'Events were listed correctly',
      events
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Please talk to the administrator'
    });
  }

}

const createEvent = async( req, res = response ) => {

  // Verificar que tenga el evento.
  const event = new Event( req.body );

  try {
    event.user = req.uid;
    const savedEvent = await event.save();

    res.status(200).json({
      ok: true,
      msg: "The event has been saved",
      evento: savedEvent
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Please talk to the administrator'
    });
  }

}

const updateEvent = async( req, res = response ) => {

  const eventId = req.params.id;
  const uid = req.uid;

  try {

    const event = await Event.findById( eventId );

    // Si el evento no existe con ese ID
    if ( !event ) {
      return res.status(404).json({
        ok: false,
        msg: 'This event does not exist with that id',
        
      });
    }

    // Si el usuario es el mismo que creo el evento
    if ( event.user.toString() !== uid ) {
      return res.status(401).json({
        ok: false,
        msg: 'You do not have the privilege to edit this event',
      });
    }

    const newEvent = {
      ...req.body,
      user: uid
    }

    const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

    res.status(200).json({
      ok: true,
      evento: eventUpdated,
      msg: "The event has been updated",
    });

  } catch (error) {
    console.log( error )
      res.status(500).json({
      ok: false,
      msg: 'Please talk to the administrator'
    });
  }
}

const deleteEvent = async( req, res = response ) => {

  const eventId = req.params.id;
  const uid = req.uid;

  try {

    const event = await Event.findById( eventId );

    // Si el evento no existe con ese ID
    if ( !event ) {
      return res.status(404).json({
        ok: false,
        msg: 'This event does not exist with that id',
        
      });
    }

    // Si el usuario es el mismo que creo el evento
    if ( event.user.toString() !== uid ) {
      return res.status(401).json({
        ok: false,
        msg: 'You do not have the privilege to delete this event',
      });
    }
    
    const eventDeleted = await Event.findByIdAndDelete( eventId );

    res.status(200).json({
      ok: true,
      evento: eventDeleted,
      msg: "The event has been deleted",
    });

  } catch (error) {
    console.log( error )
    res.status(500).json({
      ok: false,
      msg: 'Please talk to the administrator'
    });
  }

}

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
}