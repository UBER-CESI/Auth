import { Server } from "http";
import * as DB from "./DBConnector/DBConnector"
import * as ph from "./PlaceHolders"
import * as Models from "./Models";
import * as Abilities from './AbilitiesManager'
import { Ability } from "@casl/ability";
import { AxiosReturn } from "./DBConnector/DBConnector";
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const app = express();


const saltRounds = 10;
interface IdAbility {
    idOwner: string
}


module.exports = function (app) {
    //createCustommer
    app.put('/customer', async function (req, res) {
        if (!req.session.username) {
            res.status(401).send("User is not logged in")
            return;
        }
        var customer: Models.User;
        customer = {
            email: req.body.email,
            password: req.body.password,
            nickname: req.body.username,
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            type: Models.UserType.Custommer,
            phoneNumber: req.body.phoneNumber
        }
        //createUser then createCustomer
        let dbRes: AxiosReturn = await DB.CreateCustomer(customer);
        if (dbRes.error) {

            res.status(dbRes.status).send(dbRes.data);
            return;
        }
        res.send(dbRes.data)
    });
    //getCustommer
    app.get('/customer', async function (req, res) {
        if (!req.session.username) {
            res.send(401, "User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);
        const account = {
            idOwner: (req.body.id === undefined) ? " " : req.body.id
        }

        if (!ab.can('read', account)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        //createUser then createCustomer
        let dbRes: AxiosReturn = await DB.GetCustomer(account.idOwner);
        if (dbRes.error) {
            res.status(dbRes.status).send(dbRes.data)
            return;
        }
        res.send(dbRes.data)
    });



    //other routes..
}