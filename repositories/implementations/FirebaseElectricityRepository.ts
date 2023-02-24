import retry from "async-retry";
import type { ElectricityBill, UpdatableElectricityBill } from "entities/Electricity";
import { InternalServerError } from "errors/index";
import { firestore } from "models/database";
import type { IElectricityRepository } from "repositories/IElectricityRepository";
import { v4 as uuid } from "uuid";

/**
 * Classe que implementa o repositório de faturas de energia do Firestore.
 *
 * @class FirebaseElectricityRepository
 * @typedef {FirebaseElectricityRepository}
 * @implements {IElectricityRepository}
 */
export class FirebaseElectricityRepository implements IElectricityRepository {
	private readonly col: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
	private readonly retryOpts: retry.Options;

	constructor() {
		this.col = firestore.collection("electricity");
		this.retryOpts = { retries: 3, minTimeout: 100, maxTimeout: 200 };
	}

	async create(bill: Omit<ElectricityBill, "id">): Promise<string> {
		return await retry(async () => {
			try {
				const databaseBill: ElectricityBill = {
					id: uuid(),
					...bill,
				};
				this.col.doc(databaseBill.id).create(databaseBill);

				return databaseBill.id;
			} catch (err) {
				throw new InternalServerError({
					message: "Houve um erro ao tentar criar sua fatura.",
					errorLocationCode: "REPOS:ELECTRICITY:CREATE_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}

	async read(id: string): Promise<ElectricityBill | null> {
		return await retry(async () => {
			try {
				const bill = await this.col.doc(id).get();
				const billData = bill.data() as ElectricityBill | undefined;
				if (!bill.exists || !billData) return null;

				return billData;
			} catch (err) {
				throw new InternalServerError({
					message: "Houve um erro ao tentar ler a fatura.",
					errorLocationCode: "REPOS:ELECTRICITY:READ_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}

	async readAll(): Promise<ElectricityBill[]> {
		try {
			let bills: ElectricityBill[] = [];
			const databaseBills = await this.col.get();

			for (const bill of databaseBills.docs) {
				const data = bill.data() as ElectricityBill | undefined;
				if (!data) continue;
				bills.push(data);
			}

			return bills;
		} catch (err) {
			throw new InternalServerError({
				message: "Não foi possível ler todos as faturas.",
				errorLocationCode: "REPOS:ELECTRICITY:READALL_FAILURE",
				stack: new Error().stack,
			});
		}
	}

	async customQuery(
		callback: (
			ref: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
		) => FirebaseFirestore.Query<FirebaseFirestore.DocumentData>
	): Promise<ElectricityBill[]> {
		try {
			let bills: ElectricityBill[] = [];
			const query = await callback(this.col).get();

			for (const bill of query.docs) {
				const data = bill.data() as ElectricityBill | undefined;
				if (!data) continue;
				bills.push(data);
			}

			return bills;
		} catch (err) {
			throw new InternalServerError({
				message: "Não foi possível executar a query personalizada.",
				errorLocationCode: "REPOS:ELECTRICITY:CUSTOMQUERY_FAILURE",
				stack: new Error().stack,
			});
		}
	}

	async update(id: string, newData: UpdatableElectricityBill): Promise<string | null> {
		return await retry(async () => {
			try {
				await this.col.doc(id).update({ ...newData });
				return id;
			} catch (err) {
				throw new InternalServerError({
					message: "Houve um erro ao tentar atualizar a fatura.",
					errorLocationCode: "REPOS:ELECTRICITY:UPDATE_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}

	async delete(id: string): Promise<string | null> {
		return await retry(async () => {
			try {
				await this.col.doc(id).delete();
				return id;
			} catch (err) {
				throw new InternalServerError({
					message: "Houve um erro ao tentar deletar a fatura.",
					errorLocationCode: "REPOS:ELECTRICITY:DELETE_FAILURE",
					stack: new Error().stack,
				});
			}
		}, this.retryOpts);
	}
}
