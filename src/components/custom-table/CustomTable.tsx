import { FC, ReactElement } from "react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

export interface TableColumn {
    id: string;
    label: string;
    type: string;
    key?: string;
}

export interface TableConfig {
    dataKey: string;
    columns: TableColumn[];
    data: any[];
    onActionBtnClick?: (column: TableColumn, row: any) => void;
}

export const CustomTable: FC<{config: TableConfig}> = ({config}): ReactElement => {

    const getTableCell = (column: any, row: any) => {
        if (column.type === 'text') {
            return row[column.key];
        }
        return <Button key={`button${row[config.dataKey]}`} variant="outlined" color="primary" onClick={() => config.onActionBtnClick(column, row)}>{column.label}</Button>
    };

    return (
            <TableContainer component={Paper} className="mt-20">
                <Table>
                    <TableHead>
                        <TableRow>
                        {
                            config.columns.map((c: any, index: number) => (
                                <TableCell key={c.id}>{c.label}</TableCell>
                            ))
                        }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {config.data.map((r) => (
                            <TableRow key={r[config.dataKey]}>
                            {config.columns.map((c)=> (
                                <TableCell key={c.id}>
                                    {getTableCell(c, r)}
                                </TableCell>
                            ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
    );

};