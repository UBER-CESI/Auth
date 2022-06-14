import { Server } from "http";
import * as Models from "./Models";
import * as Abilities from './AbilitiesManager'
import { Ability } from "@casl/ability";
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const app = express();


const saltRounds = 10;



module.exports = function (app) {
    //custommer
    app.put('/customer', function (req, res) {
        var customer: Models.User;
        try {
            customer = {
                id: "1",
                email: req.body.email,
                password: bcrypt.hash(req.body.password, saltRounds),
                nickname: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                type: Models.UserType.Custommer,
                phoneNumber: "+33625456984"
            }
        } catch (e) {
            app.send(400, "Missing Parameters in the request or labels are not matching" + e);
        }





    });

    //other routes..
}