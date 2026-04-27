import React, { ReactNode } from "react";
import { MdInbox } from "react-icons/md";
import "../../assets/styles/ui-table.css";

export interface DataColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataColumn<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string | number;
  emptyText?: string;
}

const DataTable = <T,>({
  columns,
  rows,
  rowKey,
  emptyText = "Không có dữ liệu."
}: DataTableProps<T>) => {
  return (
    <div className="ui-table-wrap">
      <table className="ui-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="ui-table-empty">
                <div className="ui-table-empty-state">
                  {React.createElement(MdInbox as any, { size: 44 })}
                  <span>{emptyText}</span>
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={rowKey(row, index)}>
                {columns.map((column) => (
                  <td key={`${column.key}-${index}`}>{column.render(row)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
