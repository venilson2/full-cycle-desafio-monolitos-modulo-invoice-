import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../../domain/invoice";
import { InvoiceItems } from "../../domain/invoice-items";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";
import { GenerateInvoiceUseCaseInputDto } from "./generate-invoice.usecase.dto";

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

const MockRepository = () => {
  return {
    process: jest.fn(),
    find: jest.fn()
  }
}

describe("Generate Invoice use case unit test", () => {

  it("should generate a Invoice", async () => {

    const repository = MockRepository()
    const usecase = new GenerateInvoiceUseCase(repository)

    const input = {
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
          name: "Item 1",
          price: 10
        },
        {
          name: "Item 2",
          price: 20
        }]
      } as GenerateInvoiceUseCaseInputDto

    const result = await usecase.execute(input)

    expect(repository.process).toHaveBeenCalled()
    expect(result.id).toBeDefined()
    expect(result.name).toEqual(input.name)
    expect(result.city).toEqual(input.city)
    expect(result.complement).toEqual(input.complement)
    expect(result.number).toEqual(input.number)
    expect(result.state).toEqual(input.state)
    expect(result.street).toEqual(input.street)
    expect(result.zipCode).toEqual(input.zipCode)
    expect(result.total).toEqual(input.items.reduce((acc, item) => acc + item.price, 0))
    expect(result.total).toEqual(30)
  })
})