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
router.use(`/subscribe`, async (req, res, next) => {
  if (!req.session || !req.session.email) {
    return res.status(401).send("User is not logged in");
  }
  const config = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    url: getLoadBalancingAddress(DB.typeEnum[req.session.type]),
    data: { subscription: req.body.subscription },
  };

  const retDB = await DB.Get(
    "/",
    DB.typeEnum[req.session.type],
    "/byUid=" + req.session._id
  );
  console.log(retDB, req.session._id);
  /*let dbRes: AxiosReturn = await Update();
  handleAxiosReturns(dbRes, res);
  res.header;*/
  return next();
});

export default router;
