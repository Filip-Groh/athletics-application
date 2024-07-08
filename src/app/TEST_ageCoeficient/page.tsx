"use client"

import React from 'react'
import Table from 'rc-table';
import type { TableProps } from 'rc-table';
import '~/styles/table.css';

const columns: TableProps['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 100,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 200,
    },
    {
      title: 'Operations',
      dataIndex: '',
      key: 'operations',
      render: () => <a href="#">Delete</a>,
    },
];
  
const data = [
    { name: 'Jack', age: 28, address: 'some where', key: '1' },
    { name: 'Rose', age: 36, address: 'some where', key: '2' },
];

function AgeCoeficient() {
    return (
        <>
            <Table columns={columns} data={data} />
        </>
    )
}

export default AgeCoeficient