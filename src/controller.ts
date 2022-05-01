import e, { Request, response, Response } from 'express';
import fs from 'fs/promises';
import { User } from '../public/user';
import { pool } from './queries.js';

class controller {

    public async getAll(req: Request, res: Response) {
        pool.query(`select pusers.id,firstname,middlename,lastname,email,phone,roleuser.name as role,customer.name as customer,pusers.address from pusers left join customer on pusers.customerid=customer.customerid left join roleuser on pusers.role=roleuser.name ORDER BY id ASC`, (error: any, result: any) => {
            if (error) {
                throw error;

            }

            else {
                res.status(200).json(result.rows);
            }
        }
        );

    }

    public async getUserById(req: Request, res: Response) {
        const id = Number(req.params.id);
        pool.query('select pusers.customerid,id,firstname,middlename,lastname,email,phone,roleuser.name as role,customer.name as customer,pusers.address from pusers left join customer on pusers.customerid=customer.customerid left join roleuser on pusers.role=roleuser.name WHERE id = $1', [id], (error, result) => {
            if (error) {
                res.status(404).send("You have entered wrong id");
            }
            else {
                res.status(200).json(result.rows);
                console.log(result.rows);
            }
        }
        );
    }
    public async createUser(req: Request, res: Response) {
        const { customerid, id, firstname, middlename, lastname, email, phone, role, customername, address } = req.body;
        pool.query('INSERT INTO pusers(customerid,id,firstname,middlename,lastname,email,phone,role,customername,address) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
            [customerid, id, firstname, middlename, lastname, email, phone, role, customername, address], (err, result) => {
                if (err) {
                    throw err;
                }
                else {
                    res.status(200).send("User added successfully");
                }
            }
        );

    }
    public async updateUser(req: Request, res: Response) {

        const idV = Number(req.params.id);
        const { customerid, firstname, middlename, lastname, email, phone, role, customername, address, id } = req.body;
        pool.query('UPDATE pusers SET customerid=$1,firstname = $2, middlename = $3, lastname = $4, email = $5, phone = $6, role = $7,customername=$8, address = $9 WHERE id = $10',
            [customerid, firstname, middlename, lastname, email, phone, role, customername, address, id], (err, result) => {
                if (err) {
                    res.status(400).send("Failed due to bad input");
                    throw err;
                }
                else {
                    res.status(200).send("Updated");
                }
            }
        );
    }
    public async deleteUser(req: Request, res: Response) {

        const id = Number(req.params.id);
        pool.query('DELETE FROM pusers WHERE id = $1', [id], (err, result) => {
            if (err) {
                throw err;
            }
            else {
                res.status(200).send("Deleted");
            }
        });

    }
    public async getCustomers(req: Request, res: Response) {
        pool.query('select * from customer', (error: any, result: any) => {
            (error: any, result: any) => {
                if (error) {
                    throw error;

                }

                else {
                    res.status(200).json(result.rows);
                }
            }
        }
        );
    }

}

export const userController = new controller();
