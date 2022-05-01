var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { pool } from "./queries.js";
class customerController {
    getCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            pool.query('SELECT name FROM customer', (error, result) => {
                if (error) {
                    throw error;
                }
                else {
                    res.status(200).json(result.rows);
                }
            });
        });
    }
    getCustomerById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const customerName = req.params.name;
            pool.query('SELECT customerid FROM customer WHERE name = $1', [customerName], (err, result) => {
                if (err) {
                    throw err;
                }
                else {
                    res.status(200).send(result.rows);
                }
            });
        });
    }
    getCustomerList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            pool.query('SELECT * FROM customer', (error, result) => {
                if (error) {
                    throw error;
                }
                else {
                    res.status(200).json(result.rows);
                }
            });
        });
    }
}
export const customer = new customerController();
//# sourceMappingURL=customer.js.map