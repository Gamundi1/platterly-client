import {
  Component,
  computed,
  input,
  OnChanges,
  output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faKitchenSet, faToilet, faUser } from '@fortawesome/free-solid-svg-icons';
import { Table } from '../../interfaces/table.interface';

@Component({
  selector: 'booking-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [FaIconComponent],
})
export class TableComponent implements OnChanges {
  public tables = input.required<Table[]>();
  public guests = input.required<number>();
  public selectedHour = input.required<string>();
  public selectedTable = output<number>();

  currentSelectedTable = signal<Table | null>(null);

  protected faToilet = faToilet;
  protected faKitchen = faKitchenSet;
  protected faUser = faUser;

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

  protected isTableAvailable(table: Table): boolean {
    return table.capacity >= this.guests() && table.availableHours.includes(this.selectedHour());
  }

  protected onTableClick(table: Table): void {
    this.currentSelectedTable.set(table);
    this.selectedTable.emit(table.number);
  }

  ngOnChanges(): void {
    if (this.currentSelectedTable() && !this.isTableAvailable(this.currentSelectedTable()!)) {
      this.currentSelectedTable.set(null);
      this.selectedTable.emit(0);
    }
  }
}
