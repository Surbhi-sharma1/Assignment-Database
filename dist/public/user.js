/*enum Role {
    superadmin = 'superadmin',
    admin = 'admin',
    subscriber = 'subscriber'
}*/
class User {
    constructor(id, firstname, middlename, lastname, email, phone, role, address, customer) {
        this.id = id;
        this.firstname = firstname;
        this.middlename = middlename;
        this.lastname = lastname;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.address = address;
        this.customer = customer;
    }
}
export { User };
//# sourceMappingURL=user.js.map