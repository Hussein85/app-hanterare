import { Pipe, PipeTransform } from "@angular/core";



@Pipe({
    name: "tenantFilter"
})
export class TenantFilterPipe implements PipeTransform {

    transform(items: Array<any>, filterBy:any, filterText: any): Array<any> {

        filterText = filterText.toLocaleLowerCase();

        return filterText ? items.filter((item: any) =>
            item[filterBy].toString().toLocaleLowerCase().indexOf(filterText) !== -1) : items;

    }

}
