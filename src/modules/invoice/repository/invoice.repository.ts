import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../domain/invoice";
import { InvoiceItems } from "../domain/invoice-items";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";
import { Sequelize } from 'sequelize-typescript';

export default class InvoiceRepository implements InvoiceGateway {

  async find(id: string): Promise<Invoice> {

    const invoice = await InvoiceModel.findOne({
      where: { id: id },
      include: [{ model: InvoiceItemModel }],
    });

    if (!invoice) throw new Error("Invoice not found");



    const items = invoice.items.map((item) => (
      new InvoiceItems({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
      })
    ));

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
      items: items,
      createdAt: invoice.createdAt,
      updatedAt: invoice.createdAt
    })
  }

  async process(input: Invoice): Promise<void> {

    try{
      const invoice = await InvoiceModel.create({
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

      if(invoice === null) throw new Error("Invoice not created");
  
      const itemsData = input.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        invoiceId: input.id.id,
      }));
  
      await InvoiceItemModel.bulkCreate(itemsData);

    } catch (error) {
      throw error;
    }
  }
}