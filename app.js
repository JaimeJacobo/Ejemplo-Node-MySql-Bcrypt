const express = require('express');
const chalk = require('chalk');
require('dotenv').config()

//Creando nuestra app a partir de la función de express
const app = express();

//Ruta GET del home page
app.get('/', (req, res)=>{
  res.send('Conectado correctamente')
})

//Activando la escucha para el puerto 3000
app.listen(3000, (error)=>{
  if(error){
    console.log(chalk.red.inverse('Ha habido un error al ejecutar app.listen'))
  } else {
    console.log(chalk.green.inverse('Conectado y escuchando en el puerto 3000'))
  }
})


