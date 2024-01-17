import React, { useEffect, useMemo, useState } from "react";
import { useTable, usePagination } from "react-table";
import "react-datepicker/dist/react-datepicker.css";

const LeadsTable = (props) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState([]);
  const [selectedLeadName, setSelectedLeadName] = useState({full_name:""})


  async function setter(lead) {
    const bookingQuery = `SELECT *,'booking' AS type,DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') as f_created_date,DATE_FORMAT(booked_at, '%Y-%m-%d %H:%i') as booked_at FROM Bookings WHERE Email = '${lead.email}' AND Status != 'canceled'`;
    const contactQuery = `SELECT DISTINCT Contacts.*, 'contact' AS type, DATE_FORMAT(Contacts.created_date, '%Y-%m-%d %H:%i') AS f_created_date, Softwares.* FROM Contacts LEFT JOIN Payments ON Contacts.id = Payments.fk_contact LEFT JOIN Softwares ON Contacts.fk_sorfware_id = Softwares.id WHERE Contacts.email = '${lead.email}' AND Payments.fk_contact IS NULL AND Contacts.fk_sorfware_id IS NOT NULL AND Contacts.fk_bookings IS NULL GROUP BY Contacts.created_date, Contacts.fk_sorfware_id;`;
    const paymentQuery = `SELECT Payments.*,'payment' AS type,COALESCE(DATE_FORMAT(Payments.first_payment_date, '%Y-%m-%d %H:%i'), DATE_FORMAT(Payments.payment_date, '%Y-%m-%d %H:%i')) AS f_created_date, Softwares.funnel_id, Softwares.step_id, Softwares.funnel_name, Softwares.step_name FROM Payments INNER JOIN Contacts ON Payments.fk_contact = Contacts.id LEFT JOIN Softwares ON Payments.fk_software = Softwares.id WHERE Contacts.email = '${lead.email}'`;
  
    const response = await Promise.all([
      props.fetchQuery(bookingQuery),
      props.fetchQuery(contactQuery),
      props.fetchQuery(paymentQuery)
    ]);
  
    const responseConType = response.flatMap((results, index) => {
      const type = index === 0 ? 'booking' : index === 1 ? 'contact' : 'payment';
      return results.map(obj => ({ ...obj, type }));
    });
  
    // Ordenar por la propiedad f_created_date
    const newData = responseConType.sort(
      (a, b) => new Date(a.f_created_date) - new Date(b.f_created_date)
    );
    setSelectedLead(newData);
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
      data: props.dataList ? props.dataList : [],
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
    setSelectedLeadName(prev =>{
      if(prev.contact_id !== lead.contact_id){
        setSelectedLead([])
        setter(lead)
        .then(setPopupVisible(true))
      }
      return lead
    })

      

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

            <h3>
              Journey details for{" "}
              {selectedLeadName.full_name}
            </h3>
            {selectedLead.map((lead) => {
              switch (lead.type) {
                case "payment":
                  return (
                    <h3
                      style={{
                        color: "green",
                        textTransform: "capitalize",
                        fontSize: "13px",
                        marginLeft: "20px",
                        marginBottom: "3px",
                      }}
                    >
                      • {lead.f_created_date} | <b>Payment:</b> ${lead.payment_amount} |
                      <b> Product:</b> {lead.product_name} | <b>Funnel:</b> {lead.funnel_name} |
                      <b> Step:</b> {lead.step_name}
                    </h3>
                  );
                  break;
                case "contact":
                  return (
                    <h3
                      style={{
                        textTransform: "capitalize",
                        fontSize: "13px",
                        marginLeft: "20px",
                        marginBottom: "3px",
                      }}
                    >
                      • {lead.f_created_date} | <b>Funnel:</b> {lead.funnel_name}{" "}
                      | <b>Step:</b> {lead.step_name}
                    </h3>
                  );
                  break;
                case "booking":

                  return (
                    <h3
                      style={{
                        color: "orange",
                        textTransform: "capitalize",
                        fontSize: "13px",
                        marginLeft: "20px",
                        marginBottom: "3px",
                      }}
                    >
                      • {lead.f_created_date} | <b>Booked at</b> {lead.booked_at} <b>with</b> {lead.sales_rep} - {lead.setter} | <b>Status:</b> {lead.status}
                    </h3>
                  )

                  break
                default:
                  break;
              }
            })}

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
                  transition: "background 0.3s",
                  ":hover": { background: "#27293D" },
                }}
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: "8px",
                      borderRight: "1px solid #525F7F",
                      color: "#c4c4c4",
                      textTransform:
                        cell.column.id === "full_name" ? "capitalize" : "none",
                    }}
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
          onClick={() =>
            gotoPage(Math.ceil(props.dataList.length / pageSize) - 1)
          }
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
