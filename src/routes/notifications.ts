import { Router } from "express";
import session from "express-session";
import { Ability } from "@casl/ability";
import {
  AxiosReturn,
  getLoadBalancingAddress,
  AskBDD,
} from "../DBConnector/DBConnector";
import * as DB from "../DBConnector/DBConnector";
import * as Models from "../Models";
import * as AM from "../AbilitiesManager";

function handleAxiosReturns(dbRes, res) {
  if (!dbRes.status) {
    res.status(500).send("Internal Error");
    return;
  }
  res.status(dbRes.status).send(dbRes.data);
}

const router = Router();
router.post(`/subscribe`, async (req, res, next) => {
  if (!req.session || !req.session.email) {
    return res.status(403).send("User is not logged in");
  }
  const config = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    url: getLoadBalancingAddress(DB.typeEnum[req.session.type]),
    data: { subscription: req.body.subscription },
  };

  //const userID = "62b30e23edb06dd774f80dd5"
  const _id = req.session._id
  //const sessionType = DB.typeEnum.customer
  const sessionType = DB.typeEnum[req.session.type]
  let dbRes: AxiosReturn = await DB.PushSubscribe(_id, sessionType, req.body.subscription);
  console.log(dbRes)
  handleAxiosReturns(dbRes, res);
});

export default router;
