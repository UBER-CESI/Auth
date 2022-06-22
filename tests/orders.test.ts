import index from "../src/index";
import axios from "axios";
import { expect, should } from "chai";
import "mocha";

const instance = axios.create({
  withCredentials: true,
  baseURL: "http://127.0.0.1:" + 3000,
});

const baseURL = "http://127.0.0.1:" + 3000;
instance.defaults.baseURL = baseURL;

describe("Test Customer routes", () => {
  var userId: Number;
  var user = {
    email: "mocha@test.fr",
    nickname: "mocha",
    firstname: "test",
    lastname: "yes",
    phoneNumber: "0666666666",
  };
  const admin = {
    email: "a@a",
    password: "password",
  };
  var connect_sid: string;
  before(() => {
    var config = {
      method: "post",
      url: "/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(admin),
    };
    return instance(config)
      .then(function (response) {
        expect(response.status).to.equal(200);
        userId = response.data.userId;
        expect(response.headers["set-cookie"]).to.have.lengthOf.above(0);
        if (response.headers["set-cookie"])
          connect_sid = response.headers["set-cookie"]?.[0].split(";")[0];
      })
      .catch((e) => console.log(e));
  });
  it("Register a customer", () => {
    var config = {
      method: "put",
      url: "/customer",
      headers: {
        "Content-Type": "application/json",
        Cookie: connect_sid + ";",
      },
      data: JSON.stringify(user),
    };
    return instance(config).then(function (response) {
      expect(response.status).to.equal(201);
      userId = response.data._id;
    });
  });
  it("Get the customer", () => {
    var config = {
      method: "get",
      url: "customer/" + userId,
      headers: { Cookie: connect_sid + ";" },
    };

    return instance(config).then(function (response) {
      expect(response.data.email).to.equal(user.email);
      expect(response.data.nickname).to.equal(user.nickname);
      expect(response.data.firstname).to.equal(user.firstname);
      expect(response.data.lastname).to.equal(user.lastname);
      expect(response.data.phoneNumber).to.equal(user.phoneNumber);
      expect(response.status).to.equal(200);
    });
  });
  it("Get the customer by its UID", () => {
    var config = {
      method: "get",
      url: "customer/?byUid=" + userId,
      headers: {
        "Content-Type": "application/json",
        Cookie: connect_sid + ";",
      },
    };

    return instance(config).then(function (response) {
      const result = response.data.find((u: any) => u._id == userId);

      expect(result.email).to.equal(user.email);
      expect(result.nickname).to.equal(user.nickname);
      expect(result.firstname).to.equal(user.firstname);
      expect(result.lastname).to.equal(user.lastname);
      expect(result.phoneNumber).to.equal(user.phoneNumber);
      expect(response.status).to.equal(200);
    });
  });
  it("Edit the customer", () => {
    user.email = "mocha2@test.fr";
    var config = {
      method: "post",
      url: "customer/" + userId,
      headers: {
        "Content-Type": "application/json",
        Cookie: connect_sid + ";",
      },
      data: JSON.stringify(user),
    };
    return instance(config).then(function (response) {
      expect(response.data.email).to.equal(user.email);
      expect(response.data.nickname).to.equal(user.nickname);
      expect(response.data.firstname).to.equal(user.firstname);
      expect(response.data.lastname).to.equal(user.lastname);
      expect(response.data.phoneNumber).to.equal(user.phoneNumber);
      expect(response.status).to.equal(200);
    });
  });
  it("Get the edited customer", () => {
    var config = {
      method: "get",
      url: "customer/" + userId,
      headers: {
        Cookie: connect_sid + ";",
      },
    };

    return instance(config).then(function (response) {
      expect(response.data.email).to.equal(user.email);
      expect(response.data.nickname).to.equal(user.nickname);
      expect(response.data.firstname).to.equal(user.firstname);
      expect(response.data.lastname).to.equal(user.lastname);
      expect(response.data.phoneNumber).to.equal(user.phoneNumber);
      expect(response.status).to.equal(200);
    });
  });
  it("Suspend the customer", () => {
    user.email = "mocha2@test.fr";
    var config = {
      method: "post",
      url: "customer/" + userId + "/suspend",
      headers: {
        "Content-Type": "application/json",
        Cookie: connect_sid + ";",
      },
      data: JSON.stringify({ suspend: true }),
    };

    return instance(config).then(function (response) {
      should().exist(response.data.suspendedAt);
      expect(response.status).to.equal(200);
    });
  });
  it("Unsuspend the customer", () => {
    user.email = "mocha2@test.fr";
    var config = {
      method: "post",
      url: "customer/" + userId + "/suspend",
      headers: {
        "Content-Type": "application/json",
        Cookie: connect_sid + ";",
      },
      data: JSON.stringify({ suspend: false }),
    };

    return instance(config).then(function (response) {
      should().not.exist(response.data.suspendedAt);
      expect(response.status).to.equal(200);
    });
  });
  it("Get the edited customer", () => {
    var config = {
      method: "get",
      url: "customer/" + userId,
      headers: {
        Cookie: connect_sid + ";",
      },
    };

    return instance(config).then(function (response) {
      expect(response.data.email).to.equal(user.email);
      expect(response.data.nickname).to.equal(user.nickname);
      expect(response.data.firstname).to.equal(user.firstname);
      expect(response.data.lastname).to.equal(user.lastname);
      expect(response.data.phoneNumber).to.equal(user.phoneNumber);
      expect(response.status).to.equal(200);
    });
  });
  it("Delete the registered customer", () => {
    var config = {
      method: "delete",
      url: "customer/" + userId,
      headers: {
        Cookie: connect_sid + ";",
      },
    };

    return instance(config).then(function (response) {
      expect(response.data._id).to.equal(userId);
      expect(response.data.email).to.equal(user.email);
      expect(response.data.nickname).to.equal(user.nickname);
      expect(response.data.firstname).to.equal(user.firstname);
      expect(response.data.lastname).to.equal(user.lastname);
      expect(response.data.phoneNumber).to.equal(user.phoneNumber);
      expect(response.status).to.equal(200);
    });
  });
  it("Check that customer is deleted", () => {
    var config = {
      method: "get",
      url: "customer/" + userId,
      headers: {
        Cookie: connect_sid + ";",
      },
    };

    return instance(config)
      .then(function (response) {
        expect(response.status).to.equal(404);
      })
      .catch(function (error) {
        expect(error.response.status).to.equal(404);
      });
  });
  after(() => {
    index.stop();
  });
});
