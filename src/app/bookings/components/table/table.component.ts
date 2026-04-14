import { Component, computed, input, output, signal } from '@angular/core';
import { Table } from '../../interfaces/table.interface';

@Component({
  selector: 'booking-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  public tables = input.required<Table[]>();
  public selectedTable = output<number>();

  selectedTableNumber = signal(0);

  protected readonly minInlinePosition = computed(() => {
    const tables = this.tables();

    return tables.length ? Math.min(...tables.map((table) => table.inlinePosition)) : 1;
  });

  protected readonly maxInlinePosition = computed(() => {
    const tables = this.tables();

    return tables.length ? Math.max(...tables.map((table) => table.inlinePosition)) : 1;
  });

  protected readonly minBlockPosition = computed(() => {
    const tables = this.tables();

    return tables.length ? Math.min(...tables.map((table) => table.blockPosition)) : 1;
  });

  protected readonly maxBlockPosition = computed(() => {
    const tables = this.tables();

    return tables.length ? Math.max(...tables.map((table) => table.blockPosition)) : 1;
  });

  protected readonly inlineTrackCount = computed(
    () => this.maxInlinePosition() - this.minInlinePosition() + 1,
  );

  protected readonly blockTrackCount = computed(
    () => this.maxBlockPosition() - this.minBlockPosition() + 1,
  );

  protected getInlineTrack(table: Table): number {
    return table.inlinePosition - this.minInlinePosition() + 1;
  }

  protected getBlockTrack(table: Table): number {
    return table.blockPosition - this.minBlockPosition() + 1;
  }

  protected onTableClick(table: Table): void {
    this.selectedTableNumber.set(table.number);
    this.selectedTable.emit(table.number);
  }
}
