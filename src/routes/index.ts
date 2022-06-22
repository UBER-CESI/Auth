import { request, Server } from "http";
import * as DB from "../DBConnector/DBConnector"
import * as Models from "../Models";
import * as Abilities from '../AbilitiesManager'
import { Ability } from "@casl/ability";
import { AxiosReturn } from "../DBConnector/DBConnector";
import { strictEqual } from "assert";
import bodyParser from "body-parser";
import bcrypt from 'bcrypt'
import { Router } from "express";

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

function createRouter(capabilities: Array<string>, type: string) {
    const router = Router()
    capabilities.forEach(cap => {
        autoRouter[cap](router, type)
    })
    return router
}
module.exports = function (app) {
   
    app.use("/", createRouter(["CREATE", "SESSIONERROR", "GET", "UPDATE", "DELETE"], "customer"))
    app.use("/", createRouter(["SESSIONERROR", "CREATE", "GET", "UPDATE", "DELETE"], "restaurant"))
    app.use("/", createRouter(["SESSIONERROR", "CREATE", "GET", "UPDATE", "DELETE"], "deliverer"))
    app.use("/", createRouter(["SESSIONERROR", "CREATE", "GET", "UPDATE", "DELETE", "PAY", "ACCEPT"], "order"))
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