import cors from "cors";
import { Ability, AbilityBuilder } from "@casl/ability";
import express from "express";
const defineAbility = (user = {}) => {
    const { can, cannot, build } = new AbilityBuilder(Ability);

    can('Get', 'Bonbon');
    return build();
}
const ability = defineAbility();
const app = express();
app.use(express.json());
app.use(cors());
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.get("/", (req, res) => {

    var response = "bonjour pd! ";
    if (ability.can("Get", "Bonbon")) {
        response += "Tiens un bonbon"
    } else {
        response += "T'es moche. Pas de bonbons pour toi"
    }
    res.send(response);
    console.log("new connection");
}
);
app.get("/Login", (req, res) => {

    res.render('Login.ejs');
})
app.post("/Login", (req, res) => {

    res.send(req.body.name);
});

app.listen(8080, () =>
    console.log("Server listening on http://localhost:8080")

);