import React from "react";
import {useState, useEffect} from "react"

const ListDisplay = ({ dataList , totalResults, handleSearch}) => {
  const [pageSize,setPageSize] = useState(10)
  const [pageIndex, setPageIndex] = useState(0)
  const paginas = [];
  if(totalResults){
    for (let i = 0; i < totalResults && i < 5; i++) {
    paginas.push(<button key={i}>{i + 1}</button>);
  }
}


  return (
    <div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #525F7F",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Sales Rep</th>
            <th>Sales</th>
            <th>Origin Source</th>
            <th>Last Source</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((item, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #525F7F" }}>
              <td>{item.created_date}</td>
              <td>{item.full_name}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td>{item.sales_rep}</td>
              <td>{item.sales}</td>
              <td>{item.utm_source}</td>
              <td>{item.lastSource}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <span>
          Page {pageIndex + 1} of {Math.ceil(totalResults / pageSize)}
        </span>
        <button>
          {"<<"}
        </button>
        <button>
          Previous
        </button>
        <button key="1" onClick={(e)=>{handleSearch(1)}}> 1</button>
        <button key="2"> 2</button>
        <button key="3"> 3</button>
        <button key="4"> 4</button>
        <button>
          Next
        </button>
        <button>
          {">>"}
        </button>
      </div>
    </div>
  );
};

export default ListDisplay;