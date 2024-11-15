import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../domain/invoice";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {

  async find(id: string): Promise<Invoice> {
    
    const invoice = await InvoiceModel.findOne({ where: { id: id } })

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address(
        invoice.street,
        invoice.number,
        invoice.complement,
        invoice.city,
        invoice.state,
        invoice.zipCode,
      ),
      items: [],
      createdAt: invoice.createdAt,
      updatedAt: invoice.createdAt
    })
  }

  async process(input: Invoice): Promise<void> {

    await InvoiceModel.create({
      id: input.id.id,
      city: input.address.city,
      complement: input.address.complement,
      number: input.address.number,
      state: input.address.state,
      street: input.address.street,
      zipCode: input.address.zipCode,
      document: input.document,
      name: input.name,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });
  }
}