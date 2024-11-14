import { Invoice } from "../domain/invoice";

export default interface InvoiceGateway {
  find(id: string): Promise<Invoice>;
  process(input: Invoice): Promise<Invoice>;
}
