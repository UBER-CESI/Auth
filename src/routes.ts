import { request, Server } from "http";
import * as DB from "./DBConnector/DBConnector"
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
            nickname: req.body.nickname,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            type: Models.UserType.Customer,
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
            res.status(401).send("User is not logged in")
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
        let dbRes: AxiosReturn = await DB.Get(account.idOwner, DB.serverType.customer);
        if (dbRes.error) {
            res.status(dbRes.status).send(dbRes.data)
            return;
        }
        res.send(dbRes.data)
    });
    //deleteCustommer
    app.delete('/customer', async function (req, res) {
        if (!req.session.username) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);
        const account = {
            idOwner: (req.body.id === undefined) ? " " : req.body.id
        }
        if (!ab.can('delete', account)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        let dbRes: AxiosReturn = await DB.Delete(account.idOwner, DB.serverType.customer);
        if (dbRes.error) {
            res.status(dbRes.status).send(dbRes.data)
            return;
        }
        res.send(dbRes.data)
    });
    //updateCustommer
    app.post('/customer', async function (req, res) {

        if (!req.session.username) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);
        if (req.body.id === undefined || req.body.id == "") {
            res.status(401).send("Id is blank. specify the id")
            return
        }
        const account = {
            idOwner: (req.body.id === undefined) ? " " : req.body.id
        }
        if (!ab.can('update', account)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }

        const user: Models.User = {
            id: req.body.id,
            email: req.body.email,
            nickname: req.nickname,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phoneNumber: req.body.phoneNumber,
            password: "",
            type: Models.UserType.Customer,
            suspendedAt: req.body.suspendedAt
        }
        let dbRes: AxiosReturn = await DB.UpdateCustomer(user);
        if (dbRes.error) {
            res.status(dbRes.status).send(dbRes.data)
            return;
        }
        res.send(dbRes.data)
    });
    //getCustommerHistory
    app.get('/customer/history', async function (req, res) {

        if (!req.session.username) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);
        if (req.body.id === undefined || req.body.id == "") {
            res.status(401).send("Id is blank. specify the id")
            return
        }
        const orderHistory = {
            idOwner: (req.body.id === undefined) ? " " : req.body.id
        }
        if (!ab.can('read', orderHistory)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }

        let dbRes: AxiosReturn = await DB.GetHistory(orderHistory.idOwner, DB.serverType.customer);
        if (dbRes.error) {
            res.status(dbRes.status).send(dbRes.data)
            return;
        }
        res.send(dbRes.data)
    });
    app.post('/customer/suspend', async function (req, res) {

        if (!req.session.username) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);
        /*
        if (req.body.id === undefined || req.body.id == "") {
            res.status(401).send("Id is blank. specify the id")
            return
        }*/
        const account = {
            idOwner: (req.body.id === undefined) ? " " : req.body.id
        }
        if (!ab.can('suspend', account)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }


        let dbRes: AxiosReturn = await DB.SuspendCustomer(account.idOwner);
        if (dbRes.error) {
            res.status(dbRes.status).send(dbRes.data)
            return;
        }
        res.send(dbRes.data)
    });




    //other routes..
}