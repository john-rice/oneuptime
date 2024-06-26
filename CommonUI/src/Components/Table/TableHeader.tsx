import CheckboxElement from "../Checkbox/Checkbox";
import Icon, { ThickProp } from "../Icon/Icon";
import FieldType from "../Types/FieldType";
import Column from "./Types/Column";
import Columns from "./Types/Columns";
import SortOrder from "Common/Types/BaseDatabase/SortOrder";
import GenericObject from "Common/Types/GenericObject";
import IconProp from "Common/Types/Icon/IconProp";
import React, { ReactElement, useState } from "react";

export interface ComponentProps<T extends GenericObject> {
  columns: Columns<T>;
  id: string;
  onSortChanged: (sortBy: keyof T | null, sortOrder: SortOrder) => void;
  enableDragAndDrop?: undefined | boolean;
  isBulkActionsEnabled: undefined | boolean;
  onAllItemsOnThePageSelected: undefined | (() => void);
  onAllItemsDeselected: undefined | (() => void);
  hasTableItems: undefined | boolean;
  isAllItemsOnThePageSelected: undefined | boolean;
}

type TableHeaderFunction = <T extends GenericObject>(
  props: ComponentProps<T>,
) => ReactElement;

const TableHeader: TableHeaderFunction = <T extends GenericObject>(
  props: ComponentProps<T>,
): ReactElement => {
  const [currentSortColumn, setCurrentSortColumn] = useState<keyof T | null>(
    null,
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Ascending);

  const selectBulkSelectCheckbox: boolean = Boolean(
    props.isAllItemsOnThePageSelected && props.hasTableItems,
  );

  return (
    <thead className="bg-gray-50" id={props.id}>
      <tr>
        {props.enableDragAndDrop && <th></th>}
        {props.isBulkActionsEnabled && (
          <th>
            <div className="ml-5">
              <CheckboxElement
                disabled={!props.hasTableItems}
                value={selectBulkSelectCheckbox}
                onChange={(value: boolean) => {
                  if (value) {
                    if (props.onAllItemsOnThePageSelected) {
                      props.onAllItemsOnThePageSelected();
                    }
                  } else if (props.onAllItemsDeselected) {
                    props.onAllItemsDeselected();
                  }
                }}
              />
            </div>
          </th>
        )}
        {props.columns.map((column: Column<T>, i: number) => {
          const canSort: boolean = !column.disableSort && Boolean(column.key);

          return (
            <th
              key={i}
              className={`px-6 py-3 text-left text-sm font-semibold text-gray-900 ${
                canSort ? "cursor-pointer" : ""
              }`}
              onClick={() => {
                if (!column.key) {
                  return;
                }

                if (!canSort) {
                  return;
                }

                if (currentSortColumn === column.key) {
                  setSortOrder(
                    sortOrder === SortOrder.Ascending
                      ? SortOrder.Descending
                      : SortOrder.Ascending,
                  );
                } else {
                  setCurrentSortColumn(column.key);
                  setSortOrder(SortOrder.Ascending);
                }

                props.onSortChanged(currentSortColumn, sortOrder);
              }}
            >
              <div
                className={`flex ${
                  column.type === FieldType.Actions
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {column.title}
                {canSort &&
                  currentSortColumn === column.key &&
                  sortOrder === SortOrder.Ascending && (
                    <Icon
                      icon={IconProp.ChevronUp}
                      thick={ThickProp.Thick}
                      className="ml-2  p-1 flex-none rounded bg-gray-200 text-gray-500 group-hover:bg-gray-300 h-4 w-4"
                    />
                  )}
                {canSort &&
                  currentSortColumn === column.key &&
                  sortOrder === SortOrder.Descending && (
                    <Icon
                      icon={IconProp.ChevronDown}
                      thick={ThickProp.Thick}
                      className="ml-2 p-1 flex-none rounded bg-gray-200 text-gray-500 group-hover:bg-gray-300 h-4 w-4"
                    />
                  )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;
