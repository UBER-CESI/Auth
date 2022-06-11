import { Ability, ExtractSubjectType, MongoQuery, Subject, SubjectRawRule } from "@casl/ability"
import { AnyObject } from "@casl/ability/dist/types/types";
import { Console } from "console";
import { userInfo } from "os"



export interface Account {
    id: number,
    idOwner: number
}
export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    type: UserType;
}
export enum UserType {
    FinalUser = "FinalUser",
    Deliverer = "Deliverer",
    Restaurateur = "Restaurateur",
    Developper = "Developper",
    Commercial = "Commercial",
    Technician = "Technician"
}

export interface Order {
    id: number,
    idOwner: number,
    idRestaurant: number,
    idDeliverer: number,
    status: OrderStatus

}
export enum OrderStatus {
    Payed = "Payed",
    Making = "Making",
    Done = "Done",
    InDelivery = "InDelivery",
    Delivered = "Delivered",
}

export interface OrderArticles {
    idArticle: number,
    idOrder: Number
}
export interface Article {
    id: number,
    idRestaurant: number,
    name: string,
    price: number,
    type: ArticleType
}
export enum ArticleType {
    Dish = "Dish",
    Drink = "Drink",
    Sauce = "Sauce",
    SideDish = "SideDish"
}
export interface ArticleMenu {
    idArticle: number,
    idMenu: number
}
export interface menuOrder {

    idOrder: number,
    idMenu: number
}
export interface Menu {
    id: number,
    idRestaurant: number,
    name: string,
    price: number,
}
export interface Restaurants {
    id: number,
    name: string,
}







