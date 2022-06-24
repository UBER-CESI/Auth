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

//getRestaurants
router.get(['/restaurant', '/restaurant/:id'], async function (req, res) {
    const ab = new Ability(req.session.rules);
    const restaurant = {
        idOwner: (!req.params.id) ? " " : req.params.id
    }
    if (!ab.can('read', restaurant)) {
        res.status(401).send("User " + req.session.username + " cannot do that!")
        return
    }
    let dbRes: AxiosReturn = await DB.Get(restaurant.idOwner, DB.typeEnum.restaurant, "");
    handleAxiosReturns(dbRes, res)

});
//createRestaurant
router.put('/restaurant', async function (req, res) {
    var restaurant: Models.Restaurants = req.body
    const ab = new Ability(req.session.rules);
    if (!ab.can('create', restaurant)) {
        res.status(401).send("User " + req.session.username + " cannot do that!")
        return
    }
    let dbRes: AxiosReturn = await DB.Create(restaurant, DB.typeEnum.restaurant, "");
    handleAxiosReturns(dbRes, res);
});
//updateRestaurant
router.post('/restaurant/:id', async function (req, res) {
    const ab = new Ability(req.session.rules);
    const restaurant: Models.Restaurants = req.body
    restaurant.id = req.params.id
    if (!ab.can('update', restaurant)) {
        res.status(401).send("User " + req.session.username + " cannot do that!")
        return
    }

    let dbRes: AxiosReturn = await DB.Update(restaurant, DB.typeEnum.restaurant, "");
    handleAxiosReturns(dbRes, res)

});
//deleteRestaurant
router.delete('/restaurant/:id', async function (req, res) {
    const ab = new Ability(req.session.rules);
    const restaurant = {
        userId: req.params.id
    }
    if (!ab.can('delete', restaurant)) {
        res.status(401).send("User " + req.session.username + " cannot do that!")
        return
    }
    let dbRes: AxiosReturn = await DB.Delete(restaurant.userId, DB.typeEnum.restaurant, "");
    handleAxiosReturns(dbRes, res)
});
//getStatsRestaurant
router.get('/restaurant/:id/stats', async function (req, res) {
    const ab = new Ability(req.session.rules);

    const restaurantStatistics = {
        userId: req.params.id
    }
    if (!ab.can('manage', restaurantStatistics)) {
        res.status(401).send("User " + req.session.username + " cannot do that!")
        return
    }
    let dbRes: AxiosReturn = await DB.Get(restaurantStatistics.userId, DB.typeEnum.restaurant, "/stats");
    handleAxiosReturns(dbRes, res)
});
//getHistoryRestaurant
router.get('/restaurant/:id/history', async function (req, res) {
    const ab = new Ability(req.session.rules);

    const orderHistory = {
        idRestaurant: req.params.id
    }
    if (!ab.can('read', orderHistory)) {
        res.status(401).send("User " + req.session.username + " cannot do that!")
        return
    }
    let dbRes: AxiosReturn = await DB.Get(orderHistory.idRestaurant, DB.typeEnum.restaurant, "/history");
    handleAxiosReturns(dbRes, res)
});
//getListMenuByRestaurant
router.get('/restaurant/:id/menu', async function (req, res) {
    const ab = new Ability(req.session.rules);

    const menu = {
        idRestaurant: req.params.id
    }
    if (!ab.can('read', menu)) {
        res.status(401).send("User " + req.session.username + " cannot do that!")
        return
    }
    let dbRes: AxiosReturn = await DB.Get(menu.idRestaurant, DB.typeEnum.restaurant, "/menu");
    handleAxiosReturns(dbRes, res)
});
//CreateMenu
router.put('/restaurant/:id/menu', async function (req, res) {
    const ab = new Ability(req.session.rules);

    const menu = req.body
    menu.restaurantId = req.params.id
    if (!ab.can('create', menu)) {
        res.status(401).send("User " + req.session.username + " cannot do that!")
        return
    }
    let dbRes: AxiosReturn = await DB.Create(menu, DB.typeEnum.restaurant, menu.restaurantId + "/menu");
    handleAxiosReturns(dbRes, res)
});
//getDishesByRestaurant
router.get('/restaurant/:id/item', async function (req, res) {
    const ab = new Ability(req.session.rules);

    const menu = {
        idRestaurant: req.params.id
    }
    if (!ab.can('read', menu)) {
        res.status(401).send("User " + req.session.username + " cannot do that!")
        return
    }
    let dbRes: AxiosReturn = await DB.Get(menu.idRestaurant, DB.typeEnum.restaurant, "/item");
    handleAxiosReturns(dbRes, res)
});
//createDishByRestaurant
router.put('/restaurant/:id/item', async function (req, res) {
    const ab = new Ability(req.session.rules);

    const menu = req.body
    menu.restaurantId = req.params.id
    if (!ab.can('create', menu)) {
        res.status(401).send("User " + req.session.username + " cannot do that!")
        return
    }
    let dbRes: AxiosReturn = await DB.Create(menu, DB.typeEnum.restaurant, menu.restaurantId + "/item");
    handleAxiosReturns(dbRes, res)
});


//getMenu
router.get('/restaurant/menu/:id', async function (req, res) {
    const ab = new Ability(req.session.rules);

    const menu = {
        idRestaurant: req.params.id
    }
    if (!ab.can('read', menu)) {
        res.status(401).send("User " + req.session.username + " cannot do that!")
        return
    }
    let dbRes: AxiosReturn = await DB.Get(menu.idRestaurant, DB.typeEnum.menu, "");
    handleAxiosReturns(dbRes, res)
});
//updateMenu
router.post('/restaurant/menu/:id', async function (req, res) {
    const ab = new Ability(req.session.rules);
    const restaurant = req.body
    restaurant.id = req.params.id
    if (!ab.can('update', restaurant)) {
        res.status(401).send("User " + req.session.username + " cannot do that!")
        return
    }

    let dbRes: AxiosReturn = await DB.Update(restaurant, DB.typeEnum.menu, "");
    handleAxiosReturns(dbRes, res)

});
//deletMenu
router.delete('/restaurant/menu/:id', async function (req, res) {
    const ab = new Ability(req.session.rules);
    const restaurant = {
        userId: req.params.id
    }
    if (!ab.can('delete', restaurant)) {
        res.status(401).send("User " + req.session.username + " cannot do that!")
        return
    }
    let dbRes: AxiosReturn = await DB.Delete(restaurant.userId, DB.typeEnum.menu, "");
    handleAxiosReturns(dbRes, res)
});


//getDish
router.get('/restaurant/item/:id', async function (req, res) {
    const ab = new Ability(req.session.rules);

    const menu = {
        idRestaurant: req.params.id
    }
    if (!ab.can('read', menu)) {
        res.status(401).send("User " + req.session.username + " cannot do that!")
        return
    }
    let dbRes: AxiosReturn = await DB.Get(menu.idRestaurant, DB.typeEnum.item, "");
    handleAxiosReturns(dbRes, res)
});
//updateDish
router.post('/restaurant/item/:id', async function (req, res) {
    const ab = new Ability(req.session.rules);
    const restaurant = req.body
    restaurant.id = req.params.id
    if (!ab.can('update', restaurant)) {
        res.status(401).send("User " + req.session.username + " cannot do that!")
        return
    }

    let dbRes: AxiosReturn = await DB.Update(restaurant, DB.typeEnum.item, "");
    handleAxiosReturns(dbRes, res)

});
//deletDish
router.delete('/restaurant/item/:id', async function (req, res) {
    const ab = new Ability(req.session.rules);
    const restaurant = {
        userId: req.params.id
    }
    if (!ab.can('delete', restaurant)) {
        res.status(401).send("User " + req.session.username + " cannot do that!")
        return
    }
    let dbRes: AxiosReturn = await DB.Delete(restaurant.userId, DB.typeEnum.item, "");
    handleAxiosReturns(dbRes, res)
});


export default router