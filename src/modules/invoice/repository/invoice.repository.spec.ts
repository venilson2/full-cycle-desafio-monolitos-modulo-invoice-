import { Sequelize } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../domain/invoice";
import { InvoiceItems } from "../domain/invoice-items";
import { InvoiceModel } from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import { InvoiceItemModel } from "./invoice-item.model";

describe("generate Invoice use case unit test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    await sequelize.addModels([InvoiceModel, InvoiceItemModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should generate a Invoice", async () => {

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Lucian",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888",
      ),
      items: [
        new InvoiceItems({
          id: new Id("1"),
          name: "Item 1",
          price: 10
        }),
        new InvoiceItems({
          id: new Id("2"),
          name: "Item 2",
          price: 20
        })
      ],
    });

    const repository = new InvoiceRepository()

    await repository.process(invoice)
    
    const invoiceDb = await InvoiceModel.findOne({ where: { id: "1" } })

    expect(invoiceDb).toBeDefined()
    expect(invoiceDb.id).toEqual(invoice.id.id)
    expect(invoiceDb.name).toEqual(invoice.name)
    expect(invoiceDb.document).toEqual(invoice.document)
    expect(invoiceDb.street).toEqual(invoice.address.street)
    expect(invoiceDb.number).toEqual(invoice.address.number)
    expect(invoiceDb.complement).toEqual(invoice.address.complement)
    expect(invoiceDb.city).toEqual(invoice.address.city)
    expect(invoiceDb.state).toEqual(invoice.address.state)
    expect(invoiceDb.zipCode).toEqual(invoice.address.zipCode)
  })

  it("should find a Invoice", async () => {

    const invoice = await InvoiceModel.create({
      id: "1",
      city: "sao paulo",
      complement: "bloco 3",
      number: "05",
      state: "SP",
      street: "rua dolores das neves gomes",
      zipCode: "04750987",
      document: "25998874589",
      name: "Joao",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const repository = new InvoiceRepository()

    const result = await repository.find(invoice.id)

    expect(result.id.id).toEqual(invoice.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.document).toEqual(invoice.document)
    expect(result.address.street).toEqual(invoice.street)
    expect(result.address.number).toEqual(invoice.number)
    expect(result.address.complement).toEqual(invoice.complement)
    expect(result.address.city).toEqual(invoice.city)
    expect(result.address.state).toEqual(invoice.state)
    expect(result.address.zipCode).toEqual(invoice.zipCode)
    expect(result.createdAt).toStrictEqual(invoice.createdAt)
  })
})