import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../repository/invoice.model";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import { InvoiceItemModel } from "../repository/invoice-item.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe("Invoice Facade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate a invoice", async () => {
    // const repository = new InvoiceRepository();
    // const usecase = new GenerateInvoiceUseCase(repository);

    // const facade = new InvoiceFacade({
    //   findUsecase: undefined,
    //   processUsecase: usecase,
    // });

    const facade = InvoiceFacadeFactory.create();

    const input = {
      id: "1",
      name: "Lucian",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 10
        },
        {
          id: "2",
          name: "Item 2",
          price: 20
        }]
      }

    const output = await facade.process(input);

    expect(output.id).toBeDefined();
    expect(output.name).toEqual(input.name);
    expect(output.document).toEqual(input.document);
    expect(output.street).toEqual(input.street);
    expect(output.number).toEqual(input.number);
    expect(output.complement).toEqual(input.complement);
    expect(output.city).toEqual(input.city);
    expect(output.state).toEqual(input.state);
    expect(output.total).toEqual(30);
  });


  it("should find a invoice", async () => {

    // const repository = new InvoiceRepository();
    // const usecase = new FindInvoiceUseCase(repository);

    // const facade = new InvoiceFacade({
    //   findUsecase: usecase,
    //   processUsecase: undefined,
    // });

    const facade = InvoiceFacadeFactory.create();

    const output = {
      id: "1",
      name: "Lucian",
      document: "1234-5678",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 10
        },
        {
          id: "2",
          name: "Item 2",
          price: 20
        }
      ],
      address: {
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipCode: "88888-888"
      },
      total: 30,
      createdAt: new Date()
    }

    const input = {
      id: "1"
    }

    await InvoiceModel.create({
      id: output.id,
      city: output.address.city,
      complement: output.address.complement,
      number: output.address.number,
      state: output.address.state,
      street: output.address.street,
      zipCode: output.address.zipCode,
      document: output.document,
      name: output.name,
      createdAt: output.createdAt,
      updatedAt: output.createdAt,
    });

    await InvoiceItemModel.bulkCreate(output.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      createdAt: output.createdAt,
      updatedAt: output.createdAt,
      invoiceId: output.id
    })))
      
    const result = await facade.find(input);

    expect(result.id).toBeDefined();
    expect(result.name).toEqual(output.name);
    expect(result.document).toEqual(output.document);
    expect(result.address.street).toEqual(output.address.street);
    expect(result.address.number).toEqual(output.address.number);
    expect(result.address.complement).toEqual(output.address.complement);
    expect(result.address.city).toEqual(output.address.city);
    expect(result.address.state).toEqual(output.address.state);
    expect(result.address.zipCode).toEqual(output.address.zipCode);
    expect(result.total).toEqual(output.total);
    expect(result.createdAt).toStrictEqual(output.createdAt);

  });
});
