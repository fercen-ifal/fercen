import type { ElectricityBill, UpdatableElectricityBill } from "entities/Electricity";

/** Interface do repositório de faturas de energia elétrica.  */
export interface IElectricityRepository {
	/**
	 * Cria uma nova fatura no banco de dados.
	 * O ``id`` é gerado automaticamente e retornado pela função.
	 *
	 * @param {(Omit<ElectricityBill, "id">)} bill Fatura.
	 *
	 * @returns {Promise<string>} ``Id`` da fatura.
	 */
	create(bill: Omit<ElectricityBill, "id">): Promise<string>;

	/**
	 * Busca uma fatura no banco de dados pelo ``id``.
	 *
	 * @param {string} id ``Id`` da fatura.
	 *
	 * @returns {(Promise<ElectricityBill | null>)} Promessa de fatura ou nulo se não encontrar.
	 */
	read(id: string): Promise<ElectricityBill | null>;

	/**
	 * Busca todas as faturas no banco de dados.
	 *
	 * @returns {Promise<ElectricityBill[]>} Promessa de uma lista de faturas.
	 */
	readAll(): Promise<ElectricityBill[]>;

	/**
	 * Busca todas as faturas no banco de dados que satisfazerem o filtro da função ``callback``.
	 *
	 * @param {Function} callback
	 *
	 * @returns {Promise<ElectricityBill[]>} Promessa de uma lista de faturas.
	 */
	customQuery(
		callback: (
			ref: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
		) => FirebaseFirestore.Query<FirebaseFirestore.DocumentData>
	): Promise<ElectricityBill[]>;

	/**
	 * Atualiza uma fatura no banco de dados.
	 *
	 * @param {string} id ``Id`` da fatura.
	 * @param {UpdatableElectricityBill} newData Objeto com os novos dados.
	 *
	 * @returns {(Promise<string | null>)} Promessa de ``id`` ou nulo se não encontrar.
	 */
	update(id: string, newData: UpdatableElectricityBill): Promise<string | null>;

	/**
	 * Deleta uma fatura do banco de dados.
	 *
	 * @param {string} id ``Id`` da fatura.
	 *
	 * @returns {(Promise<string | null>)} Promessa de ``id`` ou nulo se não encontrar.
	 */
	delete(id: string): Promise<string | null>;
}
