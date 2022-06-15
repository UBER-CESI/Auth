import axios from 'axios'
import { expect } from "chai"
import routes from '../src/index'
import FormData from 'form-data';
import * as Models from "../src/Models";
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { assert } from 'console';


const FinalUser: Models.User = {
    id: "1",
    email: "FinalUser@gmail.com",
    nickname: "Marcus",
    firstname: "Marcus",
    lastname: "BELMONT",
    password: " ",
    type: Models.UserType.Customer,
    phoneNumber: "+33625456984"
};
const DelivererUser: Models.User = {
    id: "2",
    email: "Deliverer@gmail.com",
    nickname: "François",
    firstname: "François",
    lastname: "PIGNON",
    password: " ",
    type: Models.UserType.Deliverer,
    phoneNumber: "+33625456984"
}
const loginFinalUser = {
    method: "post",
    url: "http://localhost:3000/login",
    data: { email: FinalUser.email, password: FinalUser.password }
};

const loginDeliverer = {
    method: "post",
    url: "http://localhost:3000/login",
    data: { email: DelivererUser.email, password: DelivererUser.password }

};

const requestCanDoHoolaHoop = {
    method: "get",
    url: "http://localhost:3000/login/canDoHoolaHoop",

};
const requestCanDoBetterHoolaHoop = {
    method: "get",
    url: "http://localhost:3000/login/canDoBetterHoolaHoop",

};
const requestGetMyUsername = {
    method: "get",
    url: "http://localhost:3000/login/getMySessionUsername",

};




const jar = new CookieJar();
const connector = wrapper(axios.create({ jar }));


describe("Sessions", async () => {
    it("PersistentLogin", () => {
        return connector(loginFinalUser).then(function () {


            return connector(requestGetMyUsername).then((response) => {
                expect(response.data).to.equal(FinalUser.nickname);
            });

        });
    });
});

describe("Abilities", async () => {

    it('FinalUserCanDoHoolaHoop', () => {
        return connector(loginFinalUser).then(function () {


            return connector(requestCanDoHoolaHoop).then((response) => {
                expect(response.data).to.equal(true);
            });

        });
    });
    it('FinalUserCannotDobetterHoolaHoop', () => {
        return connector(loginFinalUser).then(function () {


            return connector(requestCanDoBetterHoolaHoop).then((response) => {
                expect(response.data).to.equal(false);
            });

        });
    });
    it('DelivererUserCannotDoHoolaHoop', () => {
        return connector(loginDeliverer).then(function () {

            return connector(requestCanDoHoolaHoop).then((response) => {
                expect(response.data).to.equal(false);
            });

        });
    });
    it('DelivererUserCanDoBetterHoolaHoop', () => {
        return connector(loginDeliverer).then(function () {


            return connector(requestCanDoBetterHoolaHoop).then((response) => {
                expect(response.data).to.equal(true);
            });

        });
    });
    after(() => {
        routes.stop();
    })

});

