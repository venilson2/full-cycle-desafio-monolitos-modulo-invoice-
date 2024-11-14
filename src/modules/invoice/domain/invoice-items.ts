import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";


type InvoiceItemsProps = {
  id?: Id;
  name: string;
  price: number;
}

export class InvoiceItems extends BaseEntity {
  private _name: string;
  private _price: number;

  constructor(props: InvoiceItemsProps) {
    super();
    this._name = props.name;
    this._price = props.price;
    this.validate();
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  validate(): void {
    if (this._price <= 0) {
      throw new Error("price must be greater than 0");
    }
  }
}