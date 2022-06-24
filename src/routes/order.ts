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


//getOrder
router.get(['/order', '/order/:id'], async function (req, res) {
    const ab = new Ability(req.session.rules);
    const restaurant = {
        idOwner: (!req.params.id) ? " " : req.params.id
    }
    if (!ab.can('read', restaurant)) {
        res.status(401).send("User " + req.session.username + " cannot do that!")
        return
    }
    let dbRes: AxiosReturn = await DB.Get(restaurant.idOwner, DB.typeEnum.order, "");
    handleAxiosReturns(dbRes, res)

});
//createOrder
router.put('/order', async function (req, res) {
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
    let dbRes: AxiosReturn = await DB.Create(restaurant, DB.typeEnum.order, "");
    handleAxiosReturns(dbRes, res);
});
//updateOrder
router.post('/order/:id', async function (req, res) {

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

    let dbRes: AxiosReturn = await DB.Update(restaurant, DB.typeEnum.order, "");
    handleAxiosReturns(dbRes, res)

});
//deleteOrder
router.delete('/order/:id', async function (req, res) {
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
    let dbRes: AxiosReturn = await DB.Delete(restaurant.userId, DB.typeEnum.order, "");
    handleAxiosReturns(dbRes, res)
});
//payOrder
router.post('/order/:id/pay', async function (req, res) {

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

    let dbRes: AxiosReturn = await DB.Update(restaurant, DB.typeEnum.order, "/pay");
    handleAxiosReturns(dbRes, res)

});
//acceptOrder
router.post('/order/:id/accept', async function (req, res) {

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

    let dbRes: AxiosReturn = await DB.Update(restaurant, DB.typeEnum.order, "/accept");
    handleAxiosReturns(dbRes, res)

});

export default router