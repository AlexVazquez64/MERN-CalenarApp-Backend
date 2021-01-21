// const express = require('express');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const Usuario = require('../models/Usuario');

const createUser = async( req, res = response ) => {

  const { email , password } = req.body;

  try {

    let usuario = await Usuario.findOne({ email });

    if ( usuario ) {
      return res.status(400).json({
        ok: false,
        msg: 'Ya existe un usuario con ese correo'
      });
    }

    usuario = new Usuario( req.body );

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password, salt );

    // Generar el usuario en la DB
    await usuario.save();

    // Generar JWT
    const token = await generateJWT( usuario.id, usuario.name );
    
    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

const loginUser = async(req, res = response) => {

  const { email , password } = req.body;

  try {

    const usuario = await Usuario.findOne({ email });

    if ( !usuario ) {
      return res.status(400).json({
        ok: false,
        msg: 'No existe ese usuario'
      });
    }

    // Confirmar los passwords
    const validatePassword = bcrypt.compareSync( password, usuario.password );

    if ( !validatePassword ) {
      return res.status(400).json({
        ok: false,
        msg: 'Password incorrecto'
      });
    }

    // Generar nuestro JWT
    const token = await generateJWT( usuario.id, usuario.name );

    res.json({
      ok: true,
      msg: 'Login correcto',
      uid: usuario.id,
      name: usuario.name,
      token,
  
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
  
}

const revalidateToken = async( req, res = response ) => {

  const { uid, name } = req;

  // Generar un nuevo JWT y retornarlo en esta petición
  // Generar JWT
  const token = await generateJWT( uid, name );

  res.json({
    ok: true,
    msg: 'Token renovado',
    token

  });
}

module.exports = {
  createUser,
  loginUser,
  revalidateToken,

}