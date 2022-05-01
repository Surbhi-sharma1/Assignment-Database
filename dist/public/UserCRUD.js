var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from "./user.js";
import { findIndexByID, getCustomer, getCustomerIdByName, getRoleKey, getRoles } from "./findOperations.js";
import { selectValue } from "./select.js";
export class UserCRUD {
    constructor() {
        this.users = [];
        this.col = [];
        this.customerLists = [];
        this.roleLists = [];
        this.tableContainer = document.querySelector('.table');
        this.myURL = `http://localhost:5000`;
        this.tableEle = document.createElement("table");
        this.AddBtn = document.createElement("button");
        this.AddBtn.classList.add("create-btn");
        this.AddBtn.addEventListener('click', () => this.addUser());
        this.addContainer = document.querySelector('.AddContainer');
        this.initialize();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const dataR = yield getRoles(this.myURL);
            this.roleLists = dataR;
            const dataL = yield getCustomer(this.myURL);
            this.customerLists = dataL;
            const response = yield fetch(this.myURL + '/users');
            const data = yield response.json();
            for (let key in data[0]) {
                if (this.col.indexOf(key) < 0 && (key !== "id")) {
                    this.col.push(key);
                }
            }
            data.forEach((ob) => {
                this.users.push(new User(ob.id, ob.firstname, ob.middlename, ob.lastname, ob.email, ob.phone, ob.role, ob.address, ob.customer));
            });
        });
    }
    load() {
        this.tableEle = document.createElement("table");
        let tr = this.tableEle.insertRow(-1);
        for (let i = 0; i < this.col.length; i++) {
            let th = tr.insertCell(i);
            th.innerHTML = this.col[i];
        }
        this.AddBtn.innerHTML = "Add User";
        this.addContainer.append(this.AddBtn);
        this.users.forEach((user) => this.loadTableContent(user));
    }
    loadTableContent(user) {
        let tr = document.createElement("tr");
        let editBtn = document.createElement("button");
        editBtn.innerHTML = "Edit";
        editBtn.addEventListener('click', () => this.update(user));
        editBtn.setAttribute('class', 'edit');
        let deleteBtn = document.createElement("button");
        deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "Delete";
        deleteBtn.addEventListener('click', () => this.delete(user));
        deleteBtn.classList.add("dlt");
        tr.innerHTML = `<td id = "fname">${user.firstname}</td>
                        <td id = "middle">${user.middlename}</td>
                        <td id = "last">${user.lastname}</td>
                        <td id = "email">${user.email}</td>
                        <td id = "phone">${user.phone}</td>
                        <td id = "role-cell">${user.role}</td>
                        <td id = "customer">${user.customer}</td>
                        <td id = "address">${user.address}</td>`;
        tr.append(editBtn);
        tr.append(deleteBtn);
        this.tableEle.append(tr);
        this.tableContainer.innerHTML = "";
        this.tableContainer.append(this.tableEle);
    }
    addUser() {
        let newRow = this.tableEle.insertRow(-1);
        newRow.contentEditable = 'true';
        for (let i = 0; i < this.col.length; i++) {
            let newCell = newRow.insertCell(0);
        }
        let roleCell = newRow.children[5];
        selectValue(this.roleLists, roleCell);
        let customerCell = newRow.children[6];
        selectValue(this.customerLists, customerCell);
        let submit = document.createElement('submit');
        submit.innerHTML = 'Submit';
        submit.classList.add('submit');
        newRow.append(submit);
        submit.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            newRow.contentEditable = 'false';
            let roleContent, customerContent;
            let selectedrole, selectedCustomer;
            for (let i = 0; i <= 2; i++) {
                let r = newRow.children[5].children[0].children[i];
                if (r.selected) {
                    selectedrole = r.textContent;
                }
            }
            for (let j = 0; j <= 2; j++) {
                let option;
                let s = newRow.children[6].children[0].children[j];
                if (option = s) {
                    selectedCustomer = option.textContent;
                }
            }
            const data1 = yield getRoleKey(this.myURL, selectedrole);
            const data = yield getCustomerIdByName(this.myURL, selectedCustomer);
            const newUser = {
                customerid: data[0].customerid,
                id: this.users.length + 1,
                firstname: newRow.children[0].textContent,
                middlename: newRow.children[1].textContent,
                lastname: newRow.children[2].textContent,
                email: newRow.children[3].textContent,
                phone: newRow.children[4].textContent,
                role: data1[0].key,
                customer: selectedCustomer,
                address: newRow.children[7].textContent
            };
            this.create(newUser);
        }));
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(user);
            const createUrl = this.myURL + '/add';
            const res = yield fetch(createUrl, {
                method: 'post',
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let getUser = yield fetch(this.myURL + '/users');
            let Data = yield getUser.json();
            let ob = Data[Data.length - 1];
            const mybody = {
                "id": ob.id,
                "firstname": ob.firstname,
                "middlename": ob.middlename,
                "lastname": ob.lastname,
                "email": ob.email,
                "phone": ob.phone,
                "role": ob.role,
                "customer": ob.customer,
                "address": ob.address
            };
            this.users.push(mybody);
            this.load();
        });
    }
    read() {
        return this.users;
    }
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let index = findIndexByID(user.id, this.users);
            let tr = this.tableEle.children[index + 1];
            let editbtn = tr.children[tr.children.length - 2];
            let dltbtn = tr.children[tr.children.length - 1];
            let cell = tr.cells.namedItem("role-cell");
            let customerCell = tr.cells.namedItem("customer");
            if (editbtn.innerHTML === "Edit") {
                tr.contentEditable = "true";
                editbtn.innerHTML = "Save";
                dltbtn.innerHTML = "Cancel";
                editbtn.contentEditable = "false";
                dltbtn.contentEditable = "false";
                let select = document.createElement("select");
                select.classList.add("select");
                select.setAttribute('id', 'select');
                selectValue(this.customerLists, customerCell);
                selectValue(this.roleLists, cell);
            }
            else {
                this.save(user);
            }
        });
    }
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let index = findIndexByID(user.id, this.users);
            let tr = this.tableEle.children[index + 1];
            let editbtn = tr.children[tr.children.length - 2];
            let dltbtn = tr.children[tr.children.length - 1];
            let fnameCell = tr.cells.namedItem("fname");
            let middlenameCell = tr.cells.namedItem("middle");
            let lastnameCell = tr.cells.namedItem("last");
            let emailCell = tr.cells.namedItem("email");
            let phoneCell = tr.cells.namedItem("phone");
            let customer = tr.cells.namedItem("customer");
            let addressCell = tr.cells.namedItem("address");
            let selectCell = tr.cells.namedItem("select");
            tr.contentEditable = "false";
            editbtn.innerHTML = "Edit";
            dltbtn.innerHTML = "Delete";
            const updateURL = this.myURL + '/update/' + `${user.id}`;
            user.firstname = fnameCell.textContent;
            user.middlename = middlenameCell.textContent;
            user.lastname = lastnameCell.textContent;
            user.email = emailCell.textContent;
            user.phone = phoneCell.textContent;
            user.address = addressCell.textContent;
            for (let i = 0; i <= 2; i++) {
                let s = tr.children[5].children[0].children[i];
                if (s.selected) {
                    user.role = s.textContent;
                }
            }
            let td = document.createElement("td");
            td.setAttribute('id', 'role-cell');
            tr.children[5].replaceWith(td);
            let roleCell = tr.cells.namedItem('role-cell');
            roleCell.innerHTML = user.role;
            const data1 = yield getRoleKey(this.myURL, user.role);
            console.log(data1);
            for (let i = 0; i <= 2; i++) {
                let optionValue = tr.children[6].children[0].children[i];
                if (optionValue.selected) {
                    user.customer = optionValue.textContent;
                }
                let td1 = document.createElement('td1');
                td1.setAttribute('id', 'customer');
                tr.children[6].append(td1);
                let customerCell = tr.children[6];
                customerCell.innerHTML = user.customer;
                const dataC = yield getCustomerIdByName(this.myURL, user.customer);
                console.log(dataC);
            }
            const mybody = {
                "id": user.id,
                "firstname": user.firstname,
                "middlename": user.middlename,
                "lastname": user.lastname,
                "email": user.email,
                "phone": user.phone,
                "role": data1[0].key,
                "customername": user.customer,
                "address": user.address
            };
            const response = yield fetch(updateURL, {
                method: 'PUT',
                body: JSON.stringify(mybody),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        });
    }
    delete(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = findIndexByID(user.id, this.users);
            let tr = this.tableEle.children[index + 1];
            let dltbtn = tr.children[tr.children.length - 1];
            if (dltbtn.innerHTML === "Delete") {
                const deleteURL = this.myURL + '/delete/' + `${user.id}`;
                const response = yield fetch(deleteURL, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });
                tr.remove();
                this.users.splice(index, 1);
                this.load();
            }
            else {
                this.cancel(user);
            }
        });
    }
    cancel(user) {
        let index = findIndexByID(user.id, this.users);
        let tr = this.tableEle.children[index + 1];
        let editbtn = tr.children[tr.children.length - 2];
        let dltbtn = tr.children[tr.children.length - 1];
        tr.contentEditable = "false";
        dltbtn.innerHTML = "Delete";
        editbtn.innerHTML = "Edit";
        this.load();
    }
    refresh() {
        this.users = [];
        this.initialize();
        this.load();
    }
}
//# sourceMappingURL=UserCRUD.js.map