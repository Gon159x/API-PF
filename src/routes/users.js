const { Router } = require('express');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const auth = require('../controllers/authMiddleware');
const { Admin, Chat, Contract, Job, User, Worker, Country } = require("../db.js")

// importarme los modelos



const router = Router();

const getUsers = async () => {
    const info = await User.findAll({include:[{model:Worker,include:[Job]},{model:Contract},{model:Chat},{model:Country}]})

    const dataUser = info?.map((u) => {
        return {
            id: u.ID,
            name: u.name,
            lastName: u.lastName,
            img: u.img,
            email: u.email,
            password: u.password,
            phone: u.phone,
            dni: u.dni, 
            location: u.Country,
            status: u.status,
            Worker: u.Worker,
            Contracts: u.Contracts,
            Chats: u.Chats
        }
    });
    return dataUser;
}

const filterItems = function(user, name) {
    return user.filter((u) => {
       return u.name.toLowerCase().includes(name.toLowerCase())             
  })
}

router.get('/', async (req, res, next) =>{
    const {name} = req.query;
    const users = await getUsers();
    try {
        if(!name){
            res.send(users)
        } else{
            const userName = filterItems(users, name)            
            userName.length > 0 ? res.status(200).send(userName) : res.status(404).send({message: 'El usuario no existe'}) // aca deberia mandar                      
        }
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) =>{
    const { id } = req.params;
    const users = await getUsers();
    try {
        if(id){
            let user = users.find(u => u.id === id)
            if(user){
                res.status(200).json(user)
            }else {
                res.status(500).send({message: "no existe el user"})
            }
        }
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {

    const {name, lastName, img, email, password, phone, dni, location } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);

        let user = await User.create({
            name,
            lastName,
            img,
            email,
            password: await bcrypt.hash(password, salt),
            phone,
            dni,
        })

        user.setCountry(location)
        res.status(200).json(user) // para agarrar el id de usuario al crearlo
    } catch (error) {
        next(error)
    }
})


router.put('/:id', async (req, res, next) => {   
    const info = req.body;
    const {id} = req.params; 
    const salt = await bcrypt.genSalt(10);    
    try {
        const updatedUser = await User.findOne({where: {ID: id}});        
        const us = await updatedUser.update({
            email: info.email,
            password: await bcrypt.hash(info.password, salt),
            phone: info.phone,
            img: info.img, 
            location: info.location
        })
        res.status(200).json(us)       
    } catch (error) {
        res.status(500).send("entro al catch")        
    }
})

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    try {
        const deleted = await User.destroy({
            where: { id: id }
        });
        if (deleted) {
            return res.status(200).send("User deleted");
        }
        throw new Error("User not found");
    } catch (error) {
        next()
    }
})

module.exports = router