
import { AbilityBuilder,createAliasResolver , Ability, buildMongoQueryMatcher, subject, MongoQuery } from '@casl/ability';
import { builtinModules } from 'module';
import { isErrored } from 'stream';
import { SQLRes } from './DBConnector/SQLConnector';
import * as Models from './Models'
import { $nor } from 'sift'
import * as SQL from "./DBConnector/SQLConnector"
import { restaurant } from './PlaceHolders';

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
    can('read', ['customer','restaurant','restaurantmenu','restaurantitem','deliverer']);
    can('manage', 'customer', {customerId:user._id})
    can('read', 'customerhistory' ,{customerId:user._id})
    can('create', 'customer', {typeUser: Models.UserType.Customer })
    can('manage', 'account', { userId: user.userId });
    can('create', 'order', {customerId : user._id , status:null}).because("customers can only create a command for themselves without a status ('status'=null)" );
    can('delete', 'order', { customerId: user._id, status:null }).because("customers can only delete theirs own commands if status = null");
    can('pay', 'order', { customerId: user._id,status: undefined });
    can('read', 'order', { customerId: user._id });
 
    return rules;

}

function GetRestaurateurAbilities(user) {
    const { can, cannot, rules } = new AbilityBuilder(Ability);
    can('read', ['customer','restaurant','restaurantmenu', 'restaurantitem','deliverer']);
    can ('read', 'restaurantstats', {restaurantId : user._id });
    can('manage', 'restaurantitem', {restaurantId:user._id});
    can('manage', 'restaurantmenu', {restaurantId:user._id})
    can('manage', 'account', { userId: user._id });
    can('manage', 'restaurant', { userId: user._id });
    can('manage', 'menu', { restaurantId: user._id });
    can('read', 'order', { restaurantId: user._id });
    can('accept', 'order', { OrderStatus: Models.OrderStatus.Payed, restaurantId: user._id });
    return rules;
}
function GetDelivererAbilities(user) {
    const { can, cannot, rules } = new AbilityBuilder(Ability);
    can('do', 'better hoola-hoop');
    can('read', 'delivererhistory', {idDeliverer:user._id})
    can('manage', 'account', { userId: user._id });
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
    can('create', 'account', {typeUser: Models.UserType.Customer }),
    can('read', 'account')
    return rules;
}

export function subjects (s:string):Function{
    console.log(s)
    return subject.bind(null, s);
}


