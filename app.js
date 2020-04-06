const express = require('express');
const chalk = require('chalk');
require('dotenv').config()
const database = require('./conf');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

//Creando nuestra app a partir de la función de express
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))

//Ruta GET del home page
app.get('/', (req, res)=>{
  res.send('Conectado correctamente')
})

//Ruta GET para ver a todos los jugadores
app.get('/jugadores', (req, res)=>{
  database.query('SELECT * FROM jugadores', (error, results)=>{
    if(error){
      console.log(chalk.red.inverse('Ha habido un error en GET /jugadores'));
      res.send(error)
    } else {
      console.log(chalk.blue.inverse('Ruta GET /jugadores llamada con éxito'));
      res.send(results)
    }
  })
})

//Ruta GET para ver todos los usuarios
app.get('/users', (req, res)=>{
  database.query('SELECT * FROM users', (error, results)=>{
    if(error){
      console.log(chalk.red.inverse('Ha habido un error en GET /users'));
      res.send(error);
    } else {
      console.log(chalk.blue.inverse('Ruta GET /users llamada con éxito'));
      res.send(results);
    }
  })
})

//Ruta POST para crear un usuario
app.post('/users', async (req, res)=>{

  const hashedPassword = await bcrypt.hash(req.body.password, 5)

  const user = {
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword
  }

  database.query('INSERT INTO users SET ?', user, (error, results)=>{
    if(error){
      console.log(chalk.red.inverse('Ha habido un error en POST /users'));
      res.send(error);
    } else {
      console.log(chalk.blue.inverse('Ruta POST /users llamada con éxito'));
      res.redirect('/users');
    }
  })
})

//Ruta DELETE para eliminar usuarios
app.delete('/users/:email', (req, res)=>{
  database.query('DELETE FROM users WHERE email=?', req.params.email, (error, results)=>{
    if(error){
      console.log(chalk.red.inverse('Ha habido un error en DELETE /users'));
      res.send(error);
    } else {
      console.log(chalk.blue.inverse('Ruta DELETE /users llamada con éxito'));
      res.redirect('/users');
    }
  })
})

//Ruta para hacer login
app.post('/login', (req, res)=>{
  database.query('SELECT * FROM users', async (error, results)=>{
    //Localizamos al usurio que quiere iniciar sesion
    if(error){
      console.log(chalk.red.inverse('Error al hacer el query'))
      res.send(error)
    } else {
      const thisUser = results.find((user)=>{
        return user.email === req.body.email
      })

      if(thisUser == null){
        res.send('Este usuario NO existe')
      } else {
        if(await bcrypt.compare(req.body.password, thisUser.password)){
          res.send('La contraseña coincide. Sesión inciada')
        } else {
          res.send('La contraseña no coincide. Vuelva a intentarlo')
        }
      }
    }
  })
})

//Activando la escucha para el puerto 3000
app.listen(3000, (error)=>{
  if(error){
    console.log(chalk.red.inverse('Ha habido un error al ejecutar app.listen'))
  } else {
    console.log(chalk.green.inverse('Conectado y escuchando en el puerto 3000'))
  }
})


