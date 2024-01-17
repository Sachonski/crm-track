import React, { useMemo, useState } from "react";
import { useTable, usePagination } from "react-table";
import "react-datepicker/dist/react-datepicker.css";

const LeadsTable = (props) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState([]);
  const [selectedLeadName, setSelectedLeadName] = useState("")

  async function setter(querySearch,type) {
    const response = await props.fetchQuery(querySearch)

    const responseConType = response.map(obj => ({ ...obj, type }));
    console.log(responseConType)

    setSelectedLead(prevData =>[...prevData,...responseConType]);

    console.log(selectedLead)
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
    setSelectedLead([])
    setSelectedLeadName(lead.full_name)
    const querySearch ="SELECT c.email AS contact_email, c.full_name AS contact_full_name, c.phone, c.sales_rep AS contact_sales_rep, c.fk_sorfware_id, MAX(DATE_FORMAT(c.created_date, '%Y-%m-%d %H:%i')) AS contact_created_date, c.utm_source, (SELECT full_name FROM Bookings WHERE email = c.email LIMIT 1) AS booking_full_name, (SELECT setter FROM Bookings WHERE email = c.email LIMIT 1) AS booking_setter, (SELECT sales_rep FROM Bookings WHERE email = c.email LIMIT 1) AS booking_sales_rep, (SELECT created_at FROM Bookings WHERE email = c.email LIMIT 1) AS booking_created_at, (SELECT booked_at FROM Bookings WHERE email = c.email LIMIT 1) AS booking_booked_at, (SELECT status FROM Bookings WHERE email = c.email LIMIT 1) AS booking_status, (SELECT payment_amount FROM Payments WHERE fk_contact = c.id LIMIT 1) AS payment_amount, (SELECT product_name FROM Payments WHERE fk_contact = c.id LIMIT 1) AS payment_product_name, (SELECT product_description FROM Payments WHERE fk_contact = c.id LIMIT 1) AS payment_product_description, (SELECT subscription_id FROM Payments WHERE fk_contact = c.id LIMIT 1) AS payment_subscription_id, (SELECT payment_date FROM Payments WHERE fk_contact = c.id LIMIT 1) AS payment_date, (SELECT software_description FROM Softwares WHERE id = c.fk_sorfware_id LIMIT 1) AS software_description, (SELECT funnel_id FROM Softwares WHERE id = c.fk_sorfware_id LIMIT 1) AS software_funnel_id, (SELECT step_id FROM Softwares WHERE id = c.fk_sorfware_id LIMIT 1) AS software_step_id, (SELECT funnel_name FROM Softwares WHERE id = c.fk_sorfware_id LIMIT 1) AS software_funnel_name, (SELECT step_name FROM Softwares WHERE id = c.fk_sorfware_id LIMIT 1) AS software_step_name FROM Contacts c WHERE c.email = '"+ lead.email + "' GROUP BY c.email, c.fk_sorfware_id, DATE_FORMAT(c.created_date, '%Y-%m-%d %H:%i');";
    const bookingQuery = `SELECT *,DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') as f_created_date,DATE_FORMAT(booked_at, '%Y-%m-%d %H:%i') as booked_at FROM Bookings WHERE Email = '${lead.email}' AND Status != 'canceled'`
    const contactQuery = `SELECT Contacts.*, DATE_FORMAT(Contacts.created_date, '%Y-%m-%d %H:%i') AS f_created_date, Softwares.* FROM Contacts LEFT JOIN Payments ON Contacts.id = Payments.fk_contact LEFT JOIN Softwares ON Contacts.fk_sorfware_id = Softwares.id WHERE Contacts.email = '${lead.email}' AND Payments.fk_contact IS NULL AND Contacts.fk_sorfware_id IS NOT NULL AND Contacts.fk_bookings IS NULL`;
    const paymentQuery = `SELECT Payments.*, COALESCE(DATE_FORMAT(Payments.first_payment_date, '%Y-%m-%d %H:%i'), DATE_FORMAT(Payments.payment_date, '%Y-%m-%d %H:%i')) AS f_created_date, Softwares.funnel_id, Softwares.step_id, Softwares.funnel_name, Softwares.step_name FROM Payments INNER JOIN Contacts ON Payments.fk_contact = Contacts.id LEFT JOIN Softwares ON Payments.fk_software = Softwares.id WHERE Contacts.email = '${lead.email}'`;
    setter(bookingQuery,"booking")
    setter(contactQuery,"contact")
    setter(paymentQuery,"payment")
      .then(setPopupVisible(true))
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

            <h3>
              Journey details for{" "}
              {selectedLeadName}
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
                      }}
                    >
                      • {lead.f_created_date} | <b>Funnel:</b> {lead.funnel_name}{" "}
                      | <b>Step:</b> {lead.step_name}
                    </h3>
                  );
                  break;
                  case "booking":

                    return(
                      <h3
                      style={{
                        color: "orange",
                        textTransform: "capitalize",
                        fontSize: "13px",
                        marginLeft: "20px",
                      }}
                    >
                      • {lead.f_created_date} | <b>Booked at</b> {lead.booked_at} with {lead.sales_rep} - {lead.setter} | <b>Status:</b> {lead.status}
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
