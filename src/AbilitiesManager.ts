
import { AbilityBuilder, Ability, buildMongoQueryMatcher } from '@casl/ability';
import { builtinModules } from 'module';
import { isErrored } from 'stream';
import { SQLRes } from './DBConnector/SQLConnector';
import * as Models from './Models'
import * as SQL from "./DBConnector/SQLConnector"

export function GetRulesFor(user) {
    return (abilities[user.typeUser](user));
}

export const abilities: { [K: string]: Function } = {
    customer: GetCustomerAbilities,
    deliverer: GetDelivererAbilities,
    restaurant: GetRestaurateurAbilities,
    developper: GetDevelopperAbilities,
    commercial: GetComemrcialAbilities,
    technician: GetTechnicianAbilities,
    admin: GetAdminAbilities,
    guest: GetGuestAbilities
}


function GetCustomerAbilities(user) {
    const { can, cannot, rules } = new AbilityBuilder(Ability);
    can('read', 'account');
    can('manage', 'account', { userId: user.id });
    can('create', 'order');
    can('delete', 'order', { customerId: user.id, status: undefined });
    can('pay', 'order', { customerId: user.id });
    can('read', 'orderHistory', { customerId: user.id });
    can('read', 'orderDeliveryStatus', { customerId: user.id });
    can('create', 'sponsorLink', { idOwner: user.id, type: user.type });
    return rules;

}

function GetRestaurateurAbilities(user) {
    const { can, cannot, rules } = new AbilityBuilder(Ability);
    can('manage', 'account', { idOwner: user.id });
    can('manage', 'restaurant', { userId: user.id });
    can('manage', 'articles', { restaurantId: user.idRestaurant });
    can('manage', 'menu', { restaurantId: user.idRestaurant });
    can('read', 'order', { restaurantId: user.idRestaurant });
    can('accept', 'order', { OrderStatus: Models.OrderStatus.Payed, restaurantId: user.idRestaurant });
    can('read', 'orderDeliveryStatus', { restaurantId: user.idRestaurant });
    can('read', 'orderHistory', { restaurantId: user.idRestaurant });
    can('read', 'restaurantStatistics', { restaurantId: user.idRestaurant });
    can('create', 'sponsorLink', { idOwner: user.id, type: user.type });
    return rules;
}
function GetDelivererAbilities(user) {
    const { can, cannot, rules } = new AbilityBuilder(Ability);
    can('do', 'better hoola-hoop');
    can('manage', 'account', { idOwner: user.id });
    can('accept', 'orders', { OrderStatus: Models.OrderStatus.Done });
    can('deliver', 'order', { OrderStatus: Models.OrderStatus.InDelivery, idDeliverer: user.id });
    can('create', 'sponsorLink', { idOwner: user.id, type: user.type });
    return rules;
}

function GetDevelopperAbilities(user) {
    const { can, cannot, rules } = new AbilityBuilder(Ability);
    can('manage', 'account', { idOwner: user.id });
    can('update', 'component');
    can('download', 'component');
    return rules;
}
function GetComemrcialAbilities(user) {
    const { can, cannot, rules } = new AbilityBuilder(Ability);
    can('manage', 'account');
    can('read', 'statistics');
    return rules;
}

function GetTechnicianAbilities(user) {
    const { can, cannot, rules } = new AbilityBuilder(Ability);
    can('manage', 'account', { idOwner: user.id });
    can('read', 'connectionLogs');
    can('read', 'serverPerformanceStats');
    can('read', 'componentDownloadsLogs');
    return rules;
}
function GetAdminAbilities(user) {
    const { can, cannot, rules } = new AbilityBuilder(Ability);
    can('manage', 'all');

    return rules;
}


function GetGuestAbilities() {
    const { can, cannot, rules } = new AbilityBuilder(Ability);
    can('create', 'customer')
    return rules;
}
