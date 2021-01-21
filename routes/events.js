// Otra forma de utiliar Router ---
// const express = require('express');
// const router = express.Router

/*
  Rutas de Events
  host + /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');

const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');

const { isDate } = require('../helpers/isDate');

const router = Router();

// Todas tienen que pasar por el middleware( validateJWT ) la validación del JWT

router.use( validateJWT );

// Obtener eventos
router.get(
  '/',
  getEvents
);

// Crear un nuevo evento
router.post(
  '/',
  [
    check( 'title', 'El titulo es obligatorio' ).notEmpty(),
    check( 'start', 'Fecha de inicio es obligatoria' ).toDate().isISO8601(),
    check( 'end', 'Fecha de finalización es obligatoria' ).custom( isDate ),
    validarCampos
  ],
  createEvent
);

// Actualizar un evento
router.put(
  '/:id',
  [
    check( 'title', 'El titulo es obligatorio' ).notEmpty(),
    check( 'start', 'Fecha de inicio es obligatoria' ).toDate().isISO8601(),
    check( 'end', 'Fecha de finalización es obligatoria' ).custom( isDate ),
    validarCampos
  ],
  updateEvent
);

// Borrar un evento
router.delete(
  '/:id',
  deleteEvent
);

module.exports = router;