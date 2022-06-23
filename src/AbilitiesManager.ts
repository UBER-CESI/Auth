
import { AbilityBuilder, Ability, buildMongoQueryMatcher, subject, MongoQuery } from '@casl/ability';
import { builtinModules } from 'module';
import { isErrored } from 'stream';
import { SQLRes } from './DBConnector/SQLConnector';
import * as Models from './Models'
import { $nor } from 'sift'
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
    can('create', 'account', {typeUser: Models.UserType.Customer })
    can('manage', 'account', { userId: user.userId });
    can('create', 'order', {customerId : user._id});
    can('delete', 'order', { customerId: user._id, status: undefined });
    can('pay', 'order', { customerId: user._id });
    can('read', 'order', { customerId: user._id });
    return rules;

}

function GetRestaurateurAbilities(user) {
    const { can, cannot, rules } = new AbilityBuilder(Ability);
    can('manage', 'account', { userId: user.userId });
    can('manage', 'restaurant', { userId: user._id });
    can('manage', 'article', { restaurantId: user._id });
    can('manage', 'menu', { restaurantId: user._id });
    can('read', 'order', { restaurantId: user._id });
    can('accept', 'order', { OrderStatus: Models.OrderStatus.Payed, restaurantId: user._id });
    return rules;
}
function GetDelivererAbilities(user) {
    const { can, cannot, rules } = new AbilityBuilder(Ability);
    can('do', 'better hoola-hoop');
    can('manage', 'account', { userId: user.userId });
    can('accept', 'order', { OrderStatus: Models.OrderStatus.Done });
    can('deliver', 'order', { OrderStatus: Models.OrderStatus.InDelivery, idDeliverer: user.userId });
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
    can('manage', 'account', {typeUser: Models.UserType.Customer })
    return rules;
}
export const subjects: { [K: string]: Function } = {
    account:subject.bind(null, 'account'),
    order:subject.bind(null, 'order'),
    menu:subject.bind(null,'menu'),
    article:subject.bind(null, 'article'),
    restaurant:subject.bind(null, 'restaurant')
}

