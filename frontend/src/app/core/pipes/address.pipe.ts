import { Pipe, PipeTransform } from '@angular/core';
import { Address } from '../models/household.model';

@Pipe({
  name: 'address',
  standalone: true,
})
export class AddressPipe implements PipeTransform {
  transform(address: Address | undefined | null): string {
    if (!address) {
      return '';
    }

    const parts = [
      address.street1,
      address.street2,
      address.city,
      address.state,
      address.zip,
    ].filter((part) => part && part.trim() !== '');

    return parts.join(', ');
  }
}
