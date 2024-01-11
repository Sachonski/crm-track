import React, { useMemo } from 'react';
import { useTable, usePagination } from 'react-table';

// Replace this with your actual lead data
const leadsData = [
  { date: "01/01/2024", fullName: 'John Doe', email: 'john@example.com', phone: '123-456-7890', salesRep: 'Jane Smith', sales: 1000, originSource: "Ads", lastSource: "Funnel" },
  { date: "01/01/2024", fullName: 'John Doe', email: 'john@example.com', phone: '123-456-7890', salesRep: 'Jane Smith', sales: 1000, originSource: "Ads", lastSource: "Funnel" },
  { date: "01/01/2024", fullName: 'John Doe', email: 'john@example.com', phone: '123-456-7890', salesRep: 'Jane Smith', sales: 1000, originSource: "Ads", lastSource: "Funnel" },
  { date: "01/01/2024", fullName: 'John Doe', email: 'john@example.com', phone: '123-456-7890', salesRep: 'Jane Smith', sales: 1000, originSource: "Ads", lastSource: "Funnel" },
  { date: "01/01/2024", fullName: 'John Doe', email: 'john@example.com', phone: '123-456-7890', salesRep: 'Jane Smith', sales: 1000, originSource: "Ads", lastSource: "Funnel" },
  { date: "01/01/2024", fullName: 'John Doe', email: 'john@example.com', phone: '123-456-7890', salesRep: 'Jane Smith', sales: 1000, originSource: "Ads", lastSource: "Funnel" },
  
];

const LeadsTable = () => {
  const columns = useMemo(
    () => [
      { Header: 'Date', accessor: 'date' },
      { Header: 'Full Name', accessor: 'fullName' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Phone', accessor: 'phone' },
      { Header: 'Sales Rep', accessor: 'salesRep' },
      { Header: 'Sales', accessor: 'sales' },
      { Header: 'Origin Source', accessor: 'originSource' },
      { Header: 'Last Source', accessor: 'lastSource' },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize },
    gotoPage,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
  } = useTable(
    {
      columns,
      data: leadsData,
      initialState: { pageIndex: 0, pageSize: 20 },
    },
    usePagination
  );

  const handleRowClick = (row) => {
    // Handle row click, for example, you can redirect to a details page
    console.log('Row clicked:', row.original);
  };

  return (
    <div>
      <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #525F7F' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onClick={() => handleRowClick(row)}
                style={{
                  borderBottom: '1px solid #525F7F',
                  transition: 'background 0.3s', // Add smooth transition effect
                  ':hover': { background: '#27293D' }, // Change this to your desired hover color
                }}
              >
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} style={{ padding: '8px', borderRight: '1px solid #525F7F' }}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <div>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {Math.ceil(leadsData.length / pageSize)}
          </strong>{' '}
        </span>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} style={{ ...paginationButtonStyle }}>
          {'<<'}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage} style={{ ...paginationButtonStyle }}>
          Previous
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage} style={{ ...paginationButtonStyle }}>
          Next
        </button>
        <button onClick={() => gotoPage(Math.ceil(leadsData.length / pageSize) - 1)} disabled={!canNextPage} style={{ ...paginationButtonStyle }}>
          {'>>'}
        </button>
      </div>
    </div>
  );
};

const paginationButtonStyle = {
  border: '1px solid #525F7F',
  background: 'transparent',
  color: '#525F7F',
  padding: '8px 16px',
  margin: '0 4px 4px 4px',
  cursor: 'pointer',
};

export default LeadsTable;
