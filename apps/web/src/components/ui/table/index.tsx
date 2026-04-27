"use client";

import React, {
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

/**
 * Base props shared across table components
 */
type BaseProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Table
 */
interface TableProps extends TableHTMLAttributes<HTMLTableElement>, BaseProps { }

const Table: React.FC<TableProps> = ({ children, className, ...rest }) => {
  return (
    <table className={`min-w-full ${className ?? ""}`} {...rest}>
      {children}
    </table>
  );
};

/**
 * Table Header (<thead>)
 */
interface TableHeaderProps
  extends HTMLAttributes<HTMLTableSectionElement>,
  BaseProps { }

const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <thead className={className} {...rest}>
      {children}
    </thead>
  );
};

/**
 * Table Body (<tbody>)
 */
interface TableBodyProps
  extends HTMLAttributes<HTMLTableSectionElement>,
  BaseProps { }

const TableBody: React.FC<TableBodyProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <tbody className={className} {...rest}>
      {children}
    </tbody>
  );
};

/**
 * Table Row (<tr>)
 */
interface TableRowProps
  extends HTMLAttributes<HTMLTableRowElement>,
  BaseProps { }

const TableRow: React.FC<TableRowProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <tr className={className} {...rest}>
      {children}
    </tr>
  );
};

/**
 * Table Cell (<td> | <th>)
 * Supports native attributes like colSpan, rowSpan, onClick, etc.
 */
type TableCellProps =
  | (BaseProps &
    TdHTMLAttributes<HTMLTableCellElement> & {
      isHeader?: false;
    })
  | (BaseProps &
    ThHTMLAttributes<HTMLTableCellElement> & {
      isHeader: true;
    });

const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
  ...rest
}) => {
  const Component = isHeader ? "th" : "td";

  return (
    <Component className={className} {...rest}>
      {children}
    </Component>
  );
};

export { Table, TableBody, TableCell, TableHeader, TableRow };
