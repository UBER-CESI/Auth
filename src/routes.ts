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
class account { // business entity
    constructor(props) {
        Object.assign(this, props);
    }
}

module.exports = function (app) {
    //createCustomer
    app.put('/customer', async function (req, res) {
        if (!req.session.email) {
            res.status(401).json("User is not logged in")
            return;
        }
        var customer: Models.User = req.body;

        //createUser then createCustomer
        let dbRes: AxiosReturn = await DB.Create(customer, DB.typeEnum.customer, " ");
        res.status(dbRes.status).send(dbRes.data);
    });
    //getCustomer
    app.get(['/customer', '/customer/:id'], async function (req, res) {
        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const account2 = {
            idOwner: (!req.params.id) ? " " : req.params.id
        }

        const ab = new Ability(req.session.rules);
        if (!ab.can('read', new account({ idOwner: req.session.id }))) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        let dbRes: AxiosReturn = await DB.Get(account2.idOwner, DB.typeEnum.customer, "");
        res.status(dbRes.status).send(dbRes.data)
    });
    //deleteCustomer
    app.delete('/customer/:id', async function (req, res) {
        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const account = {
            idOwner: req.params.id
        }
        const ab = new Ability(req.session.rules);
        if (!ab.can('delete', account)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        let dbRes: AxiosReturn = await DB.Delete(account.idOwner, DB.typeEnum.customer, "");
        if (dbRes.error) {
            res.status(dbRes.status).send(dbRes.data)
            return;
        }
        res.send(dbRes.data)
    });
    //updateCustomer
    app.post('/customer/:id', async function (req, res) {

        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);
        const account = {
            idOwner: req.params.id
        }
        if (!ab.can('update', account)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }

        const user: Models.User = req.body;
        user.id = req.params.id
        let dbRes: AxiosReturn = await DB.Update(user, DB.typeEnum.customer, "");
        res.status(dbRes.status).send(dbRes.data)
    });
    //getCustomerHistory
    app.get('/customer/:id/history', async function (req, res) {

        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }

        const orderHistory = {
            idRestaurant: req.params.id
        }
        const ab = new Ability(req.session.rules);
        if (!ab.can('read', orderHistory)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }

        let dbRes: AxiosReturn = await DB.Get(orderHistory.idRestaurant, DB.typeEnum.customer, "/history");
        res.status(dbRes.status).send(dbRes.data)
    });
    //suspendCustomer
    app.post('/customer/:id/suspend', async function (req, res) {

        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);

        const account = {
            idOwner: req.params.id
        }
        var sus;

        (req.body.suspend.toLowerCase() == "true") ? sus = " " : (req.body.suspend.toLowerCase() == "false") ? sus = "" : () => { res.status(401).send("suspend is not a boolean"); return };

        if (!ab.can('suspend', account)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }

        let dbRes: AxiosReturn = await DB.SuspendCustomer(account.idOwner, sus);
        if (dbRes.error) {
            res.status(dbRes.status).send(dbRes.data)
            return;
        }
        res.send(dbRes.data)
    });


    //getRestaurants
    app.get(['/restaurant', '/restaurant/:id'], async function (req, res) {
        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);
        const restaurant = {
            idOwner: (!req.params.id) ? " " : req.params.id
        }
        if (!ab.can('read', restaurant)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        let dbRes: AxiosReturn = await DB.Get(restaurant.idOwner, DB.typeEnum.restaurants, "");
        res.status(dbRes.status).send(dbRes.data)

    });
    //createRestaurant
    app.put('/restaurant', async function (req, res) {
        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        var restaurant: Models.Restaurants = req.body
        const ab = new Ability(req.session.rules);
        if (!ab.can('create', restaurant)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        let dbRes: AxiosReturn = await DB.Create(restaurant, DB.typeEnum.restaurants, "");
        res.status(dbRes.status).send(dbRes.data);
    });
    //updateRestaurant
    app.post('/restaurant/:id', async function (req, res) {

        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);
        const restaurant: Models.Restaurants = req.body
        restaurant.id = req.params.id
        if (!ab.can('update', restaurant)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }

        let dbRes: AxiosReturn = await DB.Update(restaurant, DB.typeEnum.restaurants, "");
        res.status(dbRes.status).send(dbRes.data)

    });
    //deleteRestaurant
    app.delete('/restaurant/:id', async function (req, res) {
        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);
        const restaurant = {
            userId: req.params.id
        }
        if (!ab.can('delete', restaurant)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        let dbRes: AxiosReturn = await DB.Delete(restaurant.userId, DB.typeEnum.restaurants, "");
        res.status(dbRes.status).send(dbRes.data)
    });
    //getStatsRestaurant
    app.get('/restaurant/:id/stats', async function (req, res) {
        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);

        const restaurantStatistics = {
            userId: req.params.id
        }
        if (!ab.can('manage', restaurantStatistics)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        let dbRes: AxiosReturn = await DB.Get(restaurantStatistics.userId, DB.typeEnum.restaurants, "/stats");
        res.status(dbRes.status).send(dbRes.data)
    });
    //getHistoryRestaurant
    app.get('/restaurant/:id/history', async function (req, res) {

        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);

        const orderHistory = {
            idRestaurant: req.params.id
        }
        if (!ab.can('read', orderHistory)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        let dbRes: AxiosReturn = await DB.Get(orderHistory.idRestaurant, DB.typeEnum.restaurants, "/history");
        res.status(dbRes.status).send(dbRes.data)
    });
    //getListMenuRestaurant
    app.get('/restaurant/:id/menu', async function (req, res) {

        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);

        const menu = {
            idRestaurant: req.params.id
        }
        if (!ab.can('read', menu)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        let dbRes: AxiosReturn = await DB.Get(menu.idRestaurant, DB.typeEnum.restaurants, "/menu");
        res.status(dbRes.status).send(dbRes.data)
    });
    //CreateMenu
    app.put('/restaurant/:id/menu', async function (req, res) {

        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);

        const menu = req.body
        menu.restaurantId = req.params.id
        console.log(menu.items);
        if (!ab.can('create', menu)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        let dbRes: AxiosReturn = await DB.Create(menu, DB.typeEnum.restaurants, menu.restaurantId + "/menu");
        res.status(dbRes.status).send(dbRes.data)
    });


    //getOrder
    app.get(['/order', '/order/:id'], async function (req, res) {
        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);
        const restaurant = {
            idOwner: (!req.params.id) ? " " : req.params.id
        }
        if (!ab.can('read', restaurant)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        let dbRes: AxiosReturn = await DB.Get(restaurant.idOwner, DB.typeEnum.orders, "");
        res.status(dbRes.status).send(dbRes.data)

    });
    //createOrder
    app.put('/order', async function (req, res) {
        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        var restaurant = req.body
        const ab = new Ability(req.session.rules);
        if (!ab.can('create', restaurant)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        let dbRes: AxiosReturn = await DB.Create(restaurant, DB.typeEnum.orders, "");
        res.status(dbRes.status).send(dbRes.data);
    });
    //updateOrder
    app.post('/order/:id', async function (req, res) {

        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);

        console.log(req.body.items)
        const restaurant: Models.Restaurants = req.body
        restaurant.id = req.params.id
        if (!ab.can('update', restaurant)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }

        let dbRes: AxiosReturn = await DB.Update(restaurant, DB.typeEnum.orders, "");
        res.status(dbRes.status).send(dbRes.data)

    });
    //deleteOrder
    app.delete('/order/:id', async function (req, res) {
        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);
        const restaurant = {
            userId: req.params.id
        }
        if (!ab.can('delete', restaurant)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        let dbRes: AxiosReturn = await DB.Delete(restaurant.userId, DB.typeEnum.orders, "");
        res.status(dbRes.status).send(dbRes.data)
    });
    //payOrder
    app.post('/order/:id/pay', async function (req, res) {

        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);


        const restaurant: Models.Restaurants = req.body
        restaurant.id = req.params.id
        if (!ab.can('update', restaurant)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }

        let dbRes: AxiosReturn = await DB.Update(restaurant, DB.typeEnum.orders, "/pay");
        res.status(dbRes.status).send(dbRes.data)

    });
    //acceptOrder
    app.post('/order/:id/accept', async function (req, res) {

        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);

        console.log(req.body)
        const restaurant: Models.Restaurants = req.body
        restaurant.id = req.params.id
        if (!ab.can('update', restaurant)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }

        let dbRes: AxiosReturn = await DB.Update(restaurant, DB.typeEnum.orders, "/accept");
        res.status(dbRes.status).send(dbRes.data)

    });


    //getDeliverer
    app.get(['/deliverer', '/deliverer/:id'], async function (req, res) {
        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);
        const restaurant = {
            idOwner: (!req.params.id) ? " " : req.params.id
        }
        if (!ab.can('read', restaurant)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        let dbRes: AxiosReturn = await DB.Get(restaurant.idOwner, DB.typeEnum.deliverers, "");
        res.status(dbRes.status).send(dbRes.data)
    });
    //createDeliverer
    app.put('/deliverer', async function (req, res) {
        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        var restaurant = req.body
        const ab = new Ability(req.session.rules);
        if (!ab.can('create', restaurant)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        let dbRes: AxiosReturn = await DB.Create(restaurant, DB.typeEnum.deliverers, "");
        res.status(dbRes.status).send(dbRes.data);
    });
    //updateDeliverer
    app.post('/deliverer/:id', async function (req, res) {
        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);
        const restaurant = req.body
        restaurant.id = req.params.id
        if (!ab.can('update', restaurant)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        let dbRes: AxiosReturn = await DB.Update(restaurant, DB.typeEnum.deliverers, "");
        res.status(dbRes.status).send(dbRes.data)
    });
    //deleteDeliverer
    app.delete('/deliverer/:id', async function (req, res) {
        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);
        const restaurant = {
            userId: req.params.id
        }
        if (!ab.can('delete', restaurant)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        let dbRes: AxiosReturn = await DB.Delete(restaurant.userId, DB.typeEnum.deliverers, "");
        res.status(dbRes.status).send(dbRes.data)
    });
    //getHistoryDeliverer
    app.get('/deliverer/:id/history', async function (req, res) {

        if (!req.session.email) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);

        const orderHistory = {
            idRestaurant: req.params.id
        }
        if (!ab.can('read', orderHistory)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        let dbRes: AxiosReturn = await DB.Get(orderHistory.idRestaurant, DB.typeEnum.orders, "/history");
        res.status(dbRes.status).send(dbRes.data)
    });







    //routes menu (attendre la modification)

    //getMenu
    //updateMenu
    //deleteMenu

    //getDish
    //updatedish
    //deletedish







    //getMenuInfo
    /*
    app.get('/restaurant/menu', async function (req, res) {

        if (!req.session.username) {
            res.status(401).send("User is not logged in")
            return;
        }
        const ab = new Ability(req.session.rules);
        if (req.body.idRestaurant === undefined || req.body.idRestaurant == "") {
            res.status(401).send("idRestaurant is blank. specify the idRestaurant")
            return
        }
        const menu = {
            idRestaurant: req.body.id
        }
        if (!ab.can('read', menu)) {
            res.status(401).send("User " + req.session.username + " cannot do that!")
            return
        }
        let dbRes: AxiosReturn = await DB.Get(menu.idRestaurant, DB.typeEnum.restaurants, menu.restaurantId + "/menu/" + );
        res.status(dbRes.status).send(dbRes.data)
    });*/

}