import React, { useMemo, useState } from "react";
import { useTable, usePagination } from "react-table";

// Replace this with your actual lead data
const leadsData = [
  {
    date: "01/01/2024",
    fullName: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    salesRep: "Jane Smith",
    sales: 1000,
    originSource: "Ads",
    lastSource: "Funnel",
  },
  {
    date: "01/01/2024",
    fullName: "John Doe 1",
    email: "john@example.com",
    phone: "123-456-7890",
    salesRep: "Jane Smith",
    sales: 1000,
    originSource: "Ads",
    lastSource: "Funnel",
  },
  {
    date: "01/01/2024",
    fullName: "John Doe 2",
    email: "john@example.com",
    phone: "123-456-7890",
    salesRep: "Jane Smith",
    sales: 1000,
    originSource: "Ads",
    lastSource: "Funnel",
  },
  {
    date: "01/01/2024",
    fullName: "John Doe 3",
    email: "john@example.com",
    phone: "123-456-7890",
    salesRep: "Jane Smith",
    sales: 1000,
    originSource: "Ads",
    lastSource: "Funnel",
  },
  {
    date: "01/01/2024",
    fullName: "John Doe 4",
    email: "john@example.com",
    phone: "123-456-7890",
    salesRep: "Jane Smith",
    sales: 1000,
    originSource: "Ads",
    lastSource: "Funnel",
  },
  {
    date: "01/01/2024",
    fullName: "John Doe 5",
    email: "john@example.com",
    phone: "123-456-7890",
    salesRep: "Jane Smith",
    sales: 1000,
    originSource: "Ads",
    lastSource: "Funnel",
  },
];

const LeadsTable = (props) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
console.log(props)
  const columns = useMemo(
    () => [
      { Header: "Date", accessor: "created_date" },
      { Header: "Full Name", accessor: "full_name" },
      { Header: "Email", accessor: "email" },
      { Header: "Phone", accessor: "phone" },
      { Header: "Sales Rep", accessor: "sales_rep" },
      { Header: "Sales", accessor: "sales" },
      { Header: "Origin Source", accessor: "utm_source" },
      { Header: "Last Source", accessor: "lastSource" },
      // Add a column for the View More label

      // Add a column for the +Info button
      {
        Header: "Details",
        accessor: "+ info",
        Cell: ({ row }) => (
          <button
            onClick={() => handleInfoClick(row.original)}
            style={{
              border: "1px solid #525F7F",
              background: "transparent",
              color: "#525F7F",
              padding: "0 4px 0px 4px",
              cursor: "pointer",
            }}
          >
            +Info
          </button>
        ),
      },
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
      data: props.dataList? props.dataList : [],
      initialState: { pageIndex: 0, pageSize: 20 },
    },
    usePagination
  );

  const handleRowClick = (row) => {
    // Handle row click, for example, you can redirect to a details page
    console.log("Row clicked:", row.original);
  };

  const handleViewMoreClick = () => {
    // Handle View More button click, for example, you can implement the logic for the button
    console.log("View More button clicked");
  };

  const handleInfoClick = (lead) => {
    // Handle +Info button click
    setSelectedLead(lead);
    setPopupVisible(true);
  };

  return (
    <div>
      {popupVisible && (
        <div className="popup">
          <div className="popup-content">
            <button
              onClick={() => setPopupVisible(false)}
              style={{
                border: "1px solid #525F7F",
                background: "transparent",
                color: "#525F7F",
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
            <h3>Journey details for {selectedLead.full_name}</h3>
            {/* la journey va aca */}
          </div>
        </div>
      )}
      <br />

      <table
        {...getTableProps()}
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #525F7F",
        }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onClick={() => handleRowClick(row)}
                style={{
                  borderBottom: "1px solid #525F7F",
                  transition: "background 0.3s", // Add smooth transition effect
                  ":hover": { background: "#27293D" }, // Change this to your desired hover color
                }}
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    style={{ padding: "8px", borderRight: "1px solid #525F7F" }}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {Math.ceil(props.dataList.length / pageSize)}
          </strong>{" "}
        </span>
        <button
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          style={{ ...paginationButtonStyle }}
        >
          {"<<"}
        </button>
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          style={{ ...paginationButtonStyle }}
        >
          Previous
        </button>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          style={{ ...paginationButtonStyle }}
        >
          Next
        </button>
        <button
          onClick={() => gotoPage(Math.ceil(props.dataList.length / pageSize) - 1)}
          disabled={!canNextPage}
          style={{ ...paginationButtonStyle }}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
};

const paginationButtonStyle = {
  border: "1px solid #525F7F",
  background: "transparent",
  color: "#525F7F",
  padding: "8px 16px",
  margin: "16px 4px 16px 4px",
  cursor: "pointer",
};

export default LeadsTable;