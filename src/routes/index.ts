import { request, Server } from "http";
import * as DB from "../DBConnector/DBConnector"
import * as Models from "../Models";
import * as Abilities from '../AbilitiesManager'
import { Ability } from "@casl/ability";
import { AxiosReturn } from "../DBConnector/DBConnector";
import { strictEqual } from "assert";
import bodyParser from "body-parser";
import bcrypt from 'bcrypt'

import customers from "./customer"
import restaurants from "./restaurant"
import orders from "./order"
import deliverers from "./deliverer"

import autoRouter from "./generic";
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

    app.use("/", customers)
    app.use("/", restaurants)
    app.use("/", orders)
    app.use("/", deliverers)

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