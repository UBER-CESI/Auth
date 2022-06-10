import axios from 'axios'
import { expect } from "chai"
import routes from '../src/index'
import FormData from 'form-data';




describe("testConnectionSession", () => {
    var user = {

        name: "mocha",
        password: "test",

    };
    const formData = new FormData();

    formData.append('name', user.name)
    formData.append('password', user.password)
    const config1 = {
        method: "post",
        url: "http://localhost:3000/login",
        headers: {
            "Content-Type": "application/json",
        },
        data: formData
    };

    const config2 = {
        method: "get",
        url: "http://localhost:3000/login/getMySessionUsername",
        headers: {
            "Content-Type": "application/json",
        },

    };
    it("Logging", async () => {

        return axios(config1).then(() => {
            axios(config2).then((response) => {
                expect(response.data).to.equal(user.name);
            });
        });
    });
    it("GetSessionNameWoConnection", async () => {

        return axios(config2).then((response) => {
            expect(response.data).to.equal('notConnected');
        })
    });

    after(() => {
        routes.stop()
    });
});
