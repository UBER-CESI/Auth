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
//createCustomer
router.put('/customer', async function (req, res) {
    var customer: Models.User = req.body;
    //createUser then createCustomer
    let dbRes: AxiosReturn = await DB.Create(customer, DB.typeEnum.customer, " ");
    handleAxiosReturns(dbRes, res)
});
router.use("/customer", (req, res, next) => {
    if (!req.session || !req.session.email) {
        return res.status(401).send("User is not logged in")
    }
    return next()
})
//getCustomer
router.get(['/customer', '/customer/:id'], async function (req, res) {
    const ab = new Ability(req.session.rules);
    if (!ab.can('read', "account")) {
        res.status(401).send("User " + req.session.nickname + " cannot do that!")
        return
    }
    let dbRes: AxiosReturn = await DB.Get(req.params.id || "", DB.typeEnum.customer, "");
    handleAxiosReturns(dbRes, res)
});
//deleteCustomer
router.delete('/customer/:id', async function (req, res) {
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
        handleAxiosReturns(dbRes, res)
        return;
    }
    res.send(dbRes.data)
});




//updateCustomer
router.post('/customer/:id', async function (req, res) {
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
    handleAxiosReturns(dbRes, res)
});
//getCustomerHistory
router.get('/customer/:id/history', async function (req, res) {
    const orderHistory = {
        idRestaurant: req.params.id
    }
    const ab = new Ability(req.session.rules);
    if (!ab.can('read', orderHistory)) {
        res.status(401).send("User " + req.session.username + " cannot do that!")
        return
    }

    let dbRes: AxiosReturn = await DB.Get(orderHistory.idRestaurant, DB.typeEnum.customer, "/history");
    handleAxiosReturns(dbRes, res)
});
//suspendCustomer
router.post('/customer/:id/suspend', async function (req, res) {
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
        handleAxiosReturns(dbRes, res)
        return;
    }
    res.send(dbRes.data)
});

export default router