import { Router } from "express"
import session from "express-session"
import { Ability } from "@casl/ability";
import { AxiosReturn } from "../DBConnector/DBConnector";
import * as DB from "../DBConnector/DBConnector"
import * as Models from "../Models";

function handleAxiosReturns(dbRes, res) {
    if (!dbRes.status) {
        res.status(500).send("Internal Error")
        return
    }
    res.status(dbRes.status).send(dbRes.data)
}
const router = Router()

//getDeliverer
router.get(['/deliverer', '/deliverer/:id'], async function (req, res) {
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
    let dbRes: AxiosReturn = await DB.Get(restaurant.idOwner, DB.typeEnum.deliverer, "");
    handleAxiosReturns(dbRes, res)
});
//createDeliverer
router.put('/deliverer', async function (req, res) {
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
    let dbRes: AxiosReturn = await DB.Create(restaurant, DB.typeEnum.deliverer, "");
    handleAxiosReturns(dbRes, res);
});
//updateDeliverer
router.post('/deliverer/:id', async function (req, res) {
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
    let dbRes: AxiosReturn = await DB.Update(restaurant, DB.typeEnum.deliverer, "");
    handleAxiosReturns(dbRes, res)
});
//deleteDeliverer
router.delete('/deliverer/:id', async function (req, res) {
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
    let dbRes: AxiosReturn = await DB.Delete(restaurant.userId, DB.typeEnum.deliverer, "");
    handleAxiosReturns(dbRes, res)
});
//getHistoryDeliverer
router.get('/deliverer/:id/history', async function (req, res) {

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
    let dbRes: AxiosReturn = await DB.Get(orderHistory.idRestaurant, DB.typeEnum.order, "/history");
    handleAxiosReturns(dbRes, res)
});

export default router