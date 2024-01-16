import React, { useMemo, useState } from "react";
import { useTable, usePagination } from "react-table";
import 'react-datepicker/dist/react-datepicker.css';


const LeadsTable = (props) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState([]);

  async function setter(querySearch) {
    setSelectedLead(await props.fetchQuery(querySearch))
  }




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
              background: "rgba(82, 95, 127, 0.5)",
              color: "#c4c4c4",
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
    console.log("aca viene el lead")
    console.log(lead)
    const querySearch = "SELECT c.full_name AS contact_full_name, c.email AS contact_email, c.phone, c.sales_rep AS contact_sales_rep, c.fk_sorfware_id, DATE_FORMAT(c.created_date, '%Y-%m-%d %H:%i') AS contact_created_date, c.utm_source, (SELECT full_name FROM Bookings WHERE email = c.email) AS booking_full_name, (SELECT setter FROM Bookings WHERE email = c.email) AS setter, (SELECT sales_rep FROM Bookings WHERE email = c.email) AS booking_sales_rep, (SELECT created_at FROM Bookings WHERE email = c.email) AS booking_created_at, (SELECT booked_at FROM Bookings WHERE email = c.email) AS booked_at, (SELECT status FROM Bookings WHERE email = c.email) AS booking_status, (SELECT payment_amount FROM Payments WHERE fk_contact = c.id) AS payment_amount, (SELECT product_name FROM Payments WHERE fk_contact = c.id) AS product_name, (SELECT product_description FROM Payments WHERE fk_contact = c.id) AS product_description, (SELECT subscription_id FROM Payments WHERE fk_contact = c.id) AS subscription_id, (SELECT DATE_FORMAT(payment_date, '%Y-%m-%d %H:%i') FROM Payments WHERE fk_contact = c.id) AS payment_date, (SELECT software_description FROM Softwares WHERE id = c.fk_sorfware_id) AS software_description, (SELECT funnel_id FROM Softwares WHERE id = c.fk_sorfware_id) AS funnel_id, (SELECT step_id FROM Softwares WHERE id = c.fk_sorfware_id) AS step_id, (SELECT funnel_name FROM Softwares WHERE id = c.fk_sorfware_id) AS funnel_name, (SELECT step_name FROM Softwares WHERE id = c.fk_sorfware_id) AS step_name FROM Contacts c WHERE c.email = '" + lead.email + "'"
    setter(querySearch).then(
      setPopupVisible(true)
      
    ).then(
      function(){
        console.log("aca viene el selectedLead")
        console.log(selectedLead)
      }

    )
    
    //setSelectedLead(lead);
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
                background: "rgba(82, 95, 127, 0.5)",
                color: "#c4c4c4",
                padding: "8px 16px",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              Close
            </button>
            
            <h3>Journey details for {selectedLead[0]? selectedLead[0].contact_full_name : ""}</h3>
            {selectedLead.map(lead =>{
              switch(true){
                case lead.payment_amount != null:
                 return <h3>{lead.payment_date} Payment: Amount ${lead.payment_amount} Product: {lead.product_name}  Funnel: {lead.funnel_name} || {lead.step_name}</h3> 
                  
                case lead.funnel_name != null && lead.payment_amount == null:
                  return <h3>{lead.contact_created_date} Funnel: {lead.funnel_name} || {lead.step_name}</h3> 
                
                  default:
                    break
              }
            }
          )}
            
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
                    style={{ padding: "8px", borderRight: "1px solid #525F7F", color: "#c4c4c4"}}
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
  background: "rgba(82, 95, 127, 0.5)",
  color: "#c4c4c4",
  padding: "8px 16px",
  margin: "16px 4px 16px 4px",
  cursor: "pointer",
  borderRadius: "4px",
};

export default LeadsTable;